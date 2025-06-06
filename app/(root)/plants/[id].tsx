import { View, Text, ScrollView, TouchableOpacity, Alert, Dimensions, Image, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router, useLocalSearchParams, useNavigation } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '@/constants/colors';

import { useGlobalContext } from '@/lib/globalProvider';
import LoadingScreen from '@/components/LoadingScreen';
import { DatabasePlantType, PlantCareInfo } from '../../../interfaces/interfaces';
import PlantCareInfoComponent from '@/components/PlantCareInfoComponent';
import { usePlantStore } from '@/interfaces/plantStore';
import PlantHeader from '@/components/PlantHeader';
import RenamePlantModal from '@/components/RenamePlantModal';
const { width, height } = Dimensions.get('window');

type PlantDetailsParams = {
  id: string;
};

const PlantDetails = () => {
  const { id } = useLocalSearchParams<PlantDetailsParams>();
  const { isLoggedIn, user: contextUser, refetch} = useGlobalContext();
  const [ loading, setLoading] = useState(false);

  const navigation = useNavigation();
  const { plants, allPlantIds, isLoading, error,
     fetchAllUserPlants, getPlantById, updatePlant, deletePlant, markAsWatered
     } = usePlantStore();

  const [ modalVisible, setModalVisible ] = useState(false);

  const plant = getPlantById(id);
  if(!plant) return <LoadingScreen />

  const deletePlantButton = async () => {
    await deletePlant(id);
    router.back();
  };

  const handleShowModal = () => {
    setModalVisible(true);
  }

  const handleCloseModal = () => {
    setModalVisible(false);
  }

  // I was thinking if it wouldn't be better to have a universal function, 
  // where all data is updated.
  // Then we have a more robust way to introduce potential new features also.
  // No, probably will need to have a helper function that the feature functions would call
  // It still adds robustness to the code.
  const editPlant = async (plantToUpdate: DatabasePlantType, NewPlant: DatabasePlantType) => {
    updatePlant(NewPlant);
  };

  const handleRenamePlant = async (name: string) => {
    const newPlant = plant;
    newPlant.nickname = name;
    handleCloseModal();
    
    await editPlant(plant, newPlant);
  };

  const markPlantAsWatered = () => {};

  useEffect (() => {
  }, [])

  return (
    <SafeAreaView style={{ width: width,flex: 1, backgroundColor: colors.background.primary }}>
      <ScrollView className="w-screen flex-1">
        <TouchableOpacity
          onPress={() => router.back()}
          className='flex-1'
        >
          <View className='bg-danger h-14 w-32 flex justify-center items-center rounded-2xl mb-10'>
            <Text className='text-3xl text-text-primary'>Back</Text>
          </View>
        </TouchableOpacity>
        <PlantHeader
          scientificName={plant?.scientificName}
          commonNames={plant?.commonNames ?? []}
          imageUri={plant?.imageUrl ?? "Failed to load image URL"}
          nickname={plant?.nickname}
        />
        <Text className='text-4xl text-danger'>Plant Details</Text>
        <View>
          <Button 
            title='Delete Plant'
            onPress={deletePlantButton}
          />
          <Button
            title='Rename Plant'
            onPress={handleShowModal}
          />
          <Button
            title='Mark as watered'
            onPress={markPlantAsWatered}
          />
        </View>
        <PlantCareInfoComponent plant={plant as DatabasePlantType} />
        <View className="h-72 bg-background-primary rounded-2xl">
        </View>
      </ScrollView>

      <RenamePlantModal 
        visible={modalVisible}
        onClose={handleCloseModal}
        onSave={handleRenamePlant}
        plantName={plant.nickname}
      />
    </SafeAreaView>
  )
}

export default PlantDetails