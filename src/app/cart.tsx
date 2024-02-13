import { Header } from "@/components/header";
import { Product } from "@/components/product";
import { ProductCartProps, useCartStore } from "@/stores/cart-stores";
import { formatCurrency } from "@/utils/functions/format-currency";
import { Text, View, ScrollView, Alert, Linking } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import { Feather } from "@expo/vector-icons";
import { LinkButton } from "@/components/link-button";
import { useState } from "react";
import { useNavigation } from "expo-router";

const PHONE_NUMBER = "5511961414361"

export default function Cart() {
    const initialAddressState = {
        logradouro: "",
        numero: "",
        bairro: "",
        complemento: "",
        cep: "",
    }
    const [address, setAddress] = useState(initialAddressState);
    const cartStore = useCartStore();
    const navigation = useNavigation();
    const total = formatCurrency(
    cartStore.products.reduce((total, product) => { return total + product.price * product.quantity }, 0)
    )

    function handleProductRemove(product:ProductCartProps) {
        Alert.alert("Remover", `Deseja remover ${product.title} do carrinho?`, [
            {
                text: "Cancelar",
            },
            {
                text: "Remover",
                onPress: () => cartStore.remove(product.id),
            }
        ])
    }

    const validateNoEmptyFields = () => {
        let noEmptyFields = true;

        if (address.logradouro.trim() === "") noEmptyFields = false;
        if (address.numero.trim() === "") noEmptyFields = false;
        if (address.bairro.trim() === "") noEmptyFields = false;
        if (address.complemento.trim() === "") noEmptyFields = false;
        if (address.cep.trim() === "") noEmptyFields = false;

        return noEmptyFields;
    }
    const formatAddress = () => {
        return `${address.logradouro}, Nº${address.numero}, ${address.complemento} - ${address.bairro} - ${address.cep}`;
    }

    function handleOrder() {
        console.log(address);
        
        if (!validateNoEmptyFields()) {
            Alert.alert("Pedido", "Informe os dados da entrega");
            return;
        }

        const products = cartStore.products.map(product => `\n ${product.quantity}x ${product.title}`).join();
        
        const message = `NOVO PEDIDO
        \n ${products}
        \n Entregar em: ${formatAddress()}
        \n Valor total: ${total}`;

        console.log(message);
        Linking.openURL(`http://api.whatsapp.com/send?phone=${PHONE_NUMBER}&text=${message}`)
        cartStore.clear();
        navigation.goBack();
    }

    return (
        <View className="flex-1 pt-8">
            <Header title="Seu carrinho" />
            <KeyboardAwareScrollView showsVerticalScrollIndicator={false} extraHeight={100}><ScrollView>
                <View className="p-5 flex-1">
                    {cartStore.products.length > 0 ? (
                        cartStore.products.map((product) => (
                            <Product key={product.id} data={product} onPress={() => handleProductRemove(product)} />
                        ))
                    ) : (
                        <Text className="font-body text-slate-400 text-center my-8">
                            Seu carrinho está vazio.
                        </Text>
                    )}
                    <View className="flex-row gap-1 h-16 my-1">
                        <Input placeholder="Logradouro" className="w-3/4" returnKeyType="next" onChangeText={(text) => setAddress({...address, logradouro: text})} />
                        <Input placeholder="No" className="w-1/4" returnKeyType="next" onChangeText={(text) => setAddress({...address, numero: text})} />
                    </View>
                    <View className="flex-row gap-1 h-16 my-1">
                        <Input placeholder="Bairro" className="w-full" returnKeyType="next" onChangeText={(text) => setAddress({...address, bairro: text})} />
                    </View>
                    <View className="flex-row gap-1 h-16 my-1">
                        <Input placeholder="Complemento" className="w-full" returnKeyType="next" onChangeText={(text) => setAddress({...address, complemento: text})} />
                    </View>
                    <View className="flex-row gap-1 h-16 my-1">
                        <Input placeholder="CEP" className="w-full" returnKeyType="next" onChangeText={(text) => setAddress({...address, cep: text})} />
                    </View>
                </View>
            </ScrollView></KeyboardAwareScrollView>

            <View className="flex-row gap-2 items-center mt-5 mb-4 px-4">
                <Text className="text-white text-xl font-subtititle">Total:</Text>
                <Text className="text-lime-400 text-2xl font-heading">{total}</Text>
            </View>

            <View className="h-24 flex px-4">
                <Button onPress={handleOrder}>
                    <Button.Text>Enviar pedido</Button.Text>
                    <Button.Icon>
                        <Feather name="arrow-right-circle" size={20} />
                    </Button.Icon>
                </Button>
                <LinkButton title="Voltar ao cardápio" href="/" />
            </View>
        </View>
    )
}