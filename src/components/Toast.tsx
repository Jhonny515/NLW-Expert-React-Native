import { Feather } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
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
    animationValue: Animated.Value;
    trigger: () => void;
    animate: () => Animated.CompositeAnimation;
}

const props: ToastProps = {
    message: '', type: 'success',
}
const conditionalProp: ToastConditionalProp = {
    animationValue: new Animated.Value(0),
    trigger: () => { },
    animate: () => {
        return Animated.sequence([
            Animated.timing(conditionalProp.animationValue, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.delay(3000),
            Animated.timing(conditionalProp.animationValue, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
            }),
        ]);
    }

}

function Toast() {
    const fadeAnim = useRef(conditionalProp.animationValue).current; // Initial value for opacity: 0
    const [display, setDisplay] = useState<'none' | 'flex'>('none');

    conditionalProp.trigger = () => {
        setDisplay('flex');
        conditionalProp.animate().start(() => { setDisplay('none') });
    };

    const { message, type } = props;

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
        <Animated.View className={"flex-row bg-slate-300 rounded-md gap-2 p-3 inset-x-6 bottom-12 z-20 mx-auto content-center justify-center shadow-2xl absolute"} style={{ opacity: fadeAnim, display: display }} >
            {icon()}

            <Text className="text-black font-body">{message}</Text>
        </Animated.View>
    )
}

Toast.show = (newProps: ToastProps) => {
    conditionalProp.animate().stop();
    props.message = newProps.message;
    props.type = newProps.type;
    conditionalProp.trigger();
}

export default Toast;