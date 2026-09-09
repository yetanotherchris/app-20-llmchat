# app-20-llmchat

React component library for LLM chat interfaces.

## Installation

```bash
npm install app-20-llmchat
```

## Usage

```tsx
import { LLMChat } from 'app-20-llmchat'

function ChatView() {
  return (
    <LLMChat.Root messages={messages} onSend={handleSend}>
      <LLMChat.Conversation />
      <LLMChat.PromptInput />
    </LLMChat.Root>
  )
}
```

## Components

| Component | Description |
|-----------|-------------|
| `LLMChat.Root` | Main container component |
| `LLMChat.Conversation` | Message list |
| `LLMChat.PromptInput` | Text input composer |
| `LLMChat.Bubble` | Individual message bubble |
| `LLMChat.Status` | Message status badge |
| `LLMChat.SendButton` | Send action button |
| `LLMChat.StopButton` | Stop generation button |
| `LLMChat.ScrollToLatest` | Scroll-to-bottom control |
| `LLMChat.LoadEarlier` | Load older messages control |
| `LLMChat.UnreadBadge` | Unread count badge |
| `LLMChat.EmptyState` | Empty conversation state |
| `LLMChat.LoadingState` | Loading indicator |
| `LLMChat.TypingState` | Typing indicator |
| `LLMChat.ErrorState` | Error display state |

## Documentation

Visit the [documentation site](https://yetanotherchris.github.io/app-20-llmchat) for full API reference, recipes, and migration guide.

## License

MIT
