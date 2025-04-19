import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import PlantCard from './PlantCard';
import { DatabasePlantType } from '@/interfaces/interfaces';

interface UrgentCareProps {
    plantsThatNeedCare : DatabasePlantType[];
}

const UrgentCare = ({plantsThatNeedCare}: UrgentCareProps) => {
  
  
    return plantsThatNeedCare.length === 0 ? (
        <></>
    ) : (
        <View className='bg-background-surface h-72 rounded-2xl'>
            <View className='flex justify-center items-center rounded-xl bg-primary-deep '>
                <Text className='text-3xl text-text-primary'>You should take care of these today</Text>
            </View>
            <ScrollView horizontal={true} className='flex mt-2'>
                    {plantsThatNeedCare.map((plant) => (
                        <PlantCard
                            key={plant.plantId + "key"}
                            {...plant}                            
                        />
                    ))}
            </ScrollView>
        </View>
    )
}

export default UrgentCare

















