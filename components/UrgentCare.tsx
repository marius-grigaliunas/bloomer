import { View, Text } from 'react-native'
import React from 'react'

interface UrgentCareProps {
    plantsThatNeedCare : number;
}

const UrgentCare = ({plantsThatNeedCare}: UrgentCareProps) => {
  
  
    return plantsThatNeedCare === 0 ? (
        <></>
    ) : (
        <View className='bg-background-surface h-80'>
            <View className='ml-4 h-fit flex justify-center items-center'>
                <Text className='text-3xl text-red-600'>You should take care of these today</Text>
            </View>
        </View>
    )
}

export default UrgentCare