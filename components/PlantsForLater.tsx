import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import PlantCard, { PlantCardProps } from './PlantCard'

interface PlantsForLaterProps {
    plantsForLater: PlantCardProps[];
}

const PlantsForLater = ({plantsForLater}: PlantsForLaterProps) => {
    
    
    return (
        <View className='bg-background-surface h-64 rounded-2xl'>
            <View className='flex justify-center items-center rounded-xl bg-primary-medium '>
                <Text className='text-3xl text-text-primary'>Don't forget about these tomorrow</Text>
            </View>
            <ScrollView horizontal={true} className='flex mt-2'>
                    {plantsForLater.map((plant) => (
                        <PlantCard
                            key={plant.$id}
                            $id={plant.$id}
                            photo={plant.photo}
                            name={plant.name}                            
                        />
                    ))}
            </ScrollView>
        </View>
    )
}

export default PlantsForLater