import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { usePlantInformation } from '@/interfaces/plantInformation';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '@/constants/colors';
import PlantCareInfoComponent from '@/components/PlantCareInfoComponent';
import { createNewDatabasePlant } from '@/lib/appwrite';
import { useGlobalContext } from '@/lib/globalProvider';
import { DatabasePlantType } from '@/interfaces/interfaces';

const PlantDetails = () => {
  const { id } = useLocalSearchParams();
  const { isLoggedIn, user: contextUser, refetch} = useGlobalContext();
  const identifiedPlant = usePlantInformation((state) => state.identifiedPlant);
  
  if(!identifiedPlant || !identifiedPlant.plant) {
    return (
      <SafeAreaView>
        <Text className='text-danger text-3xl'>Sorry! Plant not found</Text>
      </SafeAreaView>
    );
  }

  const handleResetIdentification = () => {
    usePlantInformation.getState().clearIdentifiedPlant(); // Correct - this calls the function
    router.replace('/(root)/(tabs)/identify');
    refetch;
  }

  const handleAddPlant = () => {
    if (!contextUser) return;

    createNewDatabasePlant(contextUser, identifiedPlant.plant, identifiedPlant.plant.imageUri)
    router.replace('/(root)/(tabs)')
  }

  const { scientificName, commonNames, confidence, careInfo } = identifiedPlant.plant;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <ScrollView className="flex-1">
        <View className='w-screen flex justify-center items-center mx-3 mt-5'>
          <Text className='text-3xl text-secondary-medium'>{scientificName}</Text>
        </View>
        <PlantCareInfoComponent plant={identifiedPlant.plant} />
        <TouchableOpacity 
          className="bg-secondary-deep p-4 mt-3 rounded-xl"
          onPress={handleAddPlant}
        >
          <Text className="text-text-primary text-center">
            Add this plant to your Garden
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className="bg-primary-deep p-4 mt-3 rounded-xl"
          onPress={handleResetIdentification}
        >
          <Text className="text-text-primary text-center">
            Identify another plant
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

export default PlantDetails