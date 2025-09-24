import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { memo, useMemo, useCallback } from 'react'
import { DatabasePlantType } from '@/interfaces/interfaces'
import { Link, usePathname } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import colors from '@/constants/colors'

interface TaskCardProps {
  plant: DatabasePlantType;
  from?: string;
  selectedDate?: Date | null;
  selectedMonth?: number;
  selectedYear?: number;
  status: 'pending' | 'completed' | 'urgent';
}

const TaskCard = memo(({ plant, from, selectedDate, selectedMonth, selectedYear, status }: TaskCardProps) => {
    const pathname = usePathname();
    
    // Memoize the current tab calculation
    const currentTab = useMemo(() => {
        return from || (() => {
            if (pathname.includes('/care')) return 'care';
            if (pathname.includes('/identify')) return 'identify';
            if (pathname.includes('/profile')) return 'profile';
            return 'index';
        })();
    }, [from, pathname]);

    // Memoize image source calculation
    const imageSource = useMemo(() => {
        if (!plant.imageUrl) {
            return { uri: 'https://via.placeholder.com/400' };
        }
        if (typeof plant.imageUrl === 'string') {
            return { uri: plant.imageUrl };
        }
        if (typeof plant.imageUrl === 'object' && plant.imageUrl !== null && typeof (plant.imageUrl as { toString: () => string }).toString === 'function') {
            const urlString = (plant.imageUrl as { toString: () => string }).toString();
            return { uri: urlString };
        }
        return { uri: 'https://via.placeholder.com/400' };
    }, [plant.imageUrl]);

    // Memoize navigation URL
    const navigationUrl = useMemo(() => {
        let url = `/plants/${plant.plantId}?from=${currentTab}`;
        if (selectedDate) {
            url += `&selectedDate=${selectedDate.toISOString()}`;
        }
        if (selectedMonth !== undefined) {
            url += `&selectedMonth=${selectedMonth}`;
        }
        if (selectedYear !== undefined) {
            url += `&selectedYear=${selectedYear}`;
        }
        return url;
    }, [plant.plantId, currentTab, selectedDate, selectedMonth, selectedYear]);

    // Generate care instructions
    const careInstructions = useMemo(() => {
        const instructions = [];
        if (plant.wateringAmountMetric > 0) {
            instructions.push(`Water ${plant.wateringAmountMetric}ml`);
        }
        if (plant.lightRequirements) {
            const lightText = plant.lightRequirements === 'direct' ? 'direct light' : 
                             plant.lightRequirements === 'high' ? 'bright light' :
                             plant.lightRequirements === 'medium' ? 'indirect light' : 'low light';
            instructions.push(lightText);
        }
        return instructions.join(', ');
    }, [plant.wateringAmountMetric, plant.lightRequirements]);

    // Get water icon color based on status (same logic as DailyTask.tsx)
    const getWaterIconColor = useMemo(() => {
        switch (status) {
            case 'urgent':
                return colors.danger; // Red for urgent/late
            case 'completed':
                return colors.success; // Green for completed
            case 'pending':
            default:
                return colors.primary.medium; // Green for normal/pending
        }
    }, [status]);

    const handleImageError = useCallback((e: any) => {
        console.error('Image loading error:', e.nativeEvent.error);
    }, []);

    return (
        <Link href={navigationUrl as any} asChild>
            <TouchableOpacity className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100">
                <View className="flex-row items-center">
                    <View style={{
                        width: 64,
                        height: 64,
                        borderRadius: 8,
                        marginRight: 16,
                        overflow: 'hidden',
                    }}>
                        <Image 
                            source={imageSource}
                            style={{
                                width: '100%',
                                height: '100%',
                            }}
                            resizeMode="cover"
                            onError={handleImageError}
                        />
                    </View>
                    <View className="flex-1">
                        <Text className="text-lg font-semibold text-gray-900 mb-1">
                            {plant.nickname}
                        </Text>
                        <Text className="text-sm text-gray-600">
                            {careInstructions}
                        </Text>
                    </View>
                    <Ionicons name="water" size={20} color={getWaterIconColor} />
                </View>
            </TouchableOpacity>
        </Link>
    );
});

export default TaskCard
