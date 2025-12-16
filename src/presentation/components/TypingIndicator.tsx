/**
 * MsgMorph React Native SDK - Typing Indicator
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import type { MsgMorphTheme } from '../theme';

interface TypingIndicatorProps {
    theme: MsgMorphTheme;
}

export function TypingIndicator({ theme }: TypingIndicatorProps) {
    const dot1 = useRef(new Animated.Value(0)).current;
    const dot2 = useRef(new Animated.Value(0)).current;
    const dot3 = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const createAnimation = (value: Animated.Value, delay: number) => {
            return Animated.loop(
                Animated.sequence([
                    Animated.delay(delay),
                    Animated.timing(value, {
                        toValue: 1,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                    Animated.timing(value, {
                        toValue: 0,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                ])
            );
        };

        const anim1 = createAnimation(dot1, 0);
        const anim2 = createAnimation(dot2, 150);
        const anim3 = createAnimation(dot3, 300);

        anim1.start();
        anim2.start();
        anim3.start();

        return () => {
            anim1.stop();
            anim2.stop();
            anim3.stop();
        };
    }, [dot1, dot2, dot3]);

    const animatedStyle = (animValue: Animated.Value) => ({
        opacity: animValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0.3, 1],
        }),
        transform: [
            {
                scale: animValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1.2],
                }),
            },
        ],
    });

    return (
        <View style={styles.container}>
            {/* Avatar */}
            <View style={[styles.avatar, { backgroundColor: theme.primaryColor }]}>
                <Text style={{ fontSize: 12, color: '#FFF' }}>🎧</Text>
            </View>

            {/* Dots */}
            <View style={[styles.bubble, { backgroundColor: theme.surfaceColor }]}>
                <Animated.View
                    style={[styles.dot, { backgroundColor: theme.secondaryTextColor }, animatedStyle(dot1)]}
                />
                <Animated.View
                    style={[styles.dot, { backgroundColor: theme.secondaryTextColor }, animatedStyle(dot2)]}
                />
                <Animated.View
                    style={[styles.dot, { backgroundColor: theme.secondaryTextColor }, animatedStyle(dot3)]}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginVertical: 4,
    },
    avatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    bubble: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderRadius: 16,
        borderBottomLeftRadius: 4,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 2,
    },
});
