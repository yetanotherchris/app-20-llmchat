# Quick Start

## Installation

```bash
npm install app-20-llmchat
```

## Basic Usage

```tsx
import { LLMChat } from 'app-20-llmchat'

function App() {
  const [messages, setMessages] = useState([])
  const [draft, setDraft] = useState('')
  const [status, setStatus] = useState('idle')

  const handleSend = () => {
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', content: draft }])
    setDraft('')
  }

  return (
    <LLMChat.Root
      messages={messages}
      draft={draft}
      status={status}
      onChangeDraft={setDraft}
      onSubmit={handleSend}
      onStop={() => {}}
      onLoadEarlier={() => {}}
    >
      <LLMChat.Conversation />
      <LLMChat.PromptInput />
    </LLMChat.Root>
  )
}
```

## With Custom States

```tsx
import { LLMChat } from 'app-20-llmchat'

function ChatView() {
  return (
    <LLMChat.Root
      messages={messages}
      draft={draft}
      status={status}
      onChangeDraft={setDraft}
      onSubmit={handleSend}
      onStop={handleStop}
      onLoadEarlier={handleLoadEarlier}
      renderEmptyState={() => <CustomEmpty />}
      renderLoadingState={() => <CustomLoading />}
      renderTypingState={() => <CustomTyping />}
      renderErrorState={() => <CustomError />}
    >
      <LLMChat.Conversation />
      <LLMChat.PromptInput />
    </LLMChat.Root>
  )
}
```

## With Theme

```tsx
import { LLMChat } from 'app-20-llmchat'

function ThemedChat() {
  return (
    <LLMChat.Root
      messages={messages}
      draft={draft}
      status={status}
      theme="dark"
      onChangeDraft={setDraft}
      onSubmit={handleSend}
      onStop={handleStop}
      onLoadEarlier={handleLoadEarlier}
    >
      <LLMChat.Conversation />
      <LLMChat.PromptInput />
    </LLMChat.Root>
  )
}
```

## Props Reference

### LLMChat.Root

| Prop | Type | Description |
|------|------|-------------|
| `messages` | `readonly Message[]` | Array of messages to display |
| `draft` | `string` | Current draft text |
| `status` | `ChatStatus` | Current chat status |
| `onChangeDraft` | `(value: string) => void` | Draft change handler |
| `onSubmit` | `() => void` | Submit handler |
| `onStop` | `() => void` | Stop generation handler |
| `onLoadEarlier` | `() => void` | Load earlier messages handler |
| `theme` | `ThemeName` | Theme name ('light' or 'dark') |

See the [API Reference](./api-reference/) for complete prop documentation.
