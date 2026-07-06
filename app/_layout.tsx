import { SplashScreen, Stack } from "expo-router";
import * as Font from "expo-font"
import './global.css'
import "@/lib/i18n/config";
import { validateEnv } from "@/lib/env";
import GlobalProvider from "@/lib/globalProvider";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import { View, Text } from "react-native";
import colors from "@/constants/colors";
import LoadingScreen from "../components/LoadingScreen";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

SplashScreen.preventAutoHideAsync();

const envCheck = validateEnv();

export default function RootLayout() {
  const [isAppReady, setIsAppReady] = useState(false);

  if (!envCheck.ok) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: colors.background.primary }}>
        <Text style={{ color: colors.text?.primary ?? '#fff', fontSize: 18, fontWeight: '600', marginBottom: 12 }}>
          Missing environment configuration
        </Text>
        <Text style={{ color: colors.text?.secondary ?? '#aaa', fontSize: 14, textAlign: 'center' }}>
          Copy .env.example to .env.local and set:{'\n'}
          {envCheck.missing.join('\n')}
        </Text>
      </View>
    );
  }
  
  useEffect(() => {
    const Prepare = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Artificial delay
      } catch (e) {
        console.warn(e);
      } finally {
        
        setIsAppReady(true);
      }

    }

    Prepare();
    
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if(isAppReady) {
      await SplashScreen.hideAsync();
    }
  }, [isAppReady])

  useEffect(() => {
    if(isAppReady) {
      SplashScreen.hideAsync()
    }
  }, [isAppReady])

  if(!isAppReady) {
    return <LoadingScreen />
  }

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={{ flex: 1, backgroundColor: colors.background.primary }} onLayout={onLayoutRootView}>
          <GlobalProvider>
            <StatusBar style="light" />
            <Stack screenOptions={{
               headerShown: false, 
                contentStyle: { backgroundColor: colors.background.primary }   
               }} 
            />
          </GlobalProvider>
        </View>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  )
}
