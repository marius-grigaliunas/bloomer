import { View, Text, Image, ImageSourcePropType, TouchableOpacity } from 'react-native'
import React, { memo, useMemo, useCallback } from 'react'
import { DatabasePlantType } from '@/interfaces/interfaces'
import { Link, usePathname } from 'expo-router'

interface PlantCardProps extends DatabasePlantType {
  from?: string;
  selectedDate?: Date | null;
  selectedMonth?: number;
  selectedYear?: number;
}

const PlantCard = memo(({ plantId, imageUrl, nickname, from, selectedDate, selectedMonth, selectedYear }: PlantCardProps) => {
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

    // Memoize image source calculation to avoid recalculation on every render
    const imageSource = useMemo(() => {
        // If imageUrl is undefined or null, return a placeholder
        if (!imageUrl) {
            return { uri: 'https://via.placeholder.com/400' };
        }

        // If it's already a string URL, use it directly
        if (typeof imageUrl === 'string') {
            return { uri: imageUrl };
        }

        // If it's an object with toString method, convert it
        if (typeof imageUrl === 'object' && imageUrl !== null && typeof (imageUrl as { toString: () => string }).toString === 'function') {
            const urlString = (imageUrl as { toString: () => string }).toString();
            return { uri: urlString };
        }

        // Fallback
        console.error('Invalid image URL format:', imageUrl);
        return { uri: 'https://via.placeholder.com/400' };
    }, [imageUrl]);

    // Memoize navigation URL to prevent recalculation
    const navigationUrl = useMemo(() => {
        let url = `/plants/${plantId}?from=${currentTab}`;
        
        // Add state parameters if they exist (for care tab navigation)
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
    }, [plantId, currentTab, selectedDate, selectedMonth, selectedYear]);

    // Memoize error handler to prevent function recreation
    const handleImageError = useCallback((e: any) => {
        console.error('Image loading error:', e.nativeEvent.error);
        console.error('Failed URL:', imageUrl);
    }, [imageUrl]);

    return (
        <Link 
            href={navigationUrl as any}
            asChild  
        >
            <TouchableOpacity className='mr-1 flex justify-start items-start shadow-md shadow-secondary-medium
                bg-background-surface rounded-2xl h-52'>
                <Image 
                    source={imageSource}
                    className='w-32 h-32 rounded-xl border border-accent'
                    resizeMode="cover"
                    style={{ width: 128, height: 128 }}
                    onError={handleImageError}
                />
                <Text className='text-3xl text-text-primary'>{nickname}</Text>
            </TouchableOpacity>
        </Link>
    );
});

export default PlantCard