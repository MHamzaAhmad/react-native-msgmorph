/**
 * MsgMorph React Native SDK
 * 
 * Native feedback widget and live chat for React Native apps.
 * 
 * ## Quick Start
 * 
 * ```tsx
 * import { MsgMorphProvider, useMsgMorph, FloatingLauncher } from '@msgmorph/react-native';
 * 
 * // 1. Wrap your app
 * function App() {
 *   return (
 *     <MsgMorphProvider widgetId="wgt_xxx" apiBaseUrl="https://api.msgmorph.com">
 *       <MainContent />
 *     </MsgMorphProvider>
 *   );
 * }
 * 
 * // 2. Use built-in launchers
 * function MainContent() {
 *   return <FloatingLauncher />;
 * }
 * 
 * // 3. Or use headless APIs
 * function CustomUI() {
 *   const { startChat, sendMessage, createChatClient } = useMsgMorph();
 *   // Build your own UI!
 * }
 * ```
 */

export const VERSION = '0.1.0';

// Core types
export type {
  WidgetConfig,
  WidgetBranding,
  WidgetItem,
  ChatSession,
  ChatMessage,
  FeedbackRequest,
  DeviceContext,
  MsgMorphConfig,
  WidgetScreen,
  FeedbackType,
  StartChatResult,
} from './core/types';

export type {
  ChatSessionStatusType,
  MessageSenderTypeValue,
  CollectionRequirementType,
} from './core/constants';

export {
  FeedbackTypes,
  FeedbackTypeMeta,
  ChatSessionStatus,
  MessageSenderType,
  CollectionRequirement,
} from './core/constants';

// Context and hooks
export { MsgMorphProvider, useMsgMorph } from './context/MsgMorphContext';
export type { MsgMorphProviderProps, StartChatParams } from './context/MsgMorphContext';

export { ChatProvider, useChat } from './context/ChatContext';
export type { ChatProviderProps } from './context/ChatContext';

// Chat Client (for real-time updates)
export { ChatClient } from './core/ChatClient';

// Services (Advanced usage)
export { ApiClient } from './data/api-client';
export { SocketService } from './data/socket-service';

// Launchers
export { FloatingLauncher } from './presentation/launchers/FloatingLauncher';
export type { FloatingLauncherProps } from './presentation/launchers/FloatingLauncher';

export { SettingsButton } from './presentation/launchers/SettingsButton';
export type { SettingsButtonProps } from './presentation/launchers/SettingsButton';

export { EdgeRibbon } from './presentation/launchers/EdgeRibbon';
export type { EdgeRibbonProps } from './presentation/launchers/EdgeRibbon';

export { InlineButton } from './presentation/launchers/InlineButton';
export type { InlineButtonProps } from './presentation/launchers/InlineButton';

// Theme
export { createTheme, createStyles } from './presentation/theme';
export type { MsgMorphTheme, MsgMorphStyles } from './presentation/theme';

