/**
 * MsgMorph React Native SDK - Success Screen
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { WidgetConfig } from '../../core/types';
import type { MsgMorphTheme, MsgMorphStyles } from '../theme';

interface SuccessScreenProps {
    config: WidgetConfig;
    theme: MsgMorphTheme;
    styles: MsgMorphStyles;
    onClose: () => void;
    onSendAnother: () => void;
}

export function SuccessScreen({
    config,
    theme,
    styles,
    onClose,
    onSendAnother,
}: SuccessScreenProps) {
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onSendAnother} style={styles.headerButton}>
                    <Text style={{ fontSize: 24, color: theme.secondaryTextColor }}>‹</Text>
                </TouchableOpacity>
                <View style={styles.flex1} />
                <TouchableOpacity onPress={onClose} style={styles.headerButton}>
                    <Text style={{ fontSize: 24, color: theme.secondaryTextColor }}>×</Text>
                </TouchableOpacity>
            </View>

            {/* Content */}
            <View style={[styles.container, styles.center]}>
                {/* Success Icon */}
                <View style={[localStyles.iconContainer, { backgroundColor: `${theme.primaryColor}15` }]}>
                    <Text style={{ fontSize: 36, color: theme.primaryColor }}>✓</Text>
                </View>

                {/* Message */}
                <Text style={[styles.heading, { marginTop: 24, textAlign: 'center' }]}>
                    Message sent!
                </Text>
                <Text style={[styles.subheading, { textAlign: 'center', marginHorizontal: 32 }]}>
                    {config.branding.thankYouMessage ||
                        "Thanks for reaching out. We'll get back to you soon."}
                </Text>

                {/* Send Another */}
                <TouchableOpacity style={{ marginTop: 32 }} onPress={onSendAnother}>
                    <Text style={{ color: theme.secondaryTextColor, fontWeight: '500' }}>
                        Send another message
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    Powered by <Text style={{ fontWeight: '600' }}>MsgMorph</Text>
                </Text>
            </View>
        </View>
    );
}

const localStyles = StyleSheet.create({
    iconContainer: {
        width: 72,
        height: 72,
        borderRadius: 36,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
