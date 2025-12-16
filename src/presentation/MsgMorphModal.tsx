/**
 * MsgMorph React Native SDK - Modal Container
 */

import React, { useState, useMemo } from 'react';
import { Modal, View, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import type { WidgetConfig, WidgetScreen, FeedbackType } from '../core/types';
import { createTheme, createStyles } from './theme';
import { HomeScreen } from './screens/HomeScreen';
import { ComposeScreen } from './screens/ComposeScreen';
import { SuccessScreen } from './screens/SuccessScreen';
import { ChatScreen } from './screens/ChatScreen';
import { PreChatFormScreen } from './screens/PreChatFormScreen';
import { ChatRatingScreen } from './screens/ChatRatingScreen';

export interface MsgMorphModalProps {
    visible: boolean;
    onClose: () => void;
    config: WidgetConfig;
    initialScreen?: WidgetScreen;
    initialFeedbackType?: FeedbackType;
}

export function MsgMorphModal({
    visible,
    onClose,
    config,
    initialScreen = 'home',
    initialFeedbackType,
}: MsgMorphModalProps) {
    const [currentScreen, setCurrentScreen] = useState<WidgetScreen>(initialScreen);
    const [feedbackType, setFeedbackType] = useState<FeedbackType | undefined>(initialFeedbackType);
    const [preChatData, setPreChatData] = useState<{ name?: string; email?: string }>({});

    const theme = useMemo(() => createTheme(config.branding), [config.branding]);
    const styles = useMemo(() => createStyles(theme), [theme]);

    const handleSelectFeedbackType = (type: FeedbackType) => {
        setFeedbackType(type);
        setCurrentScreen('compose');
    };

    const handleStartLiveChat = () => {
        if (config.preChatForm?.enabled) {
            setCurrentScreen('preChatForm');
        } else {
            setCurrentScreen('liveChat');
        }
    };

    const handlePreChatSubmit = (name: string, email: string) => {
        setPreChatData({ name, email });
        setCurrentScreen('liveChat');
    };

    const handleFeedbackSubmitted = () => {
        setCurrentScreen('success');
    };

    const handleSendAnother = () => {
        setFeedbackType(undefined);
        setCurrentScreen('home');
    };

    const handleBack = () => {
        switch (currentScreen) {
            case 'compose':
            case 'success':
            case 'preChatForm':
                setFeedbackType(undefined);
                setCurrentScreen('home');
                break;
            case 'liveChat':
                setCurrentScreen('chatRating');
                break;
            case 'chatRating':
                setCurrentScreen('home');
                break;
            default:
                onClose();
        }
    };

    const handleChatEnd = () => {
        setCurrentScreen('chatRating');
    };

    const handleRatingComplete = () => {
        setCurrentScreen('home');
        onClose();
    };

    // Reset screen when modal opens
    React.useEffect(() => {
        if (visible) {
            setCurrentScreen(initialScreen);
            setFeedbackType(initialFeedbackType);
        }
    }, [visible, initialScreen, initialFeedbackType]);

    const renderScreen = () => {
        switch (currentScreen) {
            case 'home':
                return (
                    <HomeScreen
                        config={config}
                        theme={theme}
                        styles={styles}
                        onClose={onClose}
                        onSelectFeedbackType={handleSelectFeedbackType}
                        onStartLiveChat={handleStartLiveChat}
                    />
                );
            case 'compose':
                return (
                    <ComposeScreen
                        config={config}
                        theme={theme}
                        styles={styles}
                        feedbackType={feedbackType || 'FEEDBACK'}
                        onClose={onClose}
                        onBack={handleBack}
                        onSubmitted={handleFeedbackSubmitted}
                    />
                );
            case 'success':
                return (
                    <SuccessScreen
                        config={config}
                        theme={theme}
                        styles={styles}
                        onClose={onClose}
                        onSendAnother={handleSendAnother}
                    />
                );
            case 'preChatForm':
                return (
                    <PreChatFormScreen
                        config={config}
                        theme={theme}
                        styles={styles}
                        onClose={onClose}
                        onBack={handleBack}
                        onSubmit={handlePreChatSubmit}
                    />
                );
            case 'liveChat':
                return (
                    <ChatScreen
                        config={config}
                        theme={theme}
                        styles={styles}
                        preChatData={preChatData}
                        onClose={onClose}
                        onBack={handleBack}
                        onEnd={handleChatEnd}
                    />
                );
            case 'chatRating':
                return (
                    <ChatRatingScreen
                        theme={theme}
                        styles={styles}
                        onComplete={handleRatingComplete}
                        onSkip={() => {
                            setCurrentScreen('home');
                            onClose();
                        }}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <SafeAreaView style={modalStyles.container}>
                <KeyboardAvoidingView
                    style={modalStyles.flex1}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <View style={[modalStyles.flex1, { backgroundColor: theme.backgroundColor }]}>
                        {renderScreen()}
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </Modal>
    );
}

const modalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    flex1: {
        flex: 1,
    },
});
