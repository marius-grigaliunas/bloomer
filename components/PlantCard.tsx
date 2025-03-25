import { View, Text, Image, ImageSourcePropType } from 'react-native'
import React from 'react'

export interface PlantCardProps {
    $id: string
    photo: ImageSourcePropType,
    name: string,
}

const PlantCard = ({photo, name}: PlantCardProps) => {

    return (
        <View className='mr-1 flex justify-start items-start shadow-md shadow-secondary-medium
            bg-background-surface rounded-2xl h-56'>
            <Image 
                source={photo}
                className='w-32 h-32 rounded-xl border border-accent'
                resizeMode="cover"
                style={{ width: 128, height: 128 }} // Explicit dimensions as fallback
            />
            <Text className='text-3xl text-text-primary'>{name}</Text>
        </View>
    )
}

export default PlantCard