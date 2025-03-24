import WeatherComponent from "@/components/WeatherComponent";
import { getCurrentUser } from "@/lib/appwrite";
import { useGlobalContext } from "@/lib/globalProvider";
import { useEffect, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {

  const { isLoggedIn, user: contextUser } = useGlobalContext();
  const [ currentUser, setCurrentUser ] = useState(contextUser);

  useEffect(() => {
    if(isLoggedIn) {
      getCurrentUser().then(userData => {
        setCurrentUser(userData)
      })
    }
  }, [isLoggedIn])
  
  return (
    <SafeAreaView className="bg-background-primary h-full">
      <ScrollView contentContainerStyle={{height: 'auto'}}>
        <View className="flex flex-row justify-start h-24  
          rounded-2xl items-center bg-background-surface
          shadow-lg shadow-amber-50">
          <Image source={require("../../../assets/images/logo-noname-500x500.png")} 
            className="w-20 h-20" />
          <Text className="text-text-primary text-2xl mx-4">Welcome 
            {currentUser?.name ? " " + currentUser?.name.split(' ')[0] : " Guest" }
          </Text>
          <View className="h-20 w-44 flex justify-center items-center">
              <WeatherComponent/>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
