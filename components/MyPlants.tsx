import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import colors from '@/constants/colors';
import { router } from 'expo-router';
import { DatabasePlantType } from '@/interfaces/interfaces';
import { Ionicons } from '@expo/vector-icons';

interface MyPlantsProps {
    myPlants: Record<string, DatabasePlantType>;
    showAddButton?: boolean;
    title?: string;
    fromPage?: string;
}

const MyPlants = ({myPlants, showAddButton = true, title = "My Garden", fromPage = "index"}: MyPlantsProps) => {
    
    const handleRoutingToIdentify = () => {
        router.push('/(root)/(tabs)/identify');
    }

    const getDaysOverdue = (plant: DatabasePlantType) => {
        if (!plant.nextWateringDate) return 0;
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const nextWatering = new Date(plant.nextWateringDate);
        const nextWateringDate = new Date(nextWatering.getFullYear(), nextWatering.getMonth(), nextWatering.getDate());
        
        const diffTime = today.getTime() - nextWateringDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return Math.max(0, diffDays);
    };

    const getUrgencyBorderClass = (daysOverdue: number) => {
        if (daysOverdue === 0) return ""; // No border for on-time plants
        if (daysOverdue <= 2) return "border-2 border-[#E6B566]"; // 1-2 days overdue
        if (daysOverdue <= 5) return "border-2 border-[#E6B566]"; // 3-5 days overdue
        return "border-2 border-[#E53935]"; // More than 5 days overdue
    };
    
    return (
        <View className="mx-4 mb-6">
            <Text className="text-lg font-semibold text-[#2F2F2F] mb-3">{title}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                {Object.values(myPlants).map((plant) => {
                    const daysOverdue = getDaysOverdue(plant);
                    const urgencyBorderClass = getUrgencyBorderClass(daysOverdue);
                    
                    return (
                        <TouchableOpacity 
                            key={plant.plantId} 
                            className={`bg-white rounded-3xl p-4 mr-3 shadow-sm shadow-black/5 min-w-[120px] ${urgencyBorderClass}`}
                            onPress={() => router.push(`/plants/${plant.plantId}?from=${fromPage}`)}
                        >
                            <Image 
                                source={{ uri: plant.imageUrl || require("./../assets/images/basilicum.png") }}
                                className="w-16 h-16 rounded-2xl mb-3"
                            />
                            <Text className="font-medium text-[#2F2F2F] text-sm mb-1">{plant.nickname}</Text>
                            <Text className="text-xs text-[#666666]">
                                Next: {plant.nextWateringDate ? new Date(plant.nextWateringDate).toLocaleDateString() : 'Unknown'}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
                {showAddButton && (
                    <TouchableOpacity 
                        className="bg-white rounded-3xl p-4 mr-3 shadow-sm shadow-black/5 border-2 border-dashed border-[#90A955] min-w-[120px] items-center justify-center"
                        onPress={handleRoutingToIdentify}
                    >
                        <Ionicons name="add" size={32} color="#90A955" />
                        <Text className="text-[#90A955] font-medium mt-2 text-sm">Add Plant</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </View>
    )
}

export default MyPlants