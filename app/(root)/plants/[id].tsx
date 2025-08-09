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
import { calculateDaysLate, calculateDaysUntilNextWatering } from '@/lib/services/dateService';
import { useNavigationState } from '@/lib/navigationState';
const { width, height } = Dimensions.get('window');

type PlantDetailsParams = {
  id: string;
  from?: string;
  selectedDate?: string;
  selectedMonth?: string;
  selectedYear?: string;
};

const PlantDetails = () => {
  const { id, from, selectedDate, selectedMonth, selectedYear } = useLocalSearchParams<PlantDetailsParams>();
  const { isLoggedIn, user: contextUser, refetch } = useGlobalContext();
  const [ loading, setLoading] = useState(false);
  const [ modalVisible, setModalVisible ] = useState(false);
  const { setCareState } = useNavigationState();

  const navigateBack = () => {
    if (from) {
      switch (from) {
        case 'care':
          // Restore care state if we have the navigation parameters
          if (selectedDate || selectedMonth || selectedYear) {
            const careStateUpdate: any = {};
            
            if (selectedDate) {
              careStateUpdate.selectedDate = new Date(selectedDate);
            }
            if (selectedMonth) {
              careStateUpdate.selectedMonth = parseInt(selectedMonth);
            }
            if (selectedYear) {
              careStateUpdate.selectedYear = parseInt(selectedYear);
            }
            
            setCareState(careStateUpdate);
          }
          router.push('/(root)/(tabs)/care');
          break;
        case 'identify':
          router.push('/(root)/(tabs)/identify');
          break;
        case 'profile':
          router.push('/(root)/(tabs)/profile');
          break;
        default:
          router.push('/(root)/(tabs)');
      }
    } else {
      router.back();
    }
  };
  
  const { plants, allPlantIds, isLoading, error,
     fetchAllUserPlants, getPlantById, updatePlant, deletePlant, markAsWatered
  } = usePlantStore();

  // Move plant retrieval into useEffect to handle async state
  const [plant, setPlant] = useState(getPlantById(id));

  useEffect(() => {
    if (!plant && !loading && !isLoading) {
      router.push('/(root)/(tabs)');
    }
  }, [plant, loading, isLoading]);

  const deletePlantButton = async () => {
    try {
      setLoading(true);
      await deletePlant(id);
      setLoading(false);
      navigateBack();
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Failed to delete plant');
    }
  };

  const handleShowModal = () => setModalVisible(true);
  const handleCloseModal = () => setModalVisible(false);

  const editPlant = async (plantToUpdate: DatabasePlantType, NewPlant: DatabasePlantType) => {
    updatePlant(NewPlant);
  };

  const handleRenamePlant = async (name: string) => {
    if (!plant) return;
    const newPlant = {...plant, nickname: name};
    handleCloseModal();
    await editPlant(plant, newPlant);
  };

  const markPlantAsWatered = async () => {
    try {
      await markAsWatered(id);
      Alert.alert("Success", "Plant marked as watered.");
    } catch (error) {
      Alert.alert("Error watering the plant", "Failed to mark plant as watered ")
    }
  };

  if (loading || isLoading) {
    return <LoadingScreen />;
  }

  if (!plant) {
    return null;
  }

  return (
    <SafeAreaView style={{ width: width,flex: 1, backgroundColor: colors.background.primary }}>
      <ScrollView className="w-screen flex-1">
        <TouchableOpacity
          onPress={navigateBack}
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
        <View className='p-4'>
          {/* Watering Status */}
          {plant?.lastWatered && plant?.wateringFrequency && (
            <View className="mb-4 p-4 bg-background-surface rounded-xl">
              <Text className="text-accent text-xl mb-2">Watering Status</Text>
              {(() => {
                const daysLate = calculateDaysLate(new Date(plant.lastWatered), plant.wateringFrequency);
                const daysUntilNext = calculateDaysUntilNextWatering(new Date(plant.lastWatered), plant.wateringFrequency);
                
                if (daysLate > 0) {
                  return (
                    <View className="bg-danger/20 p-3 rounded-lg">
                      <Text className="text-danger text-lg font-semibold">
                        {daysLate} {daysLate === 1 ? 'day' : 'days'} overdue
                      </Text>
                      <Text className="text-text-secondary text-sm">
                        Your plant needs water!
                      </Text>
                    </View>
                  );
                } else if (daysUntilNext > 0) {
                  return (
                    <View className="bg-primary/20 p-3 rounded-lg">
                      <Text className="text-primary text-lg font-semibold">
                        {daysUntilNext} {daysUntilNext === 1 ? 'day' : 'days'} until next watering
                      </Text>
                      <Text className="text-text-secondary text-sm">
                        Your plant is doing well!
                      </Text>
                    </View>
                  );
                } else {
                  return (
                    <View className="bg-accent/20 p-3 rounded-lg">
                      <Text className="text-accent text-lg font-semibold">
                        Water today!
                      </Text>
                      <Text className="text-text-secondary text-sm">
                        Time to water your plant
                      </Text>
                    </View>
                  );
                }
              })()}
            </View>
          )}

          <View className="space-y-2">
            <Text className="text-accent text-xl">Last watered:</Text>
            <Text className="text-text-primary text-lg">
              {plant?.lastWatered ? new Date(plant.lastWatered).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              }) : 'Never watered'}
            </Text>
          </View>

          <View className="space-y-2">
            <Text className="text-accent text-xl">Next watering:</Text>
            <Text className="text-text-primary text-lg">
              {plant?.nextWateringDate ? new Date(plant.nextWateringDate).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              }) : 'No schedule set'}
            </Text>
          </View>

          {plant.wateringHistory && (
            <View className="mt-5">
              <Text className="text-accent text-xl">Watering history:</Text>
              {plant.wateringHistory.map((date, index) => (
                <Text key={index} className="text-text-primary text-lg">
                  {new Date(date).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })}
                </Text>
              ))}
            </View>
          )}
        </View>
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