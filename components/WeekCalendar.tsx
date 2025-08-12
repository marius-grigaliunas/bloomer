import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import colors from '@/constants/colors';
import { WateringDay } from '@/lib/services/dateService';

interface WeekCalendarProps {
  mondayFirstDayOfWeek?: boolean;
  onDayPress?: (date: Date) => void;
  selectedDate?: Date | null;
  wateringDays?: Map<string, WateringDay>;
  isTestData?: boolean;
}

const WeekCalendar: React.FC<WeekCalendarProps> = ({ 
  mondayFirstDayOfWeek = false, 
  onDayPress,
  selectedDate,
  wateringDays,
  isTestData = false
}) => {
  // Get current week dates
  const currentWeek = useMemo(() => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Calculate the start of the week
    let startOfWeek: Date;
    if (mondayFirstDayOfWeek) {
      // If Monday is first day, find the most recent Monday
      const daysSinceMonday = currentDay === 0 ? 6 : currentDay - 1; // Sunday becomes 6 days since Monday
      startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - daysSinceMonday);
    } else {
      // If Sunday is first day, find the most recent Sunday
      const daysSinceSunday = currentDay;
      startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - daysSinceSunday);
    }
    
    // Generate the 7 days of the week
    const weekDates: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDates.push(date);
    }
    

    
    return weekDates;
  }, [mondayFirstDayOfWeek]);

  // Day labels based on Monday as first day setting
  const dayLabels = useMemo(() => {
    if (mondayFirstDayOfWeek) {
      return ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    } else {
      return ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    }
  }, [mondayFirstDayOfWeek]);

  // Check if a date is today
  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Generate date key for watering days lookup
  const generateDateKey = (date: Date): string => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Add 1 to match dateService format
    const day = date.getDate();
    return `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;
  };

  // Check if a date has watering tasks and if any are late
  const getWateringTaskStatus = (date: Date): { hasTasks: boolean; hasLateTasks: boolean; hasOnTimeTasks: boolean } => {
    if (!wateringDays) return { hasTasks: false, hasLateTasks: false, hasOnTimeTasks: false };
    const dateKey = generateDateKey(date);
    const wateringDay = wateringDays.get(dateKey);
    
    if (!wateringDay || wateringDay.plants.length === 0) {
      return { hasTasks: false, hasLateTasks: false, hasOnTimeTasks: false };
    }
    
    const hasLateTasks = wateringDay.plants.some(plant => plant.isLate);
    const hasOnTimeTasks = wateringDay.plants.some(plant => !plant.isLate);
    
    return { 
      hasTasks: true, 
      hasLateTasks,
      hasOnTimeTasks
    };
  };

  // Check if a date is selected
  const isDateSelected = (date: Date): boolean => {
    if (!selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const handleDayPress = (date: Date) => {
    onDayPress?.(date);
  };

  return (
    <View className="bg-white rounded-3xl p-4 shadow-sm shadow-black/5">
      {/* Test data indicator */}
      {isTestData && (
        <View className="mb-2">
          <Text className="text-xs text-[#666666] text-center italic">
            Showing sample watering schedule
          </Text>
        </View>
      )}
      
      {/* Day labels row */}
      <View className="flex-row justify-between mb-2">
        {dayLabels.map((label, index) => (
          <View key={index} className="w-10 h-10 rounded-full items-center justify-center">
            <Text className="text-sm font-medium text-[#666666]">{label}</Text>
          </View>
        ))}
      </View>
      
      {/* Date numbers row */}
      <View className="flex-row justify-between">
        {currentWeek.map((date, index) => {
          const isTodayDate = isToday(date);
          const isSelected = isDateSelected(date);
          const { hasTasks, hasLateTasks, hasOnTimeTasks } = getWateringTaskStatus(date);
          
          return (
            <View key={index} className="items-center">
              <TouchableOpacity
                onPress={() => handleDayPress(date)}
                className={`w-10 h-10 rounded-full items-center justify-center ${
                  isSelected ? 'bg-[#4F772D]' : isTodayDate ? 'bg-[#90A955]' : ''
                }`}
              >
                <Text 
                  className={`text-sm font-medium ${
                    isSelected ? 'text-white' : 
                    isTodayDate ? 'text-white' : 
                    'text-[#2F2F2F]'
                  }`}
                >
                  {date.getDate()}
                </Text>
              </TouchableOpacity>
              {/* Watering task indicators */}
              {hasTasks && (
                <View className="flex-row gap-1 mt-1">
                  {hasLateTasks && (
                    <View className="w-2 h-2 bg-[#E53935] rounded-full" />
                  )}
                  {hasOnTimeTasks && (
                    <View className="w-2 h-2 bg-[#4F772D] rounded-full" />
                  )}
                </View>
              )}
              {/* Color coding: Red = Late watering, Green = On-time watering */}
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default WeekCalendar;
