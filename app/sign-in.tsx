import { View, Text, Alert, ScrollView, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { login, AnnonymousLogin, testAppwriteOAuth, detailedLoginTest, testBothEndpoints} from '@/lib/appwrite';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalContext } from '@/lib/globalProvider';
import { Redirect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const SignIn = () => {
    const { refetch, loading, isLoggedIn } = useGlobalContext()
    const router = useRouter()

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

    const handleTestSignIn = async () => {
        await testAppwriteOAuth();
    }

    const handleDetailedTestSignIn = async () => {
        await detailedLoginTest();
    }

    const handleBothEndpointsSignIn = async () => {
        await testBothEndpoints();
    }

    return (
        <SafeAreaView className="bg-background-primary flex-1">
            <ScrollView 
                className="flex-1"
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
            >
                <View className="flex-1 justify-center items-center px-6">
                    {/* Logo/Brand Section */}
                    <View className="items-center mb-16">
                        <View className="bg-gray-100 rounded-3xl p-6 mb-4 shadow-sm shadow-black/10">
                            <Image
                                source={require("../assets/images/logo-noname-500x500.png")}
                                style={{ width: 48, height: 48 }}
                                resizeMode="contain"
                            />
                        </View>
                        <Text className="text-text-primary text-3xl font-bold mb-2">
                            Bloomer
                        </Text>
                        <Text className="text-text-secondary text-lg text-center">
                            Your personal plant care companion
                        </Text>
                    </View>

                    {/* Sign In Buttons */}
                    <View className="w-full">
                        {/* Google Sign In */}
                        <TouchableOpacity 
                            onPress={handleSignIn}
                            className="bg-white rounded-3xl p-4 flex-row items-center justify-center shadow-sm shadow-black/5 border border-gray-200 mb-4"
                        >
                            <Ionicons name="logo-google" size={24} color="#4285F4" />
                            <Text className="text-text-primary text-lg font-medium ml-3">
                                Continue with Google
                            </Text>
                        </TouchableOpacity>

                        {/* Anonymous Sign In */}
                        <TouchableOpacity 
                            onPress={handleAnnonymousSignIn}
                            className="bg-primary-medium rounded-3xl p-4 flex-row items-center justify-center shadow-sm shadow-black/5"
                        >
                            <Ionicons name="person-outline" size={24} color="white" />
                            <Text className="text-white text-lg font-medium ml-3">
                                Try without account
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Footer Text */}
                    <View className="mt-12 items-center">
                        <Text className="text-text-secondary text-center text-sm">
                            By continuing, you agree to our{' '}
                            <TouchableOpacity onPress={() => router.push('/privacy')}>
                                <Text className="text-primary-medium underline font-medium">
                                    Terms of Service
                                </Text>
                            </TouchableOpacity>
                        </Text>
                    </View>

                    {/* Hidden Test Buttons - Uncomment for debugging */}
                    {/*
                    <View className="mt-8 w-full">
                        <TouchableOpacity onPress={handleTestSignIn}
                            className="bg-secondary-medium rounded-3xl p-3 items-center mb-3"
                        >
                            <Text className="text-white font-medium">Test Login</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleDetailedTestSignIn}
                            className="bg-secondary-medium rounded-3xl p-3 items-center mb-3"
                        >
                            <Text className="text-white font-medium">Detailed Test Login</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleBothEndpointsSignIn}
                            className="bg-secondary-medium rounded-3xl p-3 items-center"
                        >
                            <Text className="text-white font-medium">Both Endpoints</Text>
                        </TouchableOpacity>
                    </View>
                    */}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default SignIn