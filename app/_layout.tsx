import { Stack } from "expo-router";
import './global.css'
import GlobalProvider from "@/lib/globalProvider";

export default function RootLayout() {
  
  return (
    <GlobalProvider>
      <Stack 
        screenOptions={{headerShown: false}}
        > 
      </Stack>
    </GlobalProvider>
  )
}
