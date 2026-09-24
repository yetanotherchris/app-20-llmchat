import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ChatStatus, MessageAction } from '../theme/types'
import type { Message, MessageStatus } from '../types'
import type {
  ChatOperation,
  ChatSession,
  ChatSessionControls,
  ChatSessionOptions,
  OperationKind,
} from './types'

let idCounter = 0
function nextId(): string {
  idCounter += 1
  return `${Date.now().toString(36)}-${idCounter.toString(36)}`
}

function nowIso(): string {
  return new Date().toISOString()
}

function plainText(message: Message): string {
  return message.contentParts.map((part) => ('text' in part ? part.text : '')).join('\n')
}

function findPromptFor(messages: readonly Message[], assistantMessageId: string): string {
  const index = messages.findIndex((message) => message.id === assistantMessageId)
  for (let i = index - 1; i >= 0; i--) {
    const candidate = messages[i]
    if (candidate?.role === 'user') return plainText(candidate)
  }
  return ''
}

interface ActiveOperation {
  op: ChatOperation
  content: string
  receivedReply: boolean
}

const STATUS_TRANSITION_MS = 1_000

/**
 * Operation-aware controller for the shared chat component (spec 006).
 * Owns the conversation's messages, chat status, and the current operation;
 * `Chat` stays presentational. Hosts wire the network transport through
 * `request` and drive the draft themselves (FR-009, FR-011). Transient statuses
 * (sending, streaming) are runtime-only (FR-012).
 */
