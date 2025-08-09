import HealthBar from "@/components/HealthBar";
import LoadingScreen from "@/components/LoadingScreen";
import MyPlants from "@/components/MyPlants";
import PlantsForLater from "@/components/PlantsForLater";
import UrgentCare from "@/components/UrgentCare";
import WeatherComponent from "@/components/WeatherComponent";
import colors from "@/constants/colors";
import { mockPlants, plantsForLater, plantsNeedAttention } from "@/constants/mockData";
import { DatabasePlantType } from "@/interfaces/interfaces";
import { usePlantStore } from "@/interfaces/plantStore";
import { getCurrentUser, getUserPlants } from "@/lib/appwrite";
import { useGlobalContext } from "@/lib/globalProvider";
import { calculateDaysLate } from "@/lib/services/dateService";
import { useEffect, useState, useRef } from "react";
import { Image, ScrollView, Text, View, RefreshControl, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {

  const { isLoggedIn, user: contextUser, refetch} = useGlobalContext();
  const [ currentUser, setCurrentUser ] = useState(contextUser);

  const [ plantsNeedCare, setPlantsNeedCare ] = useState<DatabasePlantType[]>([]);
  const [ plantsNeedCareLater, setPlantsNeedCareLater ] = useState<DatabasePlantType[]>([]);

  const [ loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const { plants, allPlantIds, isLoading, error, fetchAllUserPlants } = usePlantStore();

  const [lastUserId, setLastUserId] = useState<string | null>(null);

  useEffect(() => {
    const currentUserId = contextUser?.$id ?? "";
    if (currentUserId && currentUserId !== lastUserId) {
      setLastUserId(currentUserId);
      fetchAllUserPlants(currentUserId);
    }
  }, [contextUser?.$id, lastUserId]);

  // Add a ref to track if we've already calculated for this plants data
  const plantsRef = useRef<Record<string, DatabasePlantType>>({});

  useEffect(() => {
    const updatePlantsCare = () => {
      // Only recalculate if plants data has actually changed
      const plantsString = JSON.stringify(plants);
      const plantsRefString = JSON.stringify(plantsRef.current);
      
      if (plantsString === plantsRefString) {
        return; // Skip if plants haven't changed
      }
      
      plantsRef.current = plants;
      
      const now = new Date();
      const needsCareNow = Object.values(plants).filter(plant => {
        if (!plant.lastWatered || !plant.wateringFrequency || !plant.nextWateringDate) return false;
        return new Date(plant.nextWateringDate) <= now;
      });
      setPlantsNeedCare(needsCareNow);

      const needsCareSoon = Object.values(plants).filter(plant => {
        if (!plant.lastWatered || !plant.wateringFrequency || !plant.nextWateringDate) return false;

        const nextWatering = new Date(plant.nextWateringDate);
        const threeDaysFromNow = new Date();
        threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
        
        return nextWatering > now && nextWatering <= threeDaysFromNow;
      });
      setPlantsNeedCareLater(needsCareSoon);
    };

    updatePlantsCare();
  }, [plants]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAllUserPlants(contextUser?.$id ?? "", true); // Force refresh on pull-to-refresh
    setRefreshing(false);
  };

  if(error) return Alert.alert("Oops, there's an error...", error);
  
  return (
    <SafeAreaView className="bg-background-primary h-full">
      <ScrollView 
        contentContainerStyle={{height: 'auto'}}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary.medium}
          />
        }
      >
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
        <View>
          <View className="flex flex-1 gap-1">
            <HealthBar
              numberOfPlants={Object.keys(plants).length}
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
          {isLoading && <LoadingScreen />}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
