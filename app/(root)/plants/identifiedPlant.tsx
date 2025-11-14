import { View, Text, ScrollView, TouchableOpacity, Alert, Dimensions, Image } from 'react-native'
import React, { useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { usePlantInformation } from '@/interfaces/plantInformation';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import PlantCareInfoComponent from '@/components/PlantCareInfoComponent';
import { createNewDatabasePlant, uploadPlantPicture } from '@/lib/appwrite';
import { useGlobalContext } from '@/lib/globalProvider';
import { DatabasePlantType } from '@/interfaces/interfaces';
import { ID } from 'react-native-appwrite';
import AddPlantModal, { PlantFormData } from '@/components/AddPlantModal';
import LoadingScreen from '@/components/LoadingScreen';
import PlantHeader from '@/components/PlantHeader';
import { usePlantStore } from '@/interfaces/plantStore';
import { translate } from '@/lib/i18n/config';

const { width, height } = Dimensions.get('window');

const IdentifiedPlant = () => {
  const { id } = useLocalSearchParams();
  const { isLoggedIn, user: contextUser, refetch} = useGlobalContext();
  const identifiedPlant = usePlantInformation((state) => state.identifiedPlant);
  const { addPlant } = usePlantStore();
  
  const [ loading, setLoading] = useState(false);
  const [ modalVisible, setModalVisible ] = useState(false);

  if(!identifiedPlant || !identifiedPlant.plant) {
    return (
      <SafeAreaView className="bg-background-primary flex-1">
        <View className="flex-1 items-center justify-center px-4">
          <View className="bg-white rounded-3xl p-6 shadow-sm shadow-black/5">
            <View className="items-center">
              <Ionicons name="warning" size={48} color="#E53935" />
              <Text className="text-text-primary text-xl font-semibold mt-4 text-center">
                {translate('identifiedPlant.notFoundTitle')}
              </Text>
              <Text className="text-text-secondary text-base mt-2 text-center">
                {translate('identifiedPlant.notFoundDescription')}
              </Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const handleResetIdentification = () => {
    usePlantInformation.getState().clearIdentifiedPlant();
    router.replace('/(root)/(tabs)/identify');
    refetch;
  }

  const handleShowModal = () => {
    // Only allow adding plant if identification was successful
    if (isIdentificationSuccessful) {
      setModalVisible(true);
    }
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

    try {
      setLoading(true);

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
        wateringFrequency: identifiedPlant.plant.careInfo?.wateringFrequency ?? 7,
        wateringAmountMetric: identifiedPlant.plant.careInfo?.wateringAmountMetric ?? 250,
        wateringAmountImperial: identifiedPlant.plant.careInfo?.wateringAmountImperial ?? 8.5,
        lastWatered: lastWatered,
        nextWateringDate: calculateNextWatering(lastWatered, identifiedPlant.plant.careInfo?.wateringFrequency ?? 7),
        lightRequirements: identifiedPlant.plant.careInfo?.lightRequirements ?? "medium",
        soilPreferences: identifiedPlant.plant.careInfo?.soilPreferences ?? "Well-draining potting mix",
        humidity: identifiedPlant.plant.careInfo?.humidity ?? "medium",
        minTemperatureCelsius: identifiedPlant.plant.careInfo?.minTemperatureCelsius ?? 15,
        maxTemperatureCelsius: identifiedPlant.plant.careInfo?.maxTemperatureCelsius ?? 30,
        minTemperatureFahrenheit: identifiedPlant.plant.careInfo?.minTemperatureFahrenheit ?? 59,
        maxTemperatureFahrenheit: identifiedPlant.plant.careInfo?.maxTemperatureFahrenheit ?? 86,
        //
        dateAdded: dateAdded,
        wateringHistory: wateringHistory,
        //
        commonIssues: identifiedPlant.plant.careInfo?.commonIssues ?? [],
        notes: identifiedPlant.plant.careInfo?.specialNotes ?? [],
        careInstructions: identifiedPlant.plant.careInfo?.careInstructions ?? [],
      }

      const result = await createNewDatabasePlant(plantToAdd);
      if(result) {
        // Add plant to local store instead of refetching
        addPlant(plantToAdd);
        router.replace('/(root)/(tabs)')
      } else {
        Alert.alert("Error", "Failed to add plant");
      }
    } catch (error) {
      console.error("Failed to add the plant to the collection:", error);
      Alert.alert("Error", "Failed to add plant");
    } finally {
      setLoading(false)
    }
  }

  const handleSavePlant = async (plantData: PlantFormData) => {
    await handleAddPlant(plantData.nickname, plantData.lastWatered, plantData.dateAdded);
  }

  const { scientificName, commonNames, confidence, imageUri } = identifiedPlant.plant;

  // Check if identification was successful based on confidence
  const isIdentificationSuccessful = confidence && confidence > 0.01;
  const confidencePercentage = Math.round((confidence || 0) * 100);

  if(loading) return <LoadingScreen/>

  return (
    <SafeAreaView className="bg-background-primary flex-1">
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View className="px-4 pt-4 pb-6">
          <View className="flex-row items-center justify-between mb-4">
            <TouchableOpacity
              onPress={() => router.back()}
              className="bg-white p-3 rounded-2xl shadow-sm shadow-black/5"
            >
              <Ionicons name="arrow-back" size={24} color="#4F772D" />
            </TouchableOpacity>
            <View className="bg-white p-3 rounded-2xl shadow-sm shadow-black/5">
              <Ionicons name="leaf" size={24} color="#4F772D" />
            </View>
          </View>
        </View>

        {/* Plant Header */}
        <PlantHeader
          scientificName={scientificName}
          commonNames={commonNames}
          imageUri={imageUri}
          confidence={confidence}
        />

        {/* Identification Status Card */}
        <View className="mx-4 mb-6">
          {isIdentificationSuccessful ? (
            <View className="bg-success/10 rounded-3xl p-4 shadow-sm shadow-black/5">
              <View className="flex-row items-center">
                <Ionicons name="checkmark-circle" size={24} color="#2E7D32" />
                <Text className="text-success text-lg font-semibold ml-2">
                  {translate('identifiedPlant.statusSuccessTitle')}
                </Text>
              </View>
              <Text className="text-text-secondary text-sm mt-2">
                {translate('identifiedPlant.statusSuccessDescription').replace('{confidence}', confidencePercentage.toString())}
              </Text>
            </View>
          ) : (
            <View className="bg-warning/10 rounded-3xl p-4 shadow-sm shadow-black/5">
              <View className="flex-row items-center">
                <Ionicons name="warning" size={24} color="#FF9800" />
                <Text className="text-warning text-lg font-semibold ml-2">
                  {translate('identifiedPlant.statusUncertainTitle')}
                </Text>
              </View>
              <Text className="text-text-secondary text-sm mt-2">
                {translate('identifiedPlant.statusUncertainDescription').replace('{confidence}', confidencePercentage.toString())}
              </Text>
            </View>
          )}
        </View>

        {/* Plant Care Information */}
        <View className="mx-4 mb-6">
          <Text className="text-lg font-semibold text-text-primary mb-3">
            {translate('identifiedPlant.careInformationTitle')}
          </Text>
          {identifiedPlant.plant.careInfo ? (
            <PlantCareInfoComponent plant={identifiedPlant.plant} />
          ) : (
            <View className="bg-white rounded-3xl p-6 shadow-sm shadow-black/5">
              <View className="items-center">
                <Ionicons name="information-circle-outline" size={48} color="#90A955" />
                <Text className="text-text-primary text-lg font-semibold mt-4 text-center">
                  {translate('identifiedPlant.careUnavailableTitle')}
                </Text>
                <Text className="text-text-secondary text-base mt-2 text-center">
                  {translate('identifiedPlant.careUnavailableDescription')}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View className="mx-4 mb-6">
          <Text className="text-lg font-semibold text-text-primary mb-3">
            {translate('identifiedPlant.actionsTitle')}
          </Text>
          <View className="space-y-4">
            <TouchableOpacity 
              onPress={handleShowModal}
              disabled={!isIdentificationSuccessful}
              className={`rounded-3xl p-4 items-center shadow-sm shadow-black/5 ${
                isIdentificationSuccessful 
                  ? 'bg-primary-medium' 
                  : 'bg-gray-400'
              }`}
            >
              <Ionicons 
                name="add-circle" 
                size={24} 
                color={isIdentificationSuccessful ? "white" : "#9CA3AF"} 
              />
              <Text className={`font-medium mt-2 text-center text-lg ${
                isIdentificationSuccessful ? 'text-white' : 'text-gray-500'
              }`}>
                {isIdentificationSuccessful 
                  ? translate('identifiedPlant.addButton') 
                  : translate('identifiedPlant.addButtonUnavailable')}
              </Text>
            </TouchableOpacity>
            
            {!isIdentificationSuccessful && (
              <View className="bg-warning/10 rounded-3xl p-4 border border-warning/20">
                <View className="flex-row items-center mb-2">
                  <Ionicons name="information-circle" size={20} color="#FF9800" />
                  <Text className="text-warning font-medium ml-2">
                    {translate('identifiedPlant.cannotAddTitle')}
                  </Text>
                </View>
                <Text className="text-text-secondary text-sm">
                  {translate('identifiedPlant.cannotAddDescription')}
                </Text>
              </View>
            )}
            
            <TouchableOpacity 
              onPress={handleResetIdentification}
              className="bg-white rounded-3xl p-4 items-center shadow-sm shadow-black/5 border border-primary-medium/20 mt-2"
            >
              <Ionicons name="camera" size={24} color="#4F772D" />
              <Text className="text-primary-medium font-medium mt-2 text-center text-lg">
                {translate('identifiedPlant.identifyAnother')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="h-20" />
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