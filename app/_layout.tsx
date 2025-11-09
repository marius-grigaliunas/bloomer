import { SplashScreen, Stack } from "expo-router";
import * as Font from "expo-font"
import './global.css'
import "@/lib/i18n/config";
import GlobalProvider from "@/lib/globalProvider";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import colors from "@/constants/colors";
import LoadingScreen from "../components/LoadingScreen";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isAppReady, setIsAppReady] = useState(false);
  
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
