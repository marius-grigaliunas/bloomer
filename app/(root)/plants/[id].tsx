import { View, Text, ScrollView, TouchableOpacity, Alert, Dimensions, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router, useLocalSearchParams, useNavigation } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '@/constants/colors';

import { useGlobalContext } from '@/lib/globalProvider';
import LoadingScreen from '@/components/LoadingScreen';
import { DatabasePlantType, PlantCareInfo } from '../../../interfaces/interfaces';
import PlantCareInfoComponent from '@/components/PlantCareInfoComponent';
import { usePlantStore } from '@/interfaces/plantStore';
const { width, height } = Dimensions.get('window');

type PlantDetailsParams = {
  id: string;
};

const PlantDetails = () => {
  const { id } = useLocalSearchParams<PlantDetailsParams>();
  const { isLoggedIn, user: contextUser, refetch} = useGlobalContext();
  const [ loading, setLoading] = useState(false);

  const navigation = useNavigation();
  const { plants, allPlantIds, isLoading, error, fetchAllUserPlants, getPlantById } = usePlantStore();
  
  const plant = getPlantById(id);
  useEffect (() => {
  }, [])

  return (
    <SafeAreaView style={{ width: width,flex: 1, backgroundColor: colors.background.primary }}>
      <ScrollView className="w-screen flex-1">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className='flex-1'
        >
          <View className='bg-danger h-14 w-32 flex justify-center items-center rounded-2xl mb-10'>
            <Text className='text-3xl text-text-primary'>Back</Text>
          </View>
        </TouchableOpacity>
        <Text className='text-4xl text-danger'>Plant Details</Text>
        <PlantCareInfoComponent plant={plant as DatabasePlantType} />
      </ScrollView>
    </SafeAreaView>
  )
}

export default PlantDetails