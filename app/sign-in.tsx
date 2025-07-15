import { View, Text, Alert, ScrollView, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { login, AnnonymousLogin, testAppwriteOAuth, detailedLoginTest, testBothEndpoints} from '@/lib/appwrite';
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
        <SafeAreaView className="bg-background-primary h-full">
            <ScrollView contentContainerStyle={{height: "auto"}} >
                <View className='flex justify-center items-center'>
                    <TouchableOpacity onPress={handleSignIn}
                        className="bg-secondary-medium rounded-full
                            w-80 h-20 mt-80 border-4 border-accent
                             flex justify-center items-center"
                    >
                        <View className='flex flex-row justify-center items-center'>
                            <Text className='text-2xl text-white px-1'>Continue with </Text>
                            <Image
                                source={require("../assets/icons/google.png")}
                                resizeMode='contain'
                                className='w-7 h-7'
                            />
                            <Text className='text-2xl text-white'> Google</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleAnnonymousSignIn}
                        className="bg-primary-deep rounded-full
                            w-80 h-20 mt-5 border-accent border-2 flex justify-center items-center"
                    >
                        <View>
                            <Text className='text-2xl text-white'>Login without an account</Text>
                            <Text className='text-lg text-white text-center'>and test the app</Text>
                        </View>
                    </TouchableOpacity>
                    {/*
                    <TouchableOpacity onPress={handleTestSignIn}
                        className="bg-primary-deep rounded-full
                            w-80 h-20 mt-5 border-accent border-2 flex justify-center items-center"
                    >
                        <View>
                            <Text className='text-2xl text-white'>test login</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleDetailedTestSignIn}
                        className="bg-primary-deep rounded-full
                            w-80 h-20 mt-5 border-accent border-2 flex justify-center items-center"
                    >
                        <View>
                            <Text className='text-2xl text-white'>detailed test login</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleBothEndpointsSignIn}
                        className="bg-primary-deep rounded-full
                            w-80 h-20 mt-5 border-accent border-2 flex justify-center items-center"
                    >
                        <View>
                            <Text className='text-2xl text-white'>both endpoints</Text>
                        </View>
                    </TouchableOpacity>
                    */}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default SignIn