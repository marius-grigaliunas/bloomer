import LoadingScreen from "@/components/LoadingScreen";
import MyPlants from "@/components/MyPlants";
import WeatherComponent, { WeatherComponentRef } from "@/components/WeatherComponent";
import DailyTask from "@/components/DailyTask";
import WeekCalendar from "@/components/WeekCalendar";
import colors from "@/constants/colors";
import { DatabasePlantType } from "@/interfaces/interfaces";
import { usePlantStore } from "@/interfaces/plantStore";
import { getCurrentUser, getUserPlants } from "@/lib/appwrite";
import { useGlobalContext } from "@/lib/globalProvider";
import { useEffect, useState, useRef } from "react";
import { useWateringDays } from "@/lib/hooks/useWateringDays";
import { useNavigationState } from "@/lib/navigationState";
import { ScrollView, Text, View, RefreshControl, Alert, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { WeatherProps } from "@/interfaces/interfaces";

export default function Index() {

  const { isLoggedIn, user: contextUser, refetch, databaseUser} = useGlobalContext();
  
  const [ currentUser, setCurrentUser ] = useState(contextUser);

  // Update currentUser when contextUser changes
  useEffect(() => {
    setCurrentUser(contextUser);
  }, [contextUser]);

  const [ loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const { plants, allPlantIds, isLoading, error, fetchAllUserPlants } = usePlantStore();

  const [lastUserId, setLastUserId] = useState<string | null>(null);

  // Weather state
  const [weatherData, setWeatherData] = useState<WeatherProps | null>(null);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const weatherComponentRef = useRef<WeatherComponentRef>(null);

  // Use custom hook for watering days logic
  const { wateringDays, plantsNeedCare, plantsNeedCareLater, isTestData } = useWateringDays(plants);
  
  // Navigation state for care tab
  const { setCareState } = useNavigationState();

  useEffect(() => {
    const currentUserId = contextUser?.$id ?? "";
    if (currentUserId && currentUserId !== lastUserId) {
      setLastUserId(currentUserId);
      fetchAllUserPlants(currentUserId);
    }
  }, [contextUser?.$id, lastUserId]);

  const onRefresh = async () => {
    setRefreshing(true);
    
    // Refresh both plants and weather data
    const refreshPromises = [
      fetchAllUserPlants(contextUser?.$id ?? "", true), // Force refresh on pull-to-refresh
      weatherComponentRef.current?.refreshWeather() // Refresh weather data
    ];
    
    await Promise.all(refreshPromises);
    setRefreshing(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const handleWeatherUpdate = (weather: WeatherProps | null, error: string | null) => {
    setWeatherData(weather);
    setWeatherError(error);
  };

  if(error) {
    console.error("Error in main screen:", error);
    return Alert.alert("Oops, there's an error...", error);
  }

  // Show loading screen if still loading
  if(isLoading) {
    return <LoadingScreen message="Loading your garden..." />;
  }

  // Show a simple fallback if databaseUser is undefined
  if(!databaseUser) {
    return (
      <SafeAreaView className="bg-[#F8F8F8] flex-1 justify-center items-center">
        <Text className="text-lg font-semibold text-[#2F2F2F] mb-4">
          Loading user data...
        </Text>
        <Text className="text-sm text-[#666666] text-center px-4">
          User ID: {contextUser?.$id || "None"}
        </Text>
        <Text className="text-sm text-[#666666] text-center px-4 mt-2">
          Database User: {databaseUser ? "Loaded" : "Not loaded"}
        </Text>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView key={`index-${databaseUser?.userId || 'no-user'}`} className="bg-[#F8F8F8] flex-1">
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
                {getGreeting()}, {databaseUser?.displayName ? databaseUser.displayName.split(' ')[0] : currentUser?.name ? currentUser.name.split(' ')[0] : "Guest"}
              </Text>
              {weatherData?.location && (
                <Text className="text-2xl text-[#4F772D] font-medium">
                  {weatherData.location}
                </Text>
              )}
            </View>
            <View className="bg-white rounded-2xl p-3 shadow-sm shadow-black/5">
              <WeatherComponent ref={weatherComponentRef} onWeatherUpdate={handleWeatherUpdate}/>
            </View>
          </View>
        </View>

        {/* Quick Actions Row */}
        <View className="mx-4 mb-6">
          <View className="flex-row">
            <TouchableOpacity
              onPress={() => router.push("/(root)/(tabs)/identify")}
              className="flex-1 bg-[#4F772D] rounded-3xl p-4 items-center shadow-sm shadow-black/5"
            >
              <Ionicons name="camera" size={24} color="white" />
              <Text className="text-white font-medium mt-2 text-center">Identify Plant</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/(root)/(tabs)/care")}
              className="flex-1 bg-white rounded-3xl p-4 items-center shadow-sm shadow-black/5 border border-[#90A955]/20 ml-3"
            >
              <Ionicons name="calendar" size={24} color="#4F772D" />
              <Text className="text-[#4F772D] font-medium mt-2 text-center">View Schedule</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="mx-4 ">
          <Text className="text-lg font-semibold text-[#2F2F2F] mb-3">Today's Tasks</Text>
        </View>

        {/* Urgent Care Banner */}
        {plantsNeedCare.length > 0 && (
          <View className="mx-4 mb-3">
            <View className="bg-[#E53935] rounded-3xl p-4 flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                <Ionicons name="warning" size={20} color="white" />
                <Text className="text-white font-medium ml-2 flex-1">
                  {plantsNeedCare.length} plant{plantsNeedCare.length > 1 ? 's' : ''} need{plantsNeedCare.length > 1 ? '' : 's'} immediate attention
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Today's Tasks */}
        <DailyTask plants={plants} />

        {/* My Garden */}
        <MyPlants myPlants={plants} />

        {/* This Week's Calendar */}
        <View className="mx-4 mb-6">
          <Text className="text-lg font-semibold text-[#2F2F2F] mb-3">This Week</Text>
                     <WeekCalendar 
             mondayFirstDayOfWeek={!!databaseUser?.mondayFirstDayOfWeek}
             wateringDays={wateringDays}
             isTestData={isTestData}
             onDayPress={(date) => {
               // Set navigation state for care tab with selected date
               setCareState({
                 selectedDate: date,
                 selectedMonth: date.getMonth(),
                 selectedYear: date.getFullYear(),
                 selectedPlants: []
               });
               // Navigate to care tab
               router.push("/(root)/(tabs)/care");
             }}
           />
        </View>
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}
