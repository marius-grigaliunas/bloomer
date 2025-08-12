import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DatabasePlantType } from '@/interfaces/interfaces';
import colors from '@/constants/colors';
import { router } from 'expo-router';

interface DailyTaskProps {
  plants: Record<string, DatabasePlantType>;
}

export default function DailyTask({ plants }: DailyTaskProps) {
  const getTodaysTasks = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const allPlants = Object.values(plants);
    
    // Separate plants into missed and today's tasks
    const missedPlants = allPlants.filter(plant => {
      if (!plant.nextWateringDate) return false;
      const nextWatering = new Date(plant.nextWateringDate);
      const nextWateringDate = new Date(nextWatering.getFullYear(), nextWatering.getMonth(), nextWatering.getDate());
      return nextWateringDate < today;
    });
    
    const todaysPlants = allPlants.filter(plant => {
      if (!plant.nextWateringDate) return false;
      const nextWatering = new Date(plant.nextWateringDate);
      const nextWateringDate = new Date(nextWatering.getFullYear(), nextWatering.getMonth(), nextWatering.getDate());
      return nextWateringDate.getTime() === today.getTime();
    });
    
    // Prioritize missed plants first, then today's plants
    return [...missedPlants, ...todaysPlants];
  };

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

  const getUrgencyColor = (daysOverdue: number) => {
    if (daysOverdue === 0) return colors.primary.medium; // Today's tasks
    if (daysOverdue <= 2) return colors.warning; // 1-2 days overdue
    if (daysOverdue <= 5) return colors.accent; // 3-5 days overdue
    return colors.danger; // More than 5 days overdue
  };

  const getUrgencyText = (daysOverdue: number) => {
    if (daysOverdue === 0) return "Today";
    if (daysOverdue === 1) return "1 day overdue";
    return `${daysOverdue} days overdue`;
  };

  const getUrgencyBorderClass = (daysOverdue: number) => {
    if (daysOverdue === 0) return "border-[#4F772D]"; // Today's tasks
    if (daysOverdue <= 2) return "border-[#E6B566]"; // 1-2 days overdue
    if (daysOverdue <= 5) return "border-[#E6B566]"; // 3-5 days overdue
    return "border-[#E53935]"; // More than 5 days overdue
  };

  const getUrgencyBgClass = (daysOverdue: number) => {
    if (daysOverdue === 0) return "bg-[#4F772D]"; // Today's tasks
    if (daysOverdue <= 2) return "bg-[#E6B566]"; // 1-2 days overdue
    if (daysOverdue <= 5) return "bg-[#E6B566]"; // 3-5 days overdue
    return "bg-[#E53935]"; // More than 5 days overdue
  };

  const handleTaskPress = (plantId: string) => {
    router.push(`/(root)/plants/${plantId}`);
  };

  const todaysTasks = getTodaysTasks();

  return (
    <View className="mx-4 mb-6">
      <Text className="text-lg font-semibold text-[#2F2F2F] mb-3">Today's Tasks</Text>
      {todaysTasks.length > 0 ? (
        todaysTasks.map((plant, index) => {
          const daysOverdue = getDaysOverdue(plant);
          const urgencyColor = getUrgencyColor(daysOverdue);
          const urgencyText = getUrgencyText(daysOverdue);
          const urgencyBorderClass = getUrgencyBorderClass(daysOverdue);
          const urgencyBgClass = getUrgencyBgClass(daysOverdue);
          
          return (
            <View 
              key={plant.plantId} 
              className={`mb-3 rounded-3xl border-2 ${urgencyBorderClass} overflow-hidden bg-gray-50 shadow-sm shadow-black/5`}
            >
              {daysOverdue > 0 && (
                <View className={`px-4 py-1 ${urgencyBgClass}`}>
                  <Text className="text-white text-xs font-semibold uppercase tracking-wide text-left">
                    {urgencyText}
                  </Text>
                </View>
              )}
              <TouchableOpacity 
                className="p-4"
                onPress={() => handleTaskPress(plant.plantId)}
              >
                <View className="flex-row items-center">
                  <Image 
                    source={{ uri: plant.imageUrl || require("../assets/images/basilicum.png") }}
                    className="w-12 h-12 rounded-full mr-3"
                  />
                  <View className="flex-1">
                    <Text className="font-medium text-[#2F2F2F]">{plant.nickname}</Text>
                    <Text className="text-sm text-[#666666]">Water {plant.wateringAmountMetric || 250}ml</Text>
                  </View>
                  <Ionicons name="water" size={20} color={urgencyColor} />
                </View>
              </TouchableOpacity>
            </View>
          );
        })
      ) : (
        <View className="bg-white rounded-3xl p-4 shadow-sm shadow-black/5">
          <View className="py-8 items-center">
            <Ionicons name="checkmark-circle" size={48} color={colors.success} />
            <Text className="text-[#2E7D32] font-medium mt-2">All caught up!</Text>
            <Text className="text-sm text-[#666666] text-center mt-1">No plants need watering today</Text>
          </View>
        </View>
      )}
    </View>
  );
}
