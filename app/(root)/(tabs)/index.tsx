import HealthBar from "@/components/HealthBar";
import LoadingScreen from "@/components/LoadingScreen";
import MyPlants from "@/components/MyPlants";
import PlantsForLater from "@/components/PlantsForLater";
import UrgentCare from "@/components/UrgentCare";
import WeatherComponent from "@/components/WeatherComponent";
import { mockPlants, plantsForLater, plantsNeedAttention } from "@/constants/mockData";
import { DatabasePlantType } from "@/interfaces/interfaces";
import { getCurrentUser, getUserPlants } from "@/lib/appwrite";
import { useGlobalContext } from "@/lib/globalProvider";
import { useEffect, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {

  const { isLoggedIn, user: contextUser } = useGlobalContext();
  const [ currentUser, setCurrentUser ] = useState(contextUser);

  const [ plants, setPlants ] = useState<DatabasePlantType[]>([]);
  const [ plantsNeedCare, setPlantsNeedCare ] = useState<DatabasePlantType[]>([]);
  const [ plantsNeedCareLater, setPlantsNeedCareLater ] = useState<DatabasePlantType[]>([]);

  const [ loading, setLoading] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        if(isLoggedIn && contextUser?.$id) {
          const userData = await getCurrentUser();
          setCurrentUser(userData);

          const userPlants = await getUserPlants(contextUser.$id);
          setPlants(userPlants);
          
          const now = new Date();
          const needsCareNow = userPlants.filter(plant => {
            if (!plant.nextWateringDate) return false;
            
            const nextWatering = new Date(plant.nextWateringDate);
            return nextWatering <= now;
          });
          setPlantsNeedCare(needsCareNow);

          const needsCareSoon = userPlants.filter(plant => {
            if (!plant.nextWateringDate) return false;

            const nextWatering = new Date(plant.nextWateringDate);
            const threeDaysFromNow = new Date(now.setDate(now.getDate() + 3));
            return nextWatering > now && nextWatering <= threeDaysFromNow;
          });
          setPlantsNeedCareLater(needsCareSoon);

        }
      } catch (error) {
        console.log("Error geting userData:", error)
      } finally {
        setLoading(false);
      }
  }}, [isLoggedIn])
  
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
          <View className="h-20 w-44 flex justify-center items-center rounded-full
           bg-background-primary shadow-md shadow-primary-medium">
              <WeatherComponent/>
          </View>
        </View>
        {loading ? (
          <View className="mt-10">
            <LoadingScreen/>
          </View>
        ) : (
          <View>
            <View className="flex flex-1 gap-1">
              <HealthBar
                numberOfPlants={plants.length}
                plantsThatNeedCare={plantsNeedCare.length}
              />
              <UrgentCare 
                plantsThatNeedCare={plantsNeedCare}
              />
            </View>

            <MyPlants
              myPlants={plants}
            />
            <PlantsForLater
              plantsForLater={plantsNeedCareLater}
            />
            <View className="h-72 bg-background-primary rounded-2xl">
            
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
