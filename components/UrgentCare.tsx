import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import PlantCard from './PlantCard';
import { DatabasePlantType } from '@/interfaces/interfaces';
import { calculateDaysLate } from '@/lib/services/dateService';

interface UrgentCareProps {
    plantsThatNeedCare : DatabasePlantType[];
}

const UrgentCare = ({plantsThatNeedCare}: UrgentCareProps) => {
    const getLatenessMessage = (plant: DatabasePlantType) => {
        if (!plant.lastWatered || !plant.wateringFrequency) return '';
        
        const daysLate = calculateDaysLate(new Date(plant.lastWatered), plant.wateringFrequency);
        if (daysLate > 0) {
            return `${daysLate} ${daysLate === 1 ? 'day' : 'days'} overdue`;
        }
        return '';
    };
    
    return plantsThatNeedCare.length === 0 ? (
        <></>
    ) : (
        <View className='bg-background-surface h-72 rounded-2xl'>
            <View className='flex justify-center items-center rounded-xl bg-primary-deep'>
                <Text className='text-3xl text-text-primary'>Needs Attention</Text>
            </View>
            <ScrollView horizontal={true} className='flex mt-2'>
                {plantsThatNeedCare.map((plant) => (
                    <View key={plant.plantId} className="flex">
                        <PlantCard {...plant} />
                        {getLatenessMessage(plant) && (
                            <Text className="text-danger text-center mt-1">
                                {getLatenessMessage(plant)}
                            </Text>
                        )}
                    </View>
                ))}
            </ScrollView>
        </View>
    )
}

export default UrgentCare