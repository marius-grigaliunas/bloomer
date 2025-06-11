import { useEffect } from 'react';
import { router } from 'expo-router';
import LoadingScreen from '@/components/LoadingScreen';

export default function OAuthCallback() {
    useEffect(() => {
        // Just redirect to your main app screen
        router.replace('/(root)/(tabs)'); // or wherever you want to redirect
    }, []);

    return <LoadingScreen/>
}