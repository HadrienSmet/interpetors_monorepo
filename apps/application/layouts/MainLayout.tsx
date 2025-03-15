import { ReactNode, useEffect, useState } from "react";
import { StatusBar, View } from "react-native";

import { useEnvironment } from "@/contexts";
import { ColorName, useThemeColor } from "@/theme";

import { CustomKeyboardAvoidingView, Triangle, TRIANGLE_ZINDEX } from "./components";

type SectionType = {
    readonly element: ReactNode;
    readonly colorName?: ColorName;
};
export type MainLayoutProps = {
    readonly separatorVH: number;
    readonly sections: {
        readonly first: SectionType;
        readonly scd: SectionType;
        readonly ratio: [number, number];
    };
};
export const MainLayout = ({ sections, separatorVH }: MainLayoutProps) => {
    const [height, setHeight] = useState<[number, number]>([0, 0]);

    const { dimensions } = useEnvironment();
    const firstSectionBg = useThemeColor({ colorName: sections.first.colorName ?? "backgroundSecondary" });
    const scdSectionBg = useThemeColor({ colorName: sections.scd.colorName ?? "backgroundPrimary" });

    // Little hack: bad practice but using it since the screen aare only temp
    // There is probably a problem somewhere in the css 
    useEffect(() => {
        if (!dimensions.height) {
            return;
        }

        const firstSectionHeight = dimensions.height * (sections.ratio[0]/(sections.ratio[0] + sections.ratio[1]));
        const scdSectionHeight = dimensions.height - firstSectionHeight - (StatusBar.currentHeight ?? 0);

        setHeight([firstSectionHeight, scdSectionHeight]);
    }, [dimensions.height]);

    return (
        <CustomKeyboardAvoidingView>
            <View style={{ minHeight: "100%" }}>
                <View
                    style={{
                        backgroundColor: firstSectionBg, 
                        zIndex: (TRIANGLE_ZINDEX + 1), 
                        height: height[0],
                    }}
                >
                    {sections.first.element}
                </View>
                <View style={{
                    backgroundColor: scdSectionBg,

                    minHeight: height[1],
                }}>
                    <Triangle isSticky={false} triangleVH={separatorVH} />
                    {sections.scd.element}
                </View>
            </View>
        </CustomKeyboardAvoidingView>
    );
};
