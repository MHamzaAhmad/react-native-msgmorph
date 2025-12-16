# MsgMorph React Native SDK

Native feedback widget and live chat for React Native apps.

## Installation

```bash
npm install @msgmorph/react-native
# or
yarn add @msgmorph/react-native
# or
pnpm add @msgmorph/react-native
```

## Quick Start

```tsx
import { MsgMorph, MsgMorphProvider } from '@msgmorph/react-native';

// 1. Wrap your app with the provider
function App() {
  return (
    <MsgMorphProvider
      widgetId="YOUR_WIDGET_ID"
      apiBaseUrl="https://api.msgmorph.com"
    >
      <YourApp />
    </MsgMorphProvider>
  );
}

// 2. Use launcher components anywhere
import { FloatingLauncher, SettingsButton } from '@msgmorph/react-native';

// FAB button
<FloatingLauncher />

// Settings row
<SettingsButton title="Send Feedback" />

// Or open programmatically
const { show, showFeedback, showLiveChat } = useMsgMorph();
```

## Documentation

See the [MsgMorph Documentation](https://docs.msgmorph.com) for full details.
