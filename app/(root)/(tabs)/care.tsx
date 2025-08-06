import { View, Text, ScrollView, RefreshControl } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CalendarGenerator from '@/components/CalendarGenerator'
import { DatabasePlantType } from '@/interfaces/interfaces'
import { WateringDay, generateWateringDays } from '@/lib/services/dateService'
import { useGlobalContext } from '@/lib/globalProvider'
import { getUserPlants } from '@/lib/appwrite'
import colors from '@/constants/colors'
import PlantCard from '@/components/PlantCard'

const Care = () => {
    const [wateringDays, setWateringDays] = useState<Map<string, WateringDay>>(new Map());
    const { isLoggedIn, user, databaseUser } = useGlobalContext();
    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedPlants, setSelectedPlants] = useState<DatabasePlantType[]>([]);
    const [allPlants, setAllPlants] = useState<DatabasePlantType[]>([]); // Add this line

    const loadPlants = async () => {
        try {
            if (!isLoggedIn || !user) return;
            
            setIsLoading(true);
            const plants = await getUserPlants(user.$id);
            setAllPlants(plants); // Add this line
            
            const startDate = new Date();
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + 120);
            
            const days = generateWateringDays(plants, startDate, endDate);
            
            setWateringDays(days);

            console.log(days);
        } catch (error) {
            console.error('Error loading plants:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Split the effects to handle initial load and user/login changes separately
    useEffect(() => {
        loadPlants();
    }, []); // Empty dependency array for initial load

    useEffect(() => {
        if (isLoggedIn && user) {
            loadPlants();
        }
    }, [isLoggedIn, user]);

    const onRefresh = async () => {
      setRefreshing(true);
      await loadPlants();
      setRefreshing(false);
    };    const handleDayPress = useCallback((date: Date) => {
        // Normalize the date to midnight UTC
        const normalizedDate = new Date(date);
        normalizedDate.setHours(0, 0, 0, 0);
        
        // Format date key consistently with how we store it in wateringDays
        const dateKey = `${normalizedDate.getFullYear()}-${String(normalizedDate.getMonth() + 1).padStart(2, '0')}-${String(normalizedDate.getDate()).padStart(2, '0')}`;
        const wateringDay = wateringDays.get(dateKey);
        
        if (wateringDay) {
            setSelectedDate(date);
            // Find full plant data for each plant in the watering day
            const plantsForDay = wateringDay.plants.map(plant => {
                const fullPlantData = allPlants.find(p => p.plantId === plant.plantId);
                return fullPlantData!; // The plant should exist in allPlants
            }).filter(Boolean); // Remove any undefined values just in case
            
            setSelectedPlants(plantsForDay);
        } else {
            setSelectedDate(null);
            setSelectedPlants([]);
        }
    }, [wateringDays, allPlants]);

    const getFormattedFullDate = (date: Date) : string => {
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
          
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        const day = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();
        return `${days[date.getDay()]}, ${day} ${months[month]} ${year}`;
    };

    return (
        <SafeAreaView className='bg-background-primary flex-1'>
            <ScrollView 
                showsVerticalScrollIndicator={true}
                scrollEnabled={true}
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: 80 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={colors.primary.medium}
                    />
                }
            >
                <View className="flex-1">
                    <View className="flex flex-row justify-around w-screen h-24 
                        rounded-2xl items-center bg-background-surface
                        shadow-lg shadow-amber-50">
                        <Text className="text-text-primary text-2xl mx-4">
                            Schedule
                        </Text>
                        <Text className="text-text-primary text-2xl mx-4">
                            {getFormattedFullDate(new Date())}
                        </Text>
                    </View>
                    
                    <View className="flex-1">
                        <CalendarGenerator 
                            wateringDays={wateringDays}
                            onDayPress={handleDayPress}
                            mondayFirstDayOfWeek={!!databaseUser?.mondayFirstDayOfWeek}
                            selectedDate={selectedDate}
                        />
                    </View>

                    {selectedDate && selectedPlants.length > 0 && (
                        <View className="w-full px-4 mt-4">
                            <Text className="text-text-primary text-xl font-semibold mb-2">
                                Water on {getFormattedFullDate(selectedDate)}
                            </Text>
                            <View className="flex flex-row flex-wrap justify-start gap-2">
                                {selectedPlants.map((plant) => (
                                    <PlantCard
                                        key={plant.plantId}
                                        {...plant}
                                    />
                                ))}
                            </View>
                        </View>
                    )}

                    <View className="h-24" />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Care