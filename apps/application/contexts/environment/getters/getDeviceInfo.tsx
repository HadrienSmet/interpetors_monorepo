import * as Device from "expo-device";
import { Platform } from "react-native";

type PlatformType = "ios" | "android" | "windows" | "macos" | "web";
export const Os = {
    IOS: "ios",
    ANDROID: "android",
    WEB: "web",
} as const;
type OsType = typeof Os[keyof typeof Os];

const getOs = (): OsType => {
    const platform = Platform.OS;

    if (platform === Os.ANDROID) return (Os.ANDROID);
    if (platform === Os.IOS) return (Os.IOS);
    return (Os.WEB);
};

export type DeviceInfo = {
    readonly platform: PlatformType;
    readonly os: OsType;
    readonly deviceType: Device.DeviceType | null;
};
export const getDeviceInfo = (): DeviceInfo => ({
    deviceType: Device.deviceType,
    os: getOs(),
    platform: Platform.OS,
});
