import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import PlantCard from './PlantCard'
import colors from '@/constants/colors';
import { icons } from '@/constants/icons';
import { router } from 'expo-router';
import { DatabasePlantType } from '@/interfaces/interfaces';

interface MyPlantsProps {
    myPlants: Record<string, DatabasePlantType>;
}

const MyPlants = ({myPlants}: MyPlantsProps) => {
    
    const handleRoutingToIdentify = () => {
        router.push('/(root)/(tabs)/identify');
    }
    
    return (
        <View className='bg-background-surface h-64 rounded-2xl'>
            <View className='flex justify-center items-center rounded-xl bg-primary-medium '>
                <Text className='text-3xl text-text-primary'>My Plants</Text>
            </View>
            {Object.keys(myPlants).length === 0 ? (
                <View className='flex justify-center h-full w-full'>
                    <Text className='text-3xl text-text-secondary text-center'>
                        Looks like you don't have any plants
                    </Text>
                    <Text className='text-2xl text-text-secondary text-center'>
                        you can identify them and add them to your garden! 
                    </Text>
                    <TouchableOpacity 
                        className='flex-row justify-center items-center mt-5'
                        onPress={handleRoutingToIdentify}>
                        <Image source={icons.search} tintColor={colors.secondary.deep} className='size-7'/>
                        <Text className='text-2xl text-secondary-deep'>Identify a plant</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <ScrollView horizontal={true} className='flex mt-2'>
                {   Object.values(myPlants).map((plant) => (
                    <PlantCard
                        key={plant.plantId + "key"}
                        {...plant}                            
                    />
                ))}
                </ScrollView>
            )}
        </View>
    )
}

export default MyPlants