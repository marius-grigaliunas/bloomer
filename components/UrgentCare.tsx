import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import PlantCard, { PlantCardProps } from './PlantCard';

interface UrgentCareProps {
    plantsThatNeedCare : PlantCardProps[];
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

export default UrgentCare

















