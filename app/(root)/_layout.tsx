import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalContext } from '../../lib/globalProvider';
import { ActivityIndicator } from 'react-native';
import { Redirect, Slot } from 'expo-router';
import LoadingScreen from '../../components/LoadingScreen';

export default function AppLayout() {
    const { loading, isLoggedIn } = useGlobalContext();

    console.log("AppLayout render - loading:", loading, "isLoggedIn:", isLoggedIn);

    if(loading) {
        console.log("AppLayout: Showing loading screen");
        return <LoadingScreen/>
    }

    if(!isLoggedIn) {
        console.log("AppLayout: User not logged in, redirecting to sign-in");
        return <Redirect href={"/sign-in"}/>
    }

    console.log("AppLayout: User logged in, showing Slot");
    return <Slot />
}