/**
 * MsgMorph React Native SDK - Floating Launcher
 */

import React from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import { useMsgMorph } from '../../context/MsgMorphContext';

export interface FloatingLauncherProps {
    /** Position on screen */
    position?: 'bottom-right' | 'bottom-left';
    /** Background color override */
    backgroundColor?: string;
    /** Icon emoji or custom content */
    icon?: string;
    /** Size of the button */
    size?: number;
    /** Bottom offset */
    bottom?: number;
    /** Side offset */
    side?: number;
}

export function FloatingLauncher({
    position = 'bottom-right',
    backgroundColor,
    icon = '💬',
    size = 56,
    bottom = 24,
    side = 24,
}: FloatingLauncherProps) {
    const { show, config } = useMsgMorph();

    const primaryColor = backgroundColor || config?.branding?.primaryColor || '#007AFF';

    return (
        <TouchableOpacity
            style={[
                styles.container,
                {
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    backgroundColor: primaryColor,
                    bottom,
                    [position === 'bottom-right' ? 'right' : 'left']: side,
                },
            ]}
            onPress={show}
            activeOpacity={0.8}
        >
            <Text style={styles.icon}>{icon}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    icon: {
        fontSize: 24,
    },
});
