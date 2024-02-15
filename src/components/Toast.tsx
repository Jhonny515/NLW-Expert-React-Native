import { Feather } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { Animated, Text } from "react-native";
import colors from "tailwindcss/colors";

export type ToastProps = {
    /**
     * The message you want the toast to show
     */
    message: string;
    /**
     * (Optional) The type of toast you want to show.
     * 
     * @type 'success' | 'error' | 'warn'
     * @default 'success'
     */
    type?: 'success' | 'error' | 'warn';
}

type ToastConditionalProp = {
    isShowing: number;
    toastConditional: (bValue : number) => void;
}

const props: ToastProps =  {
    message: '', type: 'success',
}
const conditionalProp: ToastConditionalProp = {
    isShowing: 0,
    toastConditional(bValue) {
        return
    },
}

function renderToast() {
    const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

    const { message, type } = props;

    useEffect(() => {
        Animated.sequence([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.delay(3000),
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
            }),
        ]).start();
    }, [fadeAnim]);

    const warn = (<Feather name="alert-triangle" size={20} color={colors.amber[400]} />)
    const error = (<Feather name="x-circle" size={20} color={colors.red[600]} />)
    const success = (<Feather name="check-circle" size={20} color={colors.lime[500]} />)
    const icon = () => {
        switch (type) {
            case 'error':
                return error;

            case 'warn':
                return warn;

            default:
                return success;
        }
    }

    return (
        <Animated.View className={"flex-row bg-slate-300 rounded-md gap-2 p-3 inset-x-6 bottom-12 z-20 mx-auto content-center justify-center shadow-2xl absolute"} style={{ opacity: fadeAnim }} >
            {icon()}

            <Text className="text-black font-body">{message}</Text>
        </Animated.View>
    )
}

function Toast({ toastConditional, isShowing } : ToastConditionalProp) {
    conditionalProp.isShowing = isShowing;
    conditionalProp.toastConditional = toastConditional;
}

Toast.show = (newProps: ToastProps) => {
    props.message = newProps.message;
    props.type = newProps.type;
    console.log(conditionalProp.isShowing + 1);
    conditionalProp.toastConditional(conditionalProp.isShowing + 1);
}

Toast.render = renderToast;

export default Toast;