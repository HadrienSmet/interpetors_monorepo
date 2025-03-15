import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

import { Eye, EyeSlash } from "@/assets";
import { Radius, Shadows, Sizes, Spacings, useThemeColor } from "@/theme";

import { Text } from "../../text";

import { TextInputProps, TextInputRef, TextInputState } from "./textInput.types";

const ICON_SIZE = 24 as const;

export const Input = forwardRef<TextInputRef, TextInputProps>((
    { 
        labelKey, 
        placeholderKey, 
        textContentType, 
        isSecuredInput = false, 
        onBackground = false,
    }, 
    ref
) => {
    const [inputState, setInputState] = useState<TextInputState>({
        value: null,
        isVisible: isSecuredInput,
    });

    const inputRef = useRef<TextInput>(null);

    const iconColor = useThemeColor({ colorName: "icon" });
    const inputBg = useThemeColor({ colorName: "backgroundPrimary" });
    const labelColor = useThemeColor({ colorName: "textOnBackground" });
    const { t } = useTranslation();

    const setValue = (value: string) => setInputState(state => ({ ...state, value }));
    const toggleVisibility = () => setInputState(state => ({ ...state, isVisible: !state.isVisible }));

    useImperativeHandle(ref, () => ({
        focus: () => inputRef.current?.focus(),
        clear: () => {
            setInputState(state => ({ ...state, value: null }));
            inputRef.current?.clear();
        },
        getValue: () => inputState.value,
    }));

    return (
        <View style={styles.container}>
            <Text 
                style={[
                    onBackground && { color: labelColor }, 
                    styles.label,
                ]}
            >{t(labelKey)}</Text>
            <View style={styles.inputContainer}>
                <TextInput 
                    placeholder={t(placeholderKey)}
                    secureTextEntry={isSecuredInput 
                        ? inputState.isVisible 
                        : isSecuredInput
                    }
                    textContentType={textContentType} 
                    style={[styles.input, { backgroundColor: inputBg }]} 
                    onChangeText={setValue}
                />
                {isSecuredInput && (
                    <TouchableOpacity 
                        style={styles.button}
                        onPress={toggleVisibility}
                    >
                        {inputState.isVisible 
                            ? (<Eye color={iconColor} size={ICON_SIZE} />)
                            : (<EyeSlash color={iconColor} size={ICON_SIZE} />)
                        }
                    </TouchableOpacity>
            
                )}
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    button: {
        marginRight: Spacings.m,
        position: "absolute",
        right: 0,
    },
    container: { 
        width: "100%", 
    },
    input: { 
        borderRadius: Radius.circle, 
        padding: Spacings.m,
        width: "100%",
        ...Shadows.small,
    },
    inputContainer: { 
        display: "flex", 
        justifyContent: "center", 
    },
    label: {
        fontSize: Sizes.label,
        paddingLeft: Spacings.s,
    },
});
