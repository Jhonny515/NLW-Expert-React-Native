import { TextInput, TextInputProps } from "react-native";
import colors from "tailwindcss/colors";

export function Input({ ...rest }: TextInputProps) {
    return <TextInput
        textAlignVertical="top" placeholderTextColor={colors.slate[400]} className="h-16 bg-slate-800 rounded-md px-4 py-5 font-body text-sm text-white"
        {...rest} />
}