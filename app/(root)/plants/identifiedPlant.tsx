import { View, Text, ScrollView, TouchableOpacity, Alert, Dimensions, Image } from 'react-native'
import React, { useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { usePlantInformation } from '@/interfaces/plantInformation';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '@/constants/colors';
import PlantCareInfoComponent from '@/components/PlantCareInfoComponent';
import { createNewDatabasePlant, uploadPlantPicture } from '@/lib/appwrite';
import { useGlobalContext } from '@/lib/globalProvider';
import { DatabasePlantType } from '@/interfaces/interfaces';
import { ID } from 'react-native-appwrite';
import AddPlantModal, { PlantFormData } from '@/components/AddPlantModal';
import LoadingScreen from '@/components/LoadingScreen';
import PlantHeader from '@/components/PlantHeader';
const { width, height } = Dimensions.get('window');

const IdentifiedPlant = () => {
  const { id } = useLocalSearchParams();
  const { isLoggedIn, user: contextUser, refetch} = useGlobalContext();
  const identifiedPlant = usePlantInformation((state) => state.identifiedPlant);
  
  const [ loading, setLoading] = useState(false);
  const [ modalVisible, setModalVisible ] = useState(false);

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

  const handleShowModal = () => {
    setModalVisible(true);
  }

  const handleCloseModal = () => {
    setModalVisible(false);
  }

  const calculateNextWatering = (lastWatered: Date, wateringFrequency: number) => {
    if(wateringFrequency === 0) {
      return undefined;
    }

    const today = new Date();
    const nextDate = new Date(lastWatered);
    nextDate.setDate(lastWatered.getDate() + wateringFrequency);

    // If the calculated date is before or equal to today, return today
    if (nextDate <= today) {
      return today;
    }

    return nextDate;
  }

  const handleAddPlant = async (nickname: string, lastWatered: Date, dateAdded: Date) => {
    if (!contextUser) return;

    const plantId = ID.unique();
    const plantImage = await uploadPlantPicture(identifiedPlant.plant.imageUri, plantId);
    const wateringHistory : Date[] = [];

    wateringHistory.push(lastWatered);

    const plantToAdd:DatabasePlantType = {
      plantId: plantId,
      ownerId: contextUser.$id,
      nickname: nickname,
      scientificName: identifiedPlant.plant.scientificName,
      commonNames: identifiedPlant.plant.commonNames,
      imageUrl: plantImage?.toString(),
      //
      wateringFrequency: identifiedPlant.plant.careInfo?.wateringFrequency ?? 0,
      wateringAmount: identifiedPlant.plant.careInfo?.wateringAmount ?? 0,
      lastWatered: lastWatered,
      nextWateringDate: calculateNextWatering(lastWatered, identifiedPlant.plant.careInfo?.wateringFrequency ?? 0),
      lightRequirements: identifiedPlant.plant.careInfo?.lightRequirements ?? "medium",
      soilPreferences: identifiedPlant.plant.careInfo?.soilPreferences ?? "",
      humidity: identifiedPlant.plant.careInfo?.humidity ?? "medium",
      minTemperature: identifiedPlant.plant.careInfo?.minTemperature ?? 15,
      maxTemperature: identifiedPlant.plant.careInfo?.maxTemperature ?? 40,
      //
      dateAdded: dateAdded,
      wateringHistory: wateringHistory,
      //
      commonIssues: identifiedPlant.plant.careInfo?.commonIssues,
      notes: identifiedPlant.plant.careInfo?.specialNotes,
      careInstructions: identifiedPlant.plant.careInfo?.careInstructions,
    }

    try {
      setLoading(true);
      handleCloseModal();

      const result = await createNewDatabasePlant(plantToAdd);
      if(result) {
        await refetch();
        router.replace('/(root)/(tabs)')
      } else {
        Alert.alert("Error", "Failed to add plant");
      }
    } catch (error) {
      console.error("Failed to add the plant to the collection:", error);
      Alert.alert("Error", "Failed to add plant");
    } finally {
      

    }
  }

  const handleSavePlant = async (plantData: PlantFormData) => {

    await handleAddPlant(plantData.nickname, plantData.lastWatered, plantData.dateAdded);
  }

  const { scientificName, commonNames, confidence, imageUri } = identifiedPlant.plant;

  if(loading) return <LoadingScreen/>

  return (
    <SafeAreaView style={{ width: width,flex: 1, backgroundColor: colors.background.primary }}>
      <ScrollView className="w-screen flex-1">
        <PlantHeader
          scientificName={scientificName}
          commonNames={commonNames}
          imageUri={imageUri}
          confidence={confidence}
        />
        <PlantCareInfoComponent plant={identifiedPlant.plant} />
        <TouchableOpacity 
          className="bg-secondary-deep p-4 mt-3 rounded-xl"
          onPress={handleShowModal}
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

      <AddPlantModal
        visible={modalVisible}
        onClose={handleCloseModal}
        onSave={handleSavePlant}
        plantName={commonNames[0]}
      />
    </SafeAreaView>
  )
}

export default IdentifiedPlant