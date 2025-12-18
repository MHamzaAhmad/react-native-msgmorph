# Changelog

All notable changes to this project will be documented in this file.

## [0.1.0] - 2024-12-17

### Added
- Initial release of MsgMorph React Native SDK
- **Feedback Widget** - Customizable feedback collection
  - Issue reporting, feature requests, general feedback
  - Email/name collection (required, optional, or none)
  - Success confirmation screen
- **Headless APIs** - Build custom UIs with `useMsgMorph` and `useChat` hooks
- **Live Chat** - Real-time chat with support agents
  - Agent availability detection with offline screen
  - Typing indicators
  - Message history persistence
  - Chat rating after session
- **Launcher Components**
  - `FloatingLauncher` - Floating action button
  - `SettingsButton` - Settings-style row button
  - `InlineButton` - Inline text button
  - `EdgeRibbon` - Edge-attached ribbon
- **Context Provider** - `MsgMorphProvider` for easy integration
- **Theming** - Automatic theme from widget configuration
- **Socket.IO** integration for real-time messaging
