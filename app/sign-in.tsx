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
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F8F8' }}>
            <ScrollView 
                style={{ flex: 1 }}
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
                    {/* Logo/Brand Section */}
                    <View style={{ alignItems: 'center', marginBottom: 64 }}>
                        <View style={{ backgroundColor: '#F3F4F6', borderRadius: 24, padding: 24, marginBottom: 16 }}>
                            <Image
                                source={require("../assets/images/logo-noname-500x500.png")}
                                style={{ width: 80, height: 80 }}
                                resizeMode="contain"
                            />
                        </View>
                        <Text style={{ color: '#2F2F2F', fontSize: 30, fontWeight: 'bold', marginBottom: 8 }}>
                            Bloomer
                        </Text>
                        <Text style={{ color: '#6B7280', fontSize: 18, textAlign: 'center' }}>
                            Your personal plant care companion
                        </Text>
                    </View>

                    {/* Sign In Buttons */}
                    <View style={{ width: '100%' }}>
                        {/* Google Sign In */}
                        <TouchableOpacity 
                            onPress={handleSignIn}
                            style={{ 
                                backgroundColor: 'white', 
                                borderRadius: 24, 
                                padding: 16, 
                                flexDirection: 'row', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                borderWidth: 1,
                                borderColor: '#E5E7EB',
                                marginBottom: 16
                            }}
                        >
                            <Ionicons name="logo-google" size={24} color="#4285F4" />
                            <Text style={{ color: '#2F2F2F', fontSize: 18, fontWeight: '500', marginLeft: 12 }}>
                                Continue with Google
                            </Text>
                        </TouchableOpacity>

                        {/* Anonymous Sign In */}
                        <TouchableOpacity 
                            onPress={handleAnnonymousSignIn}
                            style={{ 
                                backgroundColor: '#4F772D', 
                                borderRadius: 24, 
                                padding: 16, 
                                flexDirection: 'row', 
                                alignItems: 'center', 
                                justifyContent: 'center'
                            }}
                        >
                            <Ionicons name="person-outline" size={24} color="white" />
                            <Text style={{ color: 'white', fontSize: 18, fontWeight: '500', marginLeft: 12 }}>
                                Try without account
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Footer Text */}
                    <View style={{ marginTop: 48, alignItems: 'center' }}>
                        <Text style={{ color: '#6B7280', textAlign: 'center', fontSize: 14 }}>
                            By continuing, you agree to our{' '}
                            <TouchableOpacity onPress={() => router.push('/privacy')}>
                                <Text style={{ color: '#4F772D', textDecorationLine: 'underline', fontWeight: '500' }}>
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