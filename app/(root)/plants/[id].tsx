import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import { usePlantInformation } from '@/interfaces/plantInformation';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '@/constants/colors';
import PlantCareInfoComponent from '@/components/PlantCareInfoComponent';

const PlantDetails = () => {
  const { id } = useLocalSearchParams();
  const identifiedPlant = usePlantInformation((state) => state.identifiedPlant);
  
  if(!identifiedPlant) {
    return (
      <SafeAreaView>
        <Text className='text-danger text-3xl'>Sorry! Plant not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <ScrollView className="flex-1 p-4">
        <PlantCareInfoComponent plant={identifiedPlant.plant} />
      </ScrollView>
    </SafeAreaView>
  )
}

export default PlantDetails