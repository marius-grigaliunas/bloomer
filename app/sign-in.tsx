import { View, Text, Alert, ScrollView, TouchableOpacity, Image } from 'react-native'
import React, { useState, useCallback, useEffect } from 'react'
import { login, AnnonymousLogin} from '@/lib/appwrite';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalContext } from '@/lib/globalProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect, useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import LoadingScreen from '@/components/LoadingScreen';

const SignIn = () => {
    const { refetch, loading, isLoggedIn } = useGlobalContext()
    const router = useRouter()
    const [isSigningIn, setIsSigningIn] = useState(false)

    // Check for persistent loading state on component mount
    useEffect(() => {
        const checkPersistentLoadingState = async () => {
            try {
                const persistentLoadingState = await AsyncStorage.getItem('isSigningIn');
                if (persistentLoadingState === 'true') {
                    setIsSigningIn(true);
                }
            } catch (error) {
                console.error("Error checking persistent loading state:", error);
            }
        };
        checkPersistentLoadingState();
    }, []);

    // Note: Removed useFocusEffect as it was interfering with the loading state
    // The loading state will be managed properly in the handleSignIn function

    const handleSignIn = useCallback(async () => {
        // Set loading state immediately and synchronously
        setIsSigningIn(true);
        
        // Store loading state persistently to survive component re-mounts
        try {
            await AsyncStorage.setItem('isSigningIn', 'true');
        } catch (error) {
            console.error("Error storing loading state:", error);
        }
        
        // Set a timeout to clear loading state in case user dismisses OAuth flow
        const timeoutId = setTimeout(async () => {
            setIsSigningIn(false);
            try {
                await AsyncStorage.removeItem('isSigningIn');
            } catch (error) {
                console.error("Error removing loading state:", error);
            }
        }, 30000); // 30 seconds timeout
        
        try {
            const result = await login();

            // Clear the timeout since login completed
            clearTimeout(timeoutId);

            if(result) {
                await refetch()
                // Keep loading state true - user will be redirected away from this screen
                // Clear persistent storage since login was successful
                try {
                    await AsyncStorage.removeItem('isSigningIn');
                } catch (error) {
                    console.error("Error removing loading state:", error);
                }
            } else {
                Alert.alert("Error", "Failed to sign-in")
                setIsSigningIn(false);
                // Clear persistent storage
                try {
                    await AsyncStorage.removeItem('isSigningIn');
                } catch (error) {
                    console.error("Error removing loading state:", error);
                }
            }
        } catch (error) {
            // Clear the timeout since login failed
            clearTimeout(timeoutId);
            console.error("Sign-in error:", error);
            Alert.alert("Error", "Failed to sign-in")
            setIsSigningIn(false);
            // Clear persistent storage
            try {
                await AsyncStorage.removeItem('isSigningIn');
            } catch (storageError) {
                console.error("Error removing loading state:", storageError);
            }
        }
    }, [refetch])

    const handleAnnonymousSignIn = useCallback(async () => {
        setIsSigningIn(true);
        try {
            const result = await AnnonymousLogin();

            if(result) {
                await refetch()
            } else {
                Alert.alert("Error", "Failed to sign-in annonymously")
                setIsSigningIn(false);
            }
        } catch (error) {
            console.error("Anonymous sign-in error:", error);
            Alert.alert("Error", "Failed to sign-in annonymously")
            setIsSigningIn(false);
        }
        // Note: Don't set isSigningIn to false in finally block for anonymous login
        // because successful login will redirect the user away from this screen
    }, [refetch])

    // Early returns after ALL hooks are called
    if(!loading && isLoggedIn) return <Redirect href={"/"}/>

    // Show loading screen during sign-in process
    if (isSigningIn) {
        return <LoadingScreen message="Signing you in..." />
    }

    // Test functions removed - they were causing import issues
    // and are commented out in the UI anyway

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
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default SignIn