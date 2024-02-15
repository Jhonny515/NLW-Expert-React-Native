import { ForwardedRef, MutableRefObject, forwardRef, useRef } from "react";
import { TextInput, TextInputProps } from "react-native";
import colors from "tailwindcss/colors";

export const Input = forwardRef(function Input({ ...rest }: TextInputProps, ref: ForwardedRef<TextInput>) {
    return <TextInput ref={ref}
        textAlignVertical="top" placeholderTextColor={colors.slate[400]} className="h-16 bg-slate-800 rounded-md px-4 py-5 font-body text-sm text-white"
        {...rest} />
})