/**
 * MsgMorph React Native SDK - Settings Button
 */

import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { useMsgMorph } from '../../context/MsgMorphContext';

export interface SettingsButtonProps {
    /** Title text */
    title?: string;
    /** Subtitle text */
    subtitle?: string;
    /** Icon emoji */
    icon?: string;
    /** Custom style */
    style?: object;
}

export function SettingsButton({
    title = 'Send Feedback',
    subtitle = 'Report bugs or request features',
    icon = '💬',
    style,
}: SettingsButtonProps) {
    const { show, config } = useMsgMorph();

    const primaryColor = config?.branding?.primaryColor || '#007AFF';

    return (
        <TouchableOpacity style={[styles.container, style]} onPress={show}>
            <View style={[styles.iconContainer, { backgroundColor: `${primaryColor}15` }]}>
                <Text style={styles.icon}>{icon}</Text>
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.title}>{title}</Text>
                {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </View>
            <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#FFFFFF',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        fontSize: 20,
    },
    textContainer: {
        flex: 1,
        marginLeft: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: '500',
        color: '#1C1C1E',
    },
    subtitle: {
        fontSize: 13,
        color: '#8E8E93',
        marginTop: 2,
    },
    chevron: {
        fontSize: 24,
        color: '#C7C7CC',
    },
});
