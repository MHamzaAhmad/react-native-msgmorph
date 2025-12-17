/**
 * Device Context Collector for React Native
 *
 * Collects comprehensive device context for debugging.
 * Uses react-native-device-info for accurate device information.
 *
 * Note: No OS-level permissions are required for this data.
 */

import { Platform, Dimensions, PixelRatio } from "react-native";
import type { DeviceContext } from "./types";

// Dynamically import react-native-device-info to handle cases where it's not installed
let DeviceInfo: any = null;

try {
    // Try to require react-native-device-info
    DeviceInfo = require("react-native-device-info");
} catch {
    // react-native-device-info not installed, will use fallback
    console.warn("[MsgMorph] react-native-device-info not installed. Using basic device info.");
}

/**
 * Detect whether device is tablet or phone (fallback)
 */
function detectDeviceType(): "mobile" | "tablet" {
    // Use react-native-device-info if available
    if (DeviceInfo?.isTablet) {
        try {
            return DeviceInfo.isTablet() ? "tablet" : "mobile";
        } catch {
            // Fall through to fallback
        }
    }

    // Fallback detection using screen dimensions
    const { width, height } = Dimensions.get("screen");
    const aspectRatio = Math.max(width, height) / Math.min(width, height);

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
 * Get timezone
 */
function getTimezone(): string {
    try {
        return Intl.DateTimeFormat().resolvedOptions().timeZone || "Unknown";
    } catch {
        return "Unknown";
    }
}

/**
 * Get language
 */
function getLanguage(): string {
    try {
        // Try to get from Intl
        const locale = Intl.DateTimeFormat().resolvedOptions().locale;
        if (locale) return locale;
    } catch {
        // Ignore
    }

    // Fallback
    return Platform.OS === "ios" ? "en" : "en";
}

/**
 * Collect device context for React Native (async - recommended)
 */
export async function collectDeviceContextAsync(): Promise<DeviceContext> {
    const { width: screenWidth, height: screenHeight } = Dimensions.get("screen");

    let deviceModel: string | undefined;
    let deviceBrand: string | undefined;
    let osVersion: string | undefined;
    let isEmulator: boolean | undefined;
    let appVersion: string | undefined;
    let appBuildNumber: string | undefined;

    if (DeviceInfo) {
        try {
            deviceModel = await DeviceInfo.getModel();
            deviceBrand = await DeviceInfo.getBrand();
            osVersion = await DeviceInfo.getSystemVersion();
            isEmulator = await DeviceInfo.isEmulator();
            appVersion = await DeviceInfo.getVersion();
            appBuildNumber = await DeviceInfo.getBuildNumber();
        } catch (e) {
            console.warn("[MsgMorph] Error getting device info:", e);
        }
    }

    return {
        platform: Platform.OS === "ios" ? "ios" : "android",
        deviceType: detectDeviceType(),
        os: Platform.OS === "ios" ? "iOS" : "Android",
        osVersion: osVersion || Platform.Version?.toString(),
        deviceModel,
        deviceBrand,
        isEmulator,
        screenWidth: Math.round(screenWidth),
        screenHeight: Math.round(screenHeight),
        pixelRatio: PixelRatio.get(),
        orientation: getOrientation(),
        appVersion,
        appBuildNumber,
        timezone: getTimezone(),
        language: getLanguage(),
        locale: getLanguage(),
        connectionType: "unknown",
    };
}

/**
 * Collect device context for React Native (sync - basic info only)
 */
export function collectDeviceContext(): DeviceContext {
    const { width: screenWidth, height: screenHeight } = Dimensions.get("screen");

    let deviceModel: string | undefined;
    let deviceBrand: string | undefined;
    let osVersion: string | undefined;

    // Try to get sync values from DeviceInfo if available
    if (DeviceInfo) {
        try {
            // Some methods are sync
            if (typeof DeviceInfo.getModel === "function") {
                deviceModel = DeviceInfo.getModel();
            }
            if (typeof DeviceInfo.getBrand === "function") {
                deviceBrand = DeviceInfo.getBrand();
            }
            if (typeof DeviceInfo.getSystemVersion === "function") {
                osVersion = DeviceInfo.getSystemVersion();
            }
        } catch {
            // Ignore errors, use fallback
        }
    }

    return {
        platform: Platform.OS === "ios" ? "ios" : "android",
        deviceType: detectDeviceType(),
        os: Platform.OS === "ios" ? "iOS" : "Android",
        osVersion: osVersion || Platform.Version?.toString(),
        deviceModel,
        deviceBrand,
        screenWidth: Math.round(screenWidth),
        screenHeight: Math.round(screenHeight),
        pixelRatio: PixelRatio.get(),
        orientation: getOrientation(),
        timezone: getTimezone(),
        language: getLanguage(),
        locale: getLanguage(),
        connectionType: "unknown",
    };
}

/**
 * Export context as hooks-compatible format
 */
export function useDeviceContext() {
    return {
        collectDeviceContext,
        collectDeviceContextAsync,
    };
}
