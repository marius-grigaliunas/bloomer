import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native'
import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CalendarGenerator, { clearCalendarCache } from '@/components/CalendarGenerator'
import { DatabasePlantType } from '@/interfaces/interfaces'
import { WateringDay, generateWateringDays, pregenerateWateringDays, clearWateringDaysCache } from '@/lib/services/dateService'
import { useGlobalContext } from '@/lib/globalProvider'
import { getUserPlants } from '@/lib/appwrite'
import colors from '@/constants/colors'
import TaskCard from '@/components/TaskCard'
import { useNavigationState } from '@/lib/navigationState'

const Care = () => {
    const [wateringDays, setWateringDays] = useState<Map<string, WateringDay>>(new Map());
    const { isLoggedIn, user, databaseUser } = useGlobalContext();
    const [refreshing, setRefreshing] = useState(false);
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

    // Memoize static arrays to avoid recreation on every call
    const monthNames = useMemo(() => ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], []);
    const dayNames = useMemo(() => ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], []);

    // Memoize current date calculation to avoid creating new Date objects on every render
    const currentDate = useMemo(() => new Date(), []);
    
    const getFormattedFullDate = useCallback((date: Date): string => {
        const day = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();
        return `${dayNames[date.getDay()]}, ${day} ${monthNames[month]} ${year}`;
    }, [dayNames, monthNames]);
    
    const formattedCurrentDate = useMemo(() => getFormattedFullDate(currentDate), [currentDate, getFormattedFullDate]);

    // Get current day of the week
    const currentDayOfWeek = useMemo(() => {
        return dayNames[currentDate.getDay()];
    }, [currentDate, dayNames]);

    // Get formatted current date (DD/MM/YYYY)
    const formattedCurrentDateShort = useMemo(() => {
        const day = currentDate.getDate().toString().padStart(2, '0');
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const year = currentDate.getFullYear();
        return `${day}/${month}/${year}`;
    }, [currentDate]);

    // Optimized date key generation with proper padding to match dateService
    const generateDateKey = useCallback((date: Date): string => {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;
    }, []);

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
            
            // Pre-generate additional months in the background for seamless navigation
            setTimeout(() => {
                pregenerateWateringDays(plants, 12); // Pre-generate 12 months ahead
            }, 100);

        } catch (error) {
            console.error('Error loading plants:', error);
        }
    }, [isLoggedIn, user]);

    // Split the effects to handle initial load and user/login changes separately
    useEffect(() => {
        loadPlants();
    }, [loadPlants]);

    // Clear cache when user changes to ensure fresh data
    useEffect(() => {
        if (isLoggedIn && user) {
            clearWateringDaysCache();
            clearCalendarCache();
        }
    }, [isLoggedIn, user]);

    // Restore navigation state when component mounts or care state changes
    useEffect(() => {
        if (careState.selectedDate && allPlants.length > 0) {
            setSelectedDate(careState.selectedDate);
            
            // Optimize date key generation
            const dateKey = generateDateKey(careState.selectedDate);
            const wateringDay = wateringDays.get(dateKey);
            
            if (wateringDay) {
                const plantsForDay = wateringDay.plants.map(plant => {
                    return plantsMap.get(plant.plantId)!;
                }).filter(Boolean);
                
                setSelectedPlants(plantsForDay);
            }
        }
    }, [careState.selectedDate, plantsMap, wateringDays, generateDateKey]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadPlants();
        setRefreshing(false);
    }, [loadPlants]);

    const handleDayPress = useCallback((date: Date) => {
        // Optimize date key generation to avoid string padding operations
        const dateKey = generateDateKey(date);
        const wateringDay = wateringDays.get(dateKey);
        
        setSelectedDate(date);
        
        if (wateringDay) {
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
            // No watering tasks for this day, but still allow selection
            setSelectedPlants([]);
            
            // Save to navigation state for restoration
            setCareState({
                selectedDate: date,
                selectedMonth: date.getMonth(),
                selectedYear: date.getFullYear(),
                selectedPlants: []
            });
        }
    }, [wateringDays, plantsMap, setCareState, generateDateKey]);

    // Determine task status based on watering day data
    const getTaskStatus = useCallback((plant: DatabasePlantType, wateringDay: WateringDay | undefined) => {
        if (!wateringDay) return 'pending';
        
        const plantInDay = wateringDay.plants.find(p => p.plantId === plant.plantId);
        if (!plantInDay) return 'pending';
        
        if (plantInDay.isLate) return 'urgent';
        return 'pending';
    }, []);

    // Memoize the selected plants section to prevent unnecessary re-renders
    const selectedPlantsSection = useMemo(() => {
        if (!selectedDate) return null;
        
        const dateKey = generateDateKey(selectedDate);
        const wateringDay = wateringDays.get(dateKey);
        
        return (
            <View className="w-full px-4 mt-6">
                <Text className="text-green-600 text-xl font-semibold mb-4">
                    Tasks for {getFormattedFullDate(selectedDate)}
                </Text>
                {selectedPlants.length > 0 ? (
                    <View className="w-full">
                        {selectedPlants.map((plant) => (
                            <TaskCard
                                key={plant.plantId}
                                plant={plant}
                                from="care"
                                selectedDate={selectedDate}
                                selectedMonth={careState.selectedMonth}
                                selectedYear={careState.selectedYear}
                                status={getTaskStatus(plant, wateringDay)}
                            />
                        ))}
                    </View>
                ) : (
                    <View className="w-full">
                        <View className="bg-gray-50 rounded-xl p-6 mb-3 border border-gray-200">
                            <Text className="text-gray-500 text-center text-lg">
                                No tasks scheduled for this day
                            </Text>
                        </View>
                    </View>
                )}
            </View>
        );
    }, [selectedDate, selectedPlants, getFormattedFullDate, careState.selectedMonth, careState.selectedYear, wateringDays, generateDateKey, getTaskStatus]);

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
                    {/* Header Section */}
                    <View className="w-full px-4 pt-4 pb-6">
                        <View className="flex-row justify-between items-center mb-2">
                            <Text className="text-text-primary text-3xl font-bold">
                                Schedule
                            </Text>
                            <Text className="text-text-primary text-3xl font-bold">
                                {currentDayOfWeek}
                            </Text>
                        </View>
                        <View className="flex-row justify-between items-center">
                            <Text className="text-text-secondary text-lg">
                                Your monthly watering plan
                            </Text>
                            <Text className="text-text-secondary text-lg">
                                {formattedCurrentDateShort}
                            </Text>
                        </View>
                    </View>
                    
                    {/* Calendar Section */}
                    <View className="flex-1 px-4">
                        <CalendarGenerator 
                            wateringDays={wateringDays}
                            onDayPress={handleDayPress}
                            mondayFirstDayOfWeek={!!databaseUser?.mondayFirstDayOfWeek}
                            selectedDate={selectedDate}
                            initialMonth={careState.selectedMonth}
                            initialYear={careState.selectedYear}
                        />
                    </View>

                    {/* Tasks Section */}
                    {selectedPlantsSection}

                    <View className="h-24" />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Care