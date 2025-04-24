import { View, Text, ScrollView, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CalendarGenerator from '@/components/CalendarGenerator'
import { DatabasePlantType } from '@/interfaces/interfaces'
import { WateringDay, generateWateringDays } from '@/lib/services/dateService'
import { useGlobalContext } from '@/lib/globalProvider'
import { getUserPlants } from '@/lib/appwrite'
import colors from '@/constants/colors'

const Care = () => {
    const [wateringDays, setWateringDays] = useState<Map<string, WateringDay>>(new Map());
    const { isLoggedIn, user } = useGlobalContext();
    const [refreshing, setRefreshing] = useState(false);

    const loadPlants = async () => {
      if (!isLoggedIn || !user) return;
      
      const plants = await getUserPlants(user.$id);
      console.log(`Loaded ${plants.length} plants`);
      
      const startDate = new Date(); // Today
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30); // 30 days from now
      
      console.log('Generating watering days from', startDate, 'to', endDate);
      const days = generateWateringDays(plants, startDate, endDate);
      console.log(`Generated ${days.size} watering days`);
      
      setWateringDays(days);
    };

    useEffect(() => {    
        loadPlants();
    }, [isLoggedIn, user]);

    const onRefresh = async () => {
      setRefreshing(true);
      await loadPlants();
      setRefreshing(false);
    };

    const handleDayPress = (date: Date) => {
        const dateKey = date.toISOString().split('T')[0];
        const wateringDay = wateringDays.get(dateKey);
        if (wateringDay) {
            // You can add logic here to show details about the plants that need watering
            console.log('Plants to water:', wateringDay.plants);
        }
    };

    const getFormattedFullDate = (date: Date) : string => {
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
          
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        const day = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();
        return `${days[date.getDay()]}, ${day} ${months[month]} ${year}`;
    };

    return (
        <SafeAreaView className='bg-background-primary flex justify-center items-center h-full'>
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
                <CalendarGenerator 
                    wateringDays={wateringDays}
                    onDayPress={handleDayPress}
                />
                <View className="h-72 bg-background-primary rounded-2xl">

                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Care