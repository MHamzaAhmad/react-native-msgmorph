/**
 * Device Context Collector for React Native
 *
 * Collects comprehensive device context for debugging.
 * Used when submitting feedback or starting live chat.
 *
 * Note: No OS-level permissions are required for this data.
 */

import { Platform, Dimensions, PixelRatio } from "react-native";
import * as Localization from "expo-localization";
import type { DeviceContext } from "./types";

/**
 * Detect whether device is tablet or phone
 */
function detectDeviceType(): "mobile" | "tablet" {
    const { width, height } = Dimensions.get("screen");
    const aspectRatio = Math.max(width, height) / Math.min(width, height);

    // Tablets typically have aspect ratio closer to 4:3 and larger screens
    // Phones have aspect ratio closer to 16:9 or taller
    if (Math.min(width, height) >= 600 && aspectRatio < 1.6) {
        return "tablet";
    }
    return "mobile";
}

/**
 * Get screen orientation
 */
function getOrientation(): "portrait" | "landscape" {
    const { width, height } = Dimensions.get("window");
    return height >= width ? "portrait" : "landscape";
}

/**
 * Collect device context for React Native
 */
export function collectDeviceContext(): DeviceContext {
    const { width: screenWidth, height: screenHeight } = Dimensions.get("screen");

    return {
        // Device Info
        platform: Platform.OS === "ios" ? "ios" : "android",
        deviceType: detectDeviceType(),
        os: Platform.OS === "ios" ? "iOS" : "Android",
        osVersion: Platform.Version?.toString(),

        // Screen
        screenWidth: Math.round(screenWidth),
        screenHeight: Math.round(screenHeight),
        pixelRatio: PixelRatio.get(),
        orientation: getOrientation(),

        // Locale
        timezone: Localization.getCalendars()[0]?.timeZone || "Unknown",
        language: Localization.getLocales()[0]?.languageTag || "en",
        locale: Localization.getLocales()[0]?.languageTag,

        // Connection type is not collected (would require permissions)
        connectionType: "unknown",
    };
}

/**
 * Export context as hooks-compatible format
 */
export function useDeviceContext() {
    return {
        collectDeviceContext,
    };
}
