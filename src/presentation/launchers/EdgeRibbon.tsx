/**
 * MsgMorph React Native SDK - Edge Ribbon
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useMsgMorph } from '../../context/MsgMorphContext';

export interface EdgeRibbonProps {
    /** Position on screen */
    position?: 'right' | 'left';
    /** Label text */
    label?: string;
    /** Background color override */
    backgroundColor?: string;
    /** Vertical position from top */
    top?: number | string;
}

export function EdgeRibbon({
    position = 'right',
    label = 'Feedback',
    backgroundColor,
    top = '50%',
}: EdgeRibbonProps) {
    const { show, config } = useMsgMorph();

    const primaryColor = backgroundColor || config?.branding?.primaryColor || '#007AFF';
    const isRight = position === 'right';

    return (
        <TouchableOpacity
            style={[
                styles.container,
                {
                    backgroundColor: primaryColor,
                    top,
                    [isRight ? 'right' : 'left']: 0,
                    transform: [
                        { translateY: -50 },
                        { rotate: isRight ? '-90deg' : '90deg' },
                        { translateX: isRight ? 30 : -30 },
                    ],
                },
            ]}
            onPress={show}
            activeOpacity={0.8}
        >
            <Text style={styles.label}>{label}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4,
    },
    label: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
});
