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
import { Image, ScrollView, Text, View, RefreshControl, Alert, TouchableOpacity, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';

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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  if(error) return Alert.alert("Oops, there's an error...", error);
  
  return (
    <SafeAreaView className="bg-[#F8F8F8] flex-1">
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary.medium}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View className="px-4 pt-4 pb-6">
          <View className="flex-row items-center justify-between mb-2">
            <View>
              <Text className="text-2xl font-semibold text-[#2F2F2F] mb-1">
                {getGreeting()}, {currentUser?.name ? currentUser?.name.split(' ')[0] : "Guest"}
              </Text>
            </View>
            <View className="bg-white rounded-2xl p-3 shadow-sm shadow-black/5">
              <WeatherComponent/>
            </View>
          </View>
        </View>

        {/* Urgent Care Banner */}
        {plantsNeedCare.length > 0 && (
          <View className="mx-4 mb-6">
            <View className="bg-[#E53935] rounded-3xl p-4 flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                <Ionicons name="warning" size={20} color="white" />
                <Text className="text-white font-medium ml-2 flex-1">
                  {plantsNeedCare.length} plant{plantsNeedCare.length > 1 ? 's' : ''} need{plantsNeedCare.length > 1 ? '' : 's'} immediate attention
                </Text>
              </View>
              <TouchableOpacity>
                <Ionicons name="chevron-forward" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Quick Actions Row */}
        <View className="mx-4 mb-6">
          <View className="flex-row space-x-3">
            <TouchableOpacity className="flex-1 bg-[#4F772D] rounded-3xl p-4 items-center shadow-sm shadow-black/5">
              <Ionicons name="camera" size={24} color="white" />
              <Text className="text-white font-medium mt-2 text-center">Identify Plant</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-white rounded-3xl p-4 items-center shadow-sm shadow-black/5 border border-[#90A955]/20">
              <Ionicons name="calendar" size={24} color="#4F772D" />
              <Text className="text-[#4F772D] font-medium mt-2 text-center">View Schedule</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Today's Tasks */}
        <View className="mx-4 mb-6">
          <Text className="text-lg font-semibold text-[#2F2F2F] mb-3">Today's Tasks</Text>
          <View className="bg-white rounded-3xl p-4 shadow-sm shadow-black/5">
                         {plantsNeedCare.length > 0 ? (
               plantsNeedCare.slice(0, 3).map((plant, index) => (
                 <TouchableOpacity key={plant.plantId} className="flex-row items-center py-3 border-b border-gray-100 last:border-b-0">
                   <Image 
                     source={{ uri: plant.imageUrl || require("../../../assets/images/basilicum.png") }}
                     className="w-12 h-12 rounded-full mr-3"
                   />
                   <View className="flex-1">
                     <Text className="font-medium text-[#2F2F2F]">{plant.nickname}</Text>
                     <Text className="text-sm text-[#666666]">Water {plant.wateringAmountMetric || 250}ml</Text>
                   </View>
                   <Ionicons name="water" size={20} color="#4F772D" />
                 </TouchableOpacity>
               ))
            ) : (
              <View className="py-8 items-center">
                <Ionicons name="checkmark-circle" size={48} color="#2E7D32" />
                <Text className="text-[#2E7D32] font-medium mt-2">All caught up!</Text>
                <Text className="text-sm text-[#666666] text-center mt-1">No plants need watering today</Text>
              </View>
            )}
          </View>
        </View>

        {/* My Garden */}
        <View className="mx-4 mb-6">
          <Text className="text-lg font-semibold text-[#2F2F2F] mb-3">My Garden</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                         {Object.values(plants).slice(0, 5).map((plant) => (
               <TouchableOpacity key={plant.plantId} className="bg-white rounded-3xl p-4 mr-3 shadow-sm shadow-black/5 min-w-[120px]">
                 <Image 
                   source={{ uri: plant.imageUrl || require("../../../assets/images/basilicum.png") }}
                   className="w-16 h-16 rounded-2xl mb-3"
                 />
                 <Text className="font-medium text-[#2F2F2F] text-sm mb-1">{plant.nickname}</Text>
                 <Text className="text-xs text-[#666666]">
                   Next: {plant.nextWateringDate ? new Date(plant.nextWateringDate).toLocaleDateString() : 'Unknown'}
                 </Text>
               </TouchableOpacity>
             ))}
            <TouchableOpacity className="bg-white rounded-3xl p-4 mr-3 shadow-sm shadow-black/5 border-2 border-dashed border-[#90A955] min-w-[120px] items-center justify-center">
              <Ionicons name="add" size={32} color="#90A955" />
              <Text className="text-[#90A955] font-medium mt-2 text-sm">Add Plant</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* This Week's Calendar */}
        <View className="mx-4 mb-6">
          <Text className="text-lg font-semibold text-[#2F2F2F] mb-3">This Week</Text>
          <View className="bg-white rounded-3xl p-4 shadow-sm shadow-black/5">
            <View className="flex-row justify-between">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                <TouchableOpacity key={index} className="w-10 h-10 rounded-full items-center justify-center">
                  <Text className="text-sm font-medium text-[#666666]">{day}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View className="flex-row justify-between mt-2">
              {Array.from({ length: 7 }, (_, i) => {
                const hasTask = Math.random() > 0.5; // Mock data
                return (
                  <TouchableOpacity key={i} className={`w-10 h-10 rounded-full items-center justify-center ${hasTask ? 'bg-[#4F772D]' : ''}`}>
                    <Text className={`text-sm font-medium ${hasTask ? 'text-white' : 'text-[#2F2F2F]'}`}>
                      {i + 1}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
        <View className="h-20" />

        {/* Loading Screen */}
        {isLoading && <LoadingScreen />}
      </ScrollView>
    </SafeAreaView>
  );
}
