import { SplashScreen, Stack } from "expo-router";
import * as Font from "expo-font"
import './global.css'
import GlobalProvider from "@/lib/globalProvider";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import colors from "@/constants/colors";
import { LoadingScreen } from "../components/loadingScreen";

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
  )
}
