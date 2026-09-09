# Migration Guide: @app-20/chat to app-20-llmchat

This guide covers migrating from the `@app-20/chat` package to the new `app-20-llmchat` package.

## Package Changes

| Before | After |
|--------|-------|
| `@app-20/chat` | `app-20-llmchat` |
| `private: true` | `private: false` |
| `version: 0.3.0` | `version: 1.0.0` |

## Install

```bash
# Remove old package
npm uninstall @app-20/chat

# Install new package
npm install app-20-llmchat
```

## Component Import Changes

The main export changed from `Chat` to `LLMChat` namespace with dot-notation sub-components.

### Before

```tsx
import {
  Chat,
  MessageList,
  Composer,
  MessageBubble,
  MessageStatusBadge,
  SendButton,
  StopButton,
  ScrollToLatestControl,
  LoadEarlierControl,
  UnreadBadge,
  EmptyState,
  LoadingState,
  TypingState,
  ErrorState,
} from '@app-20/chat'

function App() {
  return (
    <Chat messages={messages} onSend={handleSend}>
      <MessageList />
      <Composer />
    </Chat>
  )
}
```

### After

```tsx
import { LLMChat } from 'app-20-llmchat'

function App() {
  return (
    <LLMChat.Root messages={messages} onSend={handleSend}>
      <LLMChat.Conversation />
      <LLMChat.PromptInput />
    </LLMChat.Root>
  )
}
```

## Component Mapping

| Old Component | New Component | File |
|---------------|---------------|------|
| `Chat` | `LLMChat.Root` | `LLMChat.Root.tsx` |
| `MessageList` | `LLMChat.Conversation` | `LLMChat.Conversation.tsx` |
| `Composer` | `LLMChat.PromptInput` | `LLMChat.PromptInput.tsx` |
| `MessageBubble` | `LLMChat.Bubble` | `LLMChat.Bubble.tsx` |
| `MessageStatusBadge` | `LLMChat.Status` | `LLMChat.Status.tsx` |
| `SendButton` | `LLMChat.SendButton` | `LLMChat.SendButton.tsx` |
| `StopButton` | `LLMChat.StopButton` | `LLMChat.StopButton.tsx` |
| `ScrollToLatestControl` | `LLMChat.ScrollToLatest` | `LLMChat.ScrollToLatest.tsx` |
| `LoadEarlierControl` | `LLMChat.LoadEarlier` | `LLMChat.LoadEarlier.tsx` |
| `UnreadBadge` | `LLMChat.UnreadBadge` | `LLMChat.UnreadBadge.tsx` |
| `EmptyState` | `LLMChat.EmptyState` | `LLMChat.EmptyState.tsx` |
| `LoadingState` | `LLMChat.LoadingState` | `LLMChat.LoadingState.tsx` |
| `TypingState` | `LLMChat.TypingState` | `LLMChat.TypingState.tsx` |
| `ErrorState` | `LLMChat.ErrorState` | `LLMChat.ErrorState.tsx` |

## Type Changes

| Old Type | New Type |
|----------|----------|
| `ChatProps` | `LLMChatRootProps` |
| `MessageListProps` | `LLMChatConversationProps` |
| `ComposerProps` | `LLMChatPromptInputProps` |
| `MessageBubbleProps` | `LLMChatBubbleProps` |
| `MessageStatusBadgeProps` | `LLMChatStatusProps` |
| `SendButtonProps` | `LLMChatSendButtonProps` |
| `StopButtonProps` | `LLMChatStopButtonProps` |
| `ScrollToLatestControlProps` | `LLMChatScrollToLatestProps` |
| `LoadEarlierControlProps` | `LLMChatLoadEarlierProps` |
| `UnreadBadgeProps` | `LLMChatUnreadBadgeProps` |

## Props Unchanged

All component props remain identical. Only the names changed, not the shapes.

## Unchanged Exports

The following exports retain their names and are still available as named imports:

- **Hooks**: `useAutogrowHeight`, `useAtBottom`, `useUnreadCount`, `useChatSession`, `useFocusRing`, `useMessageFocusPreservation`, `useDomFocusOutlineRef`, `useSystemAccessibility`
- **Theme**: `ThemeProvider`, `useTheme`, `resolveTheme`, `themeBaseForName`, `lightTheme`, `darkTheme`, `baseThemes`, `highContrastThemes`, `relativeLuminance`, `contrastRatio`
- **Rendering**: `ContentRenderer`, `MarkdownText`, `PlainText`, `CodeBlock`, `MarkdownRenderer`
- **Accessibility**: `minTouchTarget`, `MESSAGE_STATUS_PRESENTATION`, `CHAT_STATUS_PRESENTATION`
- **Icons**: `defaultIcons`, `renderIcon`
- **Internal**: `ActionMenu`, `MessageActions`, `MessageRendererBoundary`, `ChatStatusText`, `StatusIndicator`

## Common Pitfalls

### Both packages installed

During migration, both `@app-20/chat` and `app-20-llmchat` may be installed temporarily. This is fine, but ensure you import from `app-20-llmchat` in all new code.

### Old import paths

If you have a monorepo with workspace resolution, ensure your `package.json` or workspace config points to `app-20-llmchat` instead of `@app-20/chat`.

### TypeScript errors after migration

If TypeScript reports missing types, ensure you've updated all import paths to use the new component names. The old `Chat`, `MessageList`, etc. names are no longer exported from the package.

### Render props

If you use render props like `renderSend`, `renderStop`, or `renderScrollToLatest`, the prop types have been renamed:

- `SendButtonProps` → `LLMChatSendButtonProps`
- `StopButtonProps` → `LLMChatStopButtonProps`
- `ScrollToLatestControlProps` → `LLMChatScrollToLatestProps`

## Verification

After migration, verify:

1. `npm run typecheck` passes with zero errors
2. `npm run build` produces correct output
3. All components render correctly in your application
4. No references to `@app-20/chat` remain in your codebase:
   ```bash
   grep -r "@app-20/chat" src/
   ```
