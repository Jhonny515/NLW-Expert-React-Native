import Toast from "@/components/Toast";
import { Loading } from "@/components/loading";
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, useFonts } from "@expo-google-fonts/inter";
import { Slot } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Layout() {
    const [toast, setToast] = useState(0);
    const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold
});

    let toastTimeout: NodeJS.Timeout;

    Toast({
        toastConditional: (value) => setToast(value),
        isShowing: toast,
    });

    useEffect(() => {
        if (toast != 0) {
            clearTimeout(toastTimeout)
        toastTimeout = setTimeout(
            () => setToast(0),
            5000)
        }
    }, [toast])

    if (!fontsLoaded) {
        return <Loading />;
    }


    return (
        <SafeAreaView className = "flex-1 bg-slate-900" >
            <Slot />

            {toast != 0 && <Toast.render />}
        </SafeAreaView >
    )
}