import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalContext } from '../../lib/globalProvider';
import { ActivityIndicator } from 'react-native';
import { Redirect, Slot } from 'expo-router';
export default function AppLayout() {
    const { loading, isLoggedIn } = useGlobalContext();

    if(loading) {
        return (
            <SafeAreaView className='h-full bg-background flex justify-center 
        items-center'>
                <ActivityIndicator className='text-primary' size="large"/>
            </SafeAreaView>
        )
    }

    if(!isLoggedIn) return <Redirect href={"/sign-in"}/>

    return <Slot />
}