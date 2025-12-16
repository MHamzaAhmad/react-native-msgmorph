/**
 * MsgMorph React Native SDK - Offline Screen
 * 
 * Shown when no agents are available for live chat.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { WidgetConfig } from '../../core/types';
import type { MsgMorphTheme, MsgMorphStyles } from '../theme';

interface OfflineScreenProps {
    config: WidgetConfig;
    theme: MsgMorphTheme;
    styles: MsgMorphStyles;
    onBack: () => void;
    onClose: () => void;
    hasOtherOptions: boolean;
}

export function OfflineScreen({
    config,
    theme,
    styles,
    onBack,
    onClose,
    hasOtherOptions,
}: OfflineScreenProps) {
    const offlineMessage =
        config.offlineMessage ||
        "Our team is unavailable right now. Please try again later or leave us a message.";

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                {hasOtherOptions ? (
                    <TouchableOpacity onPress={onBack} style={styles.headerButton}>
                        <Text style={{ fontSize: 24, color: theme.secondaryTextColor }}>‹</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={{ width: 48 }} />
                )}
                <View style={{ flex: 1 }} />
                <TouchableOpacity onPress={onClose} style={styles.headerButton}>
                    <Text style={{ fontSize: 24, color: theme.secondaryTextColor }}>×</Text>
                </TouchableOpacity>
            </View>

            {/* Content */}
            <View style={localStyles.content}>
                {/* Clock Icon */}
                <View
                    style={[
                        localStyles.iconContainer,
                        { backgroundColor: `${theme.primaryColor}15` },
                    ]}
                >
                    <Text style={{ fontSize: 28, color: theme.primaryColor }}>🕐</Text>
                </View>

                {/* Title */}
                <Text style={[localStyles.title, { color: theme.textColor }]}>
                    We're currently offline
                </Text>

                {/* Message */}
                <Text style={[localStyles.message, { color: theme.secondaryTextColor }]}>
                    {offlineMessage}
                </Text>

                {/* Leave a message button */}
                {hasOtherOptions && (
                    <TouchableOpacity
                        style={[localStyles.button, { backgroundColor: theme.surfaceColor }]}
                        onPress={onBack}
                    >
                        <Text style={[localStyles.buttonText, { color: theme.textColor }]}>
                            Leave a message instead
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Footer */}
            <View style={[styles.footer, { borderTopColor: theme.borderColor }]}>
                <Text style={{ fontSize: 12, color: theme.secondaryTextColor }}>
                    Powered by <Text style={{ fontWeight: '600' }}>MsgMorph</Text>
                </Text>
            </View>
        </View>
    );
}

const localStyles = StyleSheet.create({
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
        textAlign: 'center',
    },
    message: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 24,
    },
    button: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 20,
    },
    buttonText: {
        fontSize: 14,
        fontWeight: '500',
    },
});
