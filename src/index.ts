import { Chat } from './components/LLMChat.Root'
import { MessageList } from './components/LLMChat.Conversation'
import { Composer } from './components/LLMChat.PromptInput'
import { MessageBubble } from './components/LLMChat.Bubble'
import { MessageStatusBadge } from './components/LLMChat.Status'
import { SendButton } from './components/LLMChat.SendButton'
import { StopButton } from './components/LLMChat.StopButton'
import { ScrollToLatestControl } from './components/LLMChat.ScrollToLatest'
import { LoadEarlierControl } from './components/LLMChat.LoadEarlier'
import { UnreadBadge } from './components/LLMChat.UnreadBadge'
import { EmptyState } from './components/LLMChat.EmptyState'
import { LoadingState } from './components/LLMChat.LoadingState'
import { TypingState } from './components/LLMChat.TypingState'
import { ErrorState } from './components/LLMChat.ErrorState'

import type { ChatProps } from './components/LLMChat.Root'
import type { MessageListProps } from './components/LLMChat.Conversation'
import type { ComposerProps } from './components/LLMChat.PromptInput'
import type { MessageBubbleProps } from './components/LLMChat.Bubble'
import type { MessageStatusBadgeProps } from './components/LLMChat.Status'
import type { SendButtonProps } from './components/LLMChat.SendButton'
import type { StopButtonProps } from './components/LLMChat.StopButton'
import type { ScrollToLatestControlProps } from './components/LLMChat.ScrollToLatest'
import type { LoadEarlierControlProps } from './components/LLMChat.LoadEarlier'
import type { UnreadBadgeProps } from './components/LLMChat.UnreadBadge'

export const LLMChat = {
  Root: Chat,
  Conversation: MessageList,
  PromptInput: Composer,
  Bubble: MessageBubble,
  Status: MessageStatusBadge,
  SendButton,
  StopButton,
  ScrollToLatest: ScrollToLatestControl,
  LoadEarlier: LoadEarlierControl,
  UnreadBadge,
  EmptyState,
  LoadingState,
  TypingState,
  ErrorState,
}

export type {
  ChatProps as LLMChatRootProps,
  MessageListProps as LLMChatConversationProps,
  ComposerProps as LLMChatPromptInputProps,
  MessageBubbleProps as LLMChatBubbleProps,
  MessageStatusBadgeProps as LLMChatStatusProps,
  SendButtonProps as LLMChatSendButtonProps,
  StopButtonProps as LLMChatStopButtonProps,
  ScrollToLatestControlProps as LLMChatScrollToLatestProps,
  LoadEarlierControlProps as LLMChatLoadEarlierProps,
  UnreadBadgeProps as LLMChatUnreadBadgeProps,
}

export { ActionMenu } from './components/ActionMenu'
export type { ActionMenuProps } from './components/ActionMenu'
export { MessageActions } from './components/MessageActions'
export type { MessageActionsProps } from './components/MessageActions'
export { MessageRendererBoundary } from './components/MessageRendererBoundary'
export type { MessageRendererBoundaryProps } from './components/MessageRendererBoundary'
export { useAutogrowHeight } from './hooks/useAutogrowHeight'
export type { AutogrowHeightOptions, AutogrowHeightState } from './hooks/useAutogrowHeight'
export { ContentRenderer } from './rendering/ContentRenderer'
export type { ContentRendererProps, ContentPartRendererProps } from './rendering/ContentRenderer'
export { MarkdownText } from './rendering/MarkdownText'
export type { MarkdownTextProps } from './rendering/MarkdownText'
export { PlainText } from './rendering/PlainText'
export type { PlainTextProps } from './rendering/PlainText'
export { CodeBlock } from './rendering/CodeBlock'
export type { CodeBlockProps, CopyState } from './rendering/CodeBlock'
export { MarkdownRenderer } from './rendering/MarkdownRenderer'
export type {
  MarkdownRendererOptions,
  MarkdownElementRenderers,
  MarkdownElementName,
} from './rendering/MarkdownRenderer'
export { useAtBottom, distanceFromBottom, isNearBottom } from './hooks/useAtBottom'
export type { ScrollMetrics, AtBottomState } from './hooks/useAtBottom'
export { useUnreadCount, computeUnreadCount } from './hooks/useUnreadCount'
export type { UnreadCountState } from './hooks/useUnreadCount'
export { ThemeProvider, useTheme } from './theme/ThemeContext'
export type { ThemeProviderProps, ThemeContextValue } from './theme/ThemeContext'
export { resolveTheme, themeBaseForName } from './theme/resolveTheme'
export type { ResolvedThemeBase } from './theme/resolveTheme'
export { lightTheme, darkTheme, baseThemes, highContrastThemes } from './theme/themes'
export { relativeLuminance, contrastRatio } from './theme/contrast'
export { useSystemAccessibility } from './accessibility/useSystemAccessibility'
export type {
  SystemAccessibility,
  AccessibilityOverrides,
} from './accessibility/useSystemAccessibility'
export { useFocusRing, focusRingStyleFor } from './accessibility/useFocusRing'
export type { FocusRingState } from './accessibility/useFocusRing'
export { useMessageFocusPreservation } from './accessibility/useMessageFocusPreservation'
export { useDomFocusOutlineRef } from './accessibility/useDomFocusOutlineRef'
export { minTouchTarget } from './accessibility/minTouchTarget'
export { MESSAGE_STATUS_PRESENTATION, CHAT_STATUS_PRESENTATION } from './accessibility/status'
export type { StatusPresentation } from './accessibility/status'
export { ChatStatusText } from './components/ChatStatusText'
export type { ChatStatusTextProps } from './components/ChatStatusText'
export { StatusIndicator } from './components/StatusIndicator'
export type { StatusIndicatorProps } from './components/StatusIndicator'
export { useChatSession } from './session/useChatSession'
export type {
  ChatSession,
  ChatSessionOptions,
  ChatSessionControls,
  ChatOperation,
  OperationKind,
} from './session/types'
export { defaultIcons, renderIcon } from './icons'
export type { IconProps } from './icons'
export type { Message, MessageRole, MessageStatus, ContentPart, VisibleRange } from './types'
export type {
  ChatTheme,
  ChatThemeColors,
  ChatThemeRadii,
  ChatThemeSpacing,
  ChatThemeTypography,
  ThemeInput,
  ThemeName,
  ContrastMode,
  SurfaceName,
  SurfaceStyleOverrides,
  MessageAction,
  IconName,
  ChatStatus,
  CapabilityName,
  Capabilities,
  ContentTypeKey,
  DeepPartial,
} from './theme/types'
