import { View, Text, Image, ImageSourcePropType, TouchableOpacity } from 'react-native'
import React from 'react'
import { DatabasePlantType } from '@/interfaces/interfaces'
import { Link } from 'expo-router'


const PlantCard = ({plantId, imageUrl, nickname}: DatabasePlantType) => {

    return (
        <Link 
            href={`/plants/${plantId}`}
            asChild  
        >
            <TouchableOpacity className='mr-1 flex justify-start items-start shadow-md shadow-secondary-medium
                bg-background-surface rounded-2xl h-52'>
                <Image 
                    source={{uri: imageUrl}}
                    className='w-32 h-32 rounded-xl border border-accent'
                    resizeMode="cover"
                    style={{ width: 128, height: 128 }} // Explicit dimensions as fallback
                    onError={(e) => {
                        console.error('Image loading error:', e.nativeEvent.error);
                    }}
                />
                <Text className='text-3xl text-text-primary'>{nickname}</Text>
            </TouchableOpacity>
        </Link>
    )
}

export default PlantCard