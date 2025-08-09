import { View, Text, ScrollView, RefreshControl } from 'react-native'
import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CalendarGenerator from '@/components/CalendarGenerator'
import { DatabasePlantType } from '@/interfaces/interfaces'
import { WateringDay, generateWateringDays } from '@/lib/services/dateService'
import { useGlobalContext } from '@/lib/globalProvider'
import { getUserPlants } from '@/lib/appwrite'
import colors from '@/constants/colors'
import PlantCard from '@/components/PlantCard'
import { useNavigationState } from '@/lib/navigationState'

const Care = () => {
    const [wateringDays, setWateringDays] = useState<Map<string, WateringDay>>(new Map());
    const { isLoggedIn, user, databaseUser } = useGlobalContext();
    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedPlants, setSelectedPlants] = useState<DatabasePlantType[]>([]);
    const [allPlants, setAllPlants] = useState<DatabasePlantType[]>([]);
    
    // Create a memoized plants map for faster lookups
    const plantsMap = useMemo(() => {
        const map = new Map<string, DatabasePlantType>();
        allPlants.forEach(plant => map.set(plant.plantId, plant));
        return map;
    }, [allPlants]);
    const { careState, setCareState } = useNavigationState();

    const loadPlants = useCallback(async () => {
        try {
            if (!isLoggedIn || !user) return;
            
            // Load plants data without blocking UI
            const plants = await getUserPlants(user.$id);
            setAllPlants(plants);
            
            // Process watering days with extended range to support pre-generated months
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - 60); // Include past 2 months
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + 120); // Include future 4 months
            
            const days = generateWateringDays(plants, startDate, endDate);
            setWateringDays(days);

        } catch (error) {
            console.error('Error loading plants:', error);
        }
    }, [isLoggedIn, user]);

    // Split the effects to handle initial load and user/login changes separately
    useEffect(() => {
        loadPlants();
    }, [loadPlants]);

    // Restore navigation state when component mounts or care state changes
    useEffect(() => {
        if (careState.selectedDate && allPlants.length > 0) {
            setSelectedDate(careState.selectedDate);
            
            // Optimize date key generation
            const date = new Date(careState.selectedDate);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            const dateKey = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;
            const wateringDay = wateringDays.get(dateKey);
            
            if (wateringDay) {
                const plantsForDay = wateringDay.plants.map(plant => {
                    return plantsMap.get(plant.plantId)!;
                }).filter(Boolean);
                
                setSelectedPlants(plantsForDay);
            }
        }
    }, [careState.selectedDate, plantsMap, wateringDays]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadPlants();
        setRefreshing(false);
    }, [loadPlants]);    const handleDayPress = useCallback((date: Date) => {
        // Optimize date key generation to avoid string padding operations
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const dateKey = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;
        const wateringDay = wateringDays.get(dateKey);
        
        if (wateringDay) {
            setSelectedDate(date);
            // Find full plant data for each plant in the watering day using optimized Map lookup
            const plantsForDay = wateringDay.plants.map(plant => {
                return plantsMap.get(plant.plantId)!;
            }).filter(Boolean); // Remove any undefined values just in case
            
            setSelectedPlants(plantsForDay);
            
            // Save to navigation state for restoration
            setCareState({
                selectedDate: date,
                selectedMonth: date.getMonth(),
                selectedYear: date.getFullYear(),
                selectedPlants: plantsForDay.map(p => p.plantId)
            });
        } else {
            setSelectedDate(null);
            setSelectedPlants([]);
            
            // Clear navigation state
            setCareState({
                selectedDate: null,
                selectedPlants: []
            });
        }
    }, [wateringDays, plantsMap, setCareState]);

    // Memoize static arrays to avoid recreation on every call
    const monthNames = useMemo(() => ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], []);
    const dayNames = useMemo(() => ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], []);

    const getFormattedFullDate = useCallback((date: Date): string => {
        const day = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();
        return `${dayNames[date.getDay()]}, ${day} ${monthNames[month]} ${year}`;
    }, [dayNames, monthNames]);
    
    // Memoize current date calculation to avoid creating new Date objects on every render
    const currentDate = useMemo(() => new Date(), []);
    const formattedCurrentDate = useMemo(() => getFormattedFullDate(currentDate), [currentDate, getFormattedFullDate]);

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
                            {formattedCurrentDate}
                        </Text>
                    </View>
                    
                    <View className="flex-1">
                        <CalendarGenerator 
                            wateringDays={wateringDays}
                            onDayPress={handleDayPress}
                            mondayFirstDayOfWeek={!!databaseUser?.mondayFirstDayOfWeek}
                            selectedDate={selectedDate}
                            initialMonth={careState.selectedMonth}
                            initialYear={careState.selectedYear}
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
                                        from="care"
                                        selectedDate={selectedDate}
                                        selectedMonth={careState.selectedMonth}
                                        selectedYear={careState.selectedYear}
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