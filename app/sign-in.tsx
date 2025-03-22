import { View, Text, Alert, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { login, AnnonymousLogin } from '@/lib/appwrite';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalContext } from '@/lib/globalProvider';
import { Redirect } from 'expo-router';

const SignIn = () => {
    const { refetch, loading, isLoggedIn } = useGlobalContext()

    if(!loading && isLoggedIn) return <Redirect href={"/"}/>

    const handleSignIn = async () => {
        const result = await login();

        if(result) {
            refetch()
        } else {
            Alert.alert("Error", "Failed to sign-in")
        }
    }

    const handleAnnonymousSignIn = async () => {
        const result = await AnnonymousLogin();

        if(result) {
            refetch()
        } else {
            Alert.alert("Error", "Failed to sign-in annonymously")
        }
    }

    return (
        <SafeAreaView className="bg-background-lighter h-full">
            <ScrollView contentContainerStyle={{height: "auto"}} >
                <View className='flex justify-center items-center'>
                    <TouchableOpacity onPress={handleSignIn}
                        className="bg-primary shadow-emerald-50 shadow-md rounded-full
                            w-80 h-20 mt-20 border-accent-mint border-2 flex justify-center items-center"
                    >
                        <View>
                            <Text className='text-2xl text-white'>Continue with google</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleAnnonymousSignIn}
                        className="bg-primary-dark shadow-emerald-50 shadow-md rounded-full
                            w-80 h-20 mt-5 border-accent-mint border-2 flex justify-center items-center"
                    >
                        <View>
                            <Text className='text-2xl text-white'>Continue as a Guest</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default SignIn