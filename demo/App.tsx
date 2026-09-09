import { useState, useCallback } from 'react'
import { LLMChat } from '../src/index'
import type { Message } from '../src/types'

const SAMPLE_MESSAGES: Message[] = [
  {
    id: '1',
    role: 'user',
    contentParts: [{ kind: 'text', format: 'plain', text: 'What is the capital of France?' }],
    status: 'complete',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    role: 'assistant',
    contentParts: [{ kind: 'text', format: 'plain', text: 'The capital of France is Paris.' }],
    status: 'complete',
    createdAt: new Date().toISOString(),
  },
]

export function App() {
  const [messages, setMessages] = useState<Message[]>(SAMPLE_MESSAGES)
  const [draft, setDraft] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'streaming'>('idle')

  const handleSubmit = useCallback(() => {
    if (!draft.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      contentParts: [{ kind: 'text', format: 'plain', text: draft }],
      status: 'complete',
      createdAt: new Date().toISOString(),
    }

    setMessages(prev => [...prev, userMessage])
    setDraft('')
    setStatus('submitting')

    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        contentParts: [{ kind: 'text', format: 'plain', text: `You said: "${userMessage.contentParts[0].text}"` }],
        status: 'complete',
        createdAt: new Date().toISOString(),
      }
      setMessages(prev => [...prev, assistantMessage])
      setStatus('idle')
    }, 1000)
  }, [draft])

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <LLMChat.Root
        messages={messages}
        draft={draft}
        status={status}
        onChangeDraft={setDraft}
        onSubmit={handleSubmit}
        onStop={() => {}}
        onLoadEarlier={() => {}}
      >
        <LLMChat.Conversation />
        <LLMChat.PromptInput />
      </LLMChat.Root>
    </div>
  )
}
