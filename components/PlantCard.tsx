import { View, Text, Image, ImageSourcePropType, TouchableOpacity } from 'react-native'
import React from 'react'
import { DatabasePlantType } from '@/interfaces/interfaces'
import { Link, usePathname } from 'expo-router'

interface PlantCardProps extends DatabasePlantType {
  from?: string;
}

const PlantCard = ({ plantId, imageUrl, nickname, from }: PlantCardProps) => {
    console.log('Image URL type:', typeof imageUrl, 'Value:', imageUrl);
    const pathname = usePathname();
    
    // Determine the current tab from pathname if 'from' is not provided
    const currentTab = from || (() => {
        if (pathname.includes('/care')) return 'care';
        if (pathname.includes('/identify')) return 'identify';
        if (pathname.includes('/profile')) return 'profile';
        return 'index';
    })();

    const getImageSource = () => {
        // If imageUrl is undefined or null, return a placeholder
        if (!imageUrl) {
            return { uri: 'https://via.placeholder.com/400' }; // Or your placeholder image
        }

        // If it's already a string URL, use it directly
        if (typeof imageUrl === 'string') {
            return { uri: imageUrl };
        }

        // If it's an object with toString method, convert it
        if (typeof imageUrl === 'object' && imageUrl !== null && typeof (imageUrl as { toString: () => string }).toString === 'function') {
            const urlString = (imageUrl as { toString: () => string }).toString();
            console.log('Converted URL:', urlString);
            return { uri: urlString };
        }

        // Fallback
        console.error('Invalid image URL format:', imageUrl);
        return { uri: 'https://via.placeholder.com/400' }; // Or your placeholder image
    };

    return (
        <Link 
            href={`/plants/${plantId}?from=${currentTab}`}
            asChild  
        >
            <TouchableOpacity className='mr-1 flex justify-start items-start shadow-md shadow-secondary-medium
                bg-background-surface rounded-2xl h-52'>
                <Image 
                    source={getImageSource()}
                    className='w-32 h-32 rounded-xl border border-accent'
                    resizeMode="cover"
                    style={{ width: 128, height: 128 }}
                    onError={(e) => {
                        console.error('Image loading error:', e.nativeEvent.error);
                        console.error('Failed URL:', imageUrl);
                    }}
                />
                <Text className='text-3xl text-text-primary'>{nickname}</Text>
            </TouchableOpacity>
        </Link>
    );
};

export default PlantCard