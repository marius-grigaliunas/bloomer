import { View, Text, Image, ImageSourcePropType } from 'react-native'
import React from 'react'
import { DatabasePlantType } from '@/interfaces/interfaces'


const PlantCard = ({imageUrl, nickname}: DatabasePlantType) => {

    return (
        <View className='mr-1 flex justify-start items-start shadow-md shadow-secondary-medium
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
        </View>
    )
}

export default PlantCard