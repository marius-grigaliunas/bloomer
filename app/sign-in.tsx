import { View, Text, Alert, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { login } from '@/lib/appwrite';
import { SafeAreaView } from 'react-native-safe-area-context';

const SignIn = () => {
  
    const handleSignIn = async () => {
        const result = await login();

        if(result) {
            console.log("Sign in success")
        } else {
            Alert.alert("Error", "Failed to sign-in")
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
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default SignIn