import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalContext } from '../../lib/globalProvider';
import { ActivityIndicator } from 'react-native';
import { Redirect, Slot } from 'expo-router';
import LoadingScreen from '../../components/LoadingScreen';

export default function AppLayout() {
    const { loading, isLoggedIn } = useGlobalContext();

    if(loading) {
        return <LoadingScreen/>
    }

    if(!isLoggedIn) return <Redirect href={"/sign-in"}/>

    return <Slot />
}