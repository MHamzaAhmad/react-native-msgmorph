/**
 * MsgMorph React Native SDK
 * 
 * Native feedback widget and live chat for React Native apps.
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
export type { MsgMorphProviderProps } from './context/MsgMorphContext';

export { ChatProvider, useChat } from './context/ChatContext';
export type { ChatProviderProps } from './context/ChatContext';

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
