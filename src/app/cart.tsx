import Toast from "@/components/Toast";
import { Button } from "@/components/button";
import { Header } from "@/components/header";
import { Input } from "@/components/input";
import { LinkButton } from "@/components/link-button";
import { Product } from "@/components/product";

import { ProductCartProps, useCartStore } from "@/stores/cart-stores";

import { formatCurrency } from "@/utils/functions/format-currency";

import { Feather } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useRef, useState } from "react";
import { Alert, Linking, ScrollView, Text, TextInput, TextInputProps, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

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

    const logradouroInput = useRef<TextInput | null>(null);
    const numeroInput = useRef<TextInput | null>(null);
    const bairroInput = useRef<TextInput | null>(null);
    const complementoInput = useRef<TextInput | null>(null);
    const cepInput = useRef<TextInput | null>(null);

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
                onPress: () => {
                    cartStore.remove(product.id);
                    Toast.show({ message: `${product.title} removido do carrinho`});
                },
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
        return `${address.logradouro.trim()}, Nº${address.numero.trim()}, ${address.complemento.trim()} - ${address.bairro.trim()} - CEP ${address.cep.trim()}`;
    }

    const sendOrder = () => {
        const products = cartStore.products.map(product => `\n ${product.quantity}x ${product.title}`).join();
            
        const message = `NOVO PEDIDO\n${products}\nEntregar em: ${formatAddress()}\n \nValor total: ${total}`;

        console.log(message);
        Linking.openURL(`http://api.whatsapp.com/send?phone=${PHONE_NUMBER}&text=${message}`)
        cartStore.clear();
        navigation.goBack();
    }

    function handleOrder() {
        
        if (!validateNoEmptyFields()) {
            Alert.alert("Pedido", "Informe os dados da entrega");
            return;
        }
        Alert.alert("Confirmar pedido", `Confirma envio do pedido?`, [
            {
                text: "Cancelar",
            },
            {
                text: "Confirmar",
                onPress: () => sendOrder(),
            }
        ])
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
                        <Input ref={logradouroInput} placeholder="Logradouro" className="w-3/4" returnKeyType="next" onChangeText={(text) => setAddress({...address, logradouro: text})} blurOnSubmit={false} onSubmitEditing={() => numeroInput.current?.focus()} />
                        <Input ref={numeroInput} placeholder="Nº" maxLength={8} className="w-1/4" returnKeyType="next" onChangeText={(text) => setAddress({...address, numero: text})} blurOnSubmit={false} onSubmitEditing={() => bairroInput.current?.focus()} />
                    </View>
                    <View className="flex-row gap-1 h-16 my-1">
                        <Input ref={bairroInput} placeholder="Bairro" maxLength={20} className="w-full" returnKeyType="next" onChangeText={(text) => setAddress({...address, bairro: text})} blurOnSubmit={false} onSubmitEditing={() => complementoInput.current?.focus()} />
                    </View>
                    <View className="flex-row gap-1 h-16 my-1">
                        <Input ref={complementoInput} placeholder="Complemento" className="w-full" returnKeyType="next" onChangeText={(text) => setAddress({...address, complemento: text})} blurOnSubmit={false} onSubmitEditing={() => cepInput.current?.focus()} />
                    </View>
                    <View className="flex-row gap-1 h-16 my-1">
                        <Input ref={cepInput} placeholder="CEP" inputMode="numeric" maxLength={8} className="w-full" returnKeyType="done" onChangeText={(text) => setAddress({...address, cep: text})} onSubmitEditing={handleOrder} />
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