export function useChatSession(options: ChatSessionOptions): ChatSession {
  const { request, copyMessageText } = options
  const messagesRef = useRef<Message[]>([...(options.initialMessages ?? [])])
  const [messages, setMessages] = useState<Message[]>(messagesRef.current)
  const [status, setStatus] = useState<ChatStatus>('idle')
  const currentOpRef = useRef<ActiveOperation | null>(null)
  const statusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearStatusTimer = useCallback(() => {
    if (statusTimerRef.current !== null) clearTimeout(statusTimerRef.current)
    statusTimerRef.current = null
  }, [])

  const scheduleStatus = useCallback(
    (opId: string, nextStatus: ChatStatus) => {
      clearStatusTimer()
      statusTimerRef.current = setTimeout(() => {
        statusTimerRef.current = null
        const current = currentOpRef.current
        if (current && current.op.id !== opId) return
        setStatus(nextStatus)
      }, STATUS_TRANSITION_MS)
    },
    [clearStatusTimer],
  )

  const scheduleSendStatus = useCallback(
    (opId: string) => {
      clearStatusTimer()
      statusTimerRef.current = setTimeout(() => {
        statusTimerRef.current = null
        const current = currentOpRef.current
        if (!current || current.op.id !== opId) return
        setStatus('sent')
        scheduleStatus(opId, 'waiting')
      }, STATUS_TRANSITION_MS)
    },
    [clearStatusTimer, scheduleStatus],
  )

  useEffect(() => clearStatusTimer, [clearStatusTimer])

  const setMessagesBoth = useCallback((next: readonly Message[]) => {
    messagesRef.current = [...next]
    setMessages(messagesRef.current)
  }, [])

  const hasInFlightOp = useCallback(() => {
    const current = currentOpRef.current
    return current !== null && !current.op.stopped
  }, [])

  const applyToResponse = useCallback(
    (op: ChatOperation, mutate: (message: Message) => Message, nextStatus?: ChatStatus) => {
      const messageExists = messagesRef.current.some((message) => message.id === op.messageId)
      if (!messageExists) return false
      setMessagesBoth(
        messagesRef.current.map((message) =>
          message.id === op.messageId ? mutate(message) : message,
        ),
      )
      if (nextStatus) setStatus(nextStatus)
      return true
    },
    [setMessagesBoth],
  )

  const appendChunk = useCallback(
    (opId: string, text: string) => {
      const current = currentOpRef.current
      if (!current) return
      if (current.op.id !== opId || current.op.stopped) return // stale or stopped op (FR-005)
      const content = current.content + text
      current.content = content
      const receivedFirstReply = !current.receivedReply
      current.receivedReply = true
      applyToResponse(
        current.op,
        (message) => {
          const response: Message = {
            ...message,
            status: 'streaming',
            updatedAt: nowIso(),
            contentParts: [{ kind: 'text', format: 'markdown', text: content }],
          }
          return response
        },
        receivedFirstReply ? 'replyReceived' : undefined,
      )
      if (receivedFirstReply) scheduleStatus(opId, 'streaming')
    },
    [applyToResponse, scheduleStatus],
  )

  const complete = useCallback(
    (opId: string) => {
      const current = currentOpRef.current
      if (!current || current.op.id !== opId || current.op.stopped) return
      currentOpRef.current = null
      clearStatusTimer()
      applyToResponse(
        current.op,
        (message) => ({ ...message, status: 'complete' as const }),
      )
      if (current.receivedReply) {
        setStatus('replyReceived')
        scheduleStatus(opId, 'idle')
      } else {
        setStatus('idle')
      }
    },
    [applyToResponse, clearStatusTimer, scheduleStatus],
  )

  const fail = useCallback(
    (opId: string) => {
      const current = currentOpRef.current
      if (!current || current.op.id !== opId || current.op.stopped) return
      currentOpRef.current = null
      clearStatusTimer()
      // Message-level failure: partial content is retained and the chat stays
      // usable (spec 006 clarification); the conversation-level error status is
      // host-set and renders the spec 005 ErrorState.
      applyToResponse(current.op, (message) => ({ ...message, status: 'error' as const }), 'idle')
    },
    [applyToResponse, clearStatusTimer],
  )

  const stop = useCallback(() => {
    const current = currentOpRef.current
    if (!current || current.op.stopped) return // FR-006: second Stop is a no-op
    current.op.stopped = true
    currentOpRef.current = null
    clearStatusTimer()
    // The transport's controls still read `op.stopped` on the same object, so
    // `stopRequested()` keeps returning true after the op is cleared.
    applyToResponse(current.op, (message) => ({ ...message, status: 'stopped' as const }), 'idle')
  }, [applyToResponse, clearStatusTimer])

  const startOperation = useCallback(
    (op: ChatOperation) => {
      currentOpRef.current = { op, content: '', receivedReply: false }
      const controls: ChatSessionControls = {
        appendChunk: (text) => appendChunk(op.id, text),
        complete: () => complete(op.id),
        fail: () => fail(op.id),
        stopRequested: () => op.stopped,
      }
      // A throwing or rejecting transport marks the response error instead of
      // leaving it stuck in `sending` (dropped-connection edge case).
      try {
        const result = request(op, controls)
        scheduleSendStatus(op.id)
        if (result && typeof result.then === 'function') {
          void result.then(undefined, () => fail(op.id))
        }
      } catch {
        fail(op.id)
      }
    },
    [appendChunk, complete, fail, request, scheduleSendStatus],
  )

  const submit = useCallback(
    (prompt: string) => {
      const trimmed = prompt.trim()
      if (trimmed.length === 0 || hasInFlightOp()) return // FR-008: no duplicate send
      const userMessage: Message = {
        id: nextId(),
        role: 'user',
        contentParts: [{ kind: 'text', format: 'plain', text: trimmed }],
        status: 'complete',
        createdAt: nowIso(),
      }
      const responseMessage: Message = {
        id: nextId(),
        role: 'assistant',
        contentParts: [{ kind: 'text', format: 'markdown', text: '' }],
        status: 'sending',
        createdAt: nowIso(),
      }
      const op: ChatOperation = {
        id: nextId(),
        kind: 'submit',
        prompt: trimmed,
        messageId: responseMessage.id,
        stopped: false,
      }
      setMessagesBoth([...messagesRef.current, userMessage, responseMessage])
      setStatus('sending')
      startOperation(op)
    },
    [hasInFlightOp, setMessagesBoth, setStatus, startOperation],
  )

  const reopenOperation = useCallback(
    (messageId: string, kind: OperationKind, expectedStatus: MessageStatus) => {
      if (hasInFlightOp()) return
      const target = messagesRef.current.find((message) => message.id === messageId)
      if (!target || target.role !== 'assistant' || target.status !== expectedStatus) return
      const op: ChatOperation = {
        id: nextId(),
        kind,
        prompt: findPromptFor(messagesRef.current, messageId),
        messageId,
        stopped: false,
      }
      setMessagesBoth(
        messagesRef.current.map((message) =>
          message.id === messageId
            ? {
                ...message,
                status: 'sending',
                updatedAt: nowIso(),
                contentParts: [{ kind: 'text', format: 'markdown', text: '' }],
              }
            : message,
        ),
      )
      setStatus('sending')
      startOperation(op)
    },
    [hasInFlightOp, setMessagesBoth, setStatus, startOperation],
  )

  const retry = useCallback(
    (messageId: string) => reopenOperation(messageId, 'retry', 'error'),
    [reopenOperation],
  )

  const regenerate = useCallback(
    (messageId: string) => reopenOperation(messageId, 'regenerate', 'complete'),
    [reopenOperation],
  )

  const copyMessage = useCallback(
    (message: Message) => {
      if (!copyMessageText) return
      void copyMessageText(message, plainText(message))
    },
    [copyMessageText],
  )

  const replaceMessages = useCallback(
    (next: readonly Message[]) => {
      currentOpRef.current = null
      clearStatusTimer()
      setMessagesBoth(next)
      setStatus('idle')
    },
    [clearStatusTimer, setMessagesBoth],
  )

  const messageActions = useMemo<readonly MessageAction[]>(
    () => [
      {
        id: 'copy',
        label: 'Copy message',
        group: 'Actions',
        available: () => Boolean(copyMessageText),
        onAction: (_action, message) => copyMessage(message),
      },
      {
        id: 'retry',
        label: 'Retry',
        group: 'Response',
        available: (message) =>
          !hasInFlightOp() && message.role === 'assistant' && message.status === 'error',
        onAction: (_action, message) => retry(message.id),
      },
      {
        id: 'regenerate',
        label: 'Regenerate',
        group: 'Response',
        available: (message) =>
          !hasInFlightOp() && message.role === 'assistant' && message.status === 'complete',
        onAction: (_action, message) => regenerate(message.id),
      },
    ],
    [copyMessageText, copyMessage, retry, regenerate, hasInFlightOp],
  )

  const onMessageAction = useCallback((action: MessageAction, message: Message) => {
    action.onAction(action, message)
  }, [])

  return {
    messages,
    status,
    submit,
    retry,
    regenerate,
    stop,
    appendChunk,
    complete,
    fail,
    copyMessage,
    replaceMessages,
    messageActions,
    onMessageAction,
  }
}
