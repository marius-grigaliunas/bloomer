import { View, Text, ScrollView, TouchableOpacity, Alert, Dimensions, Image, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useGlobalContext } from '@/lib/globalProvider';
import LoadingScreen from '@/components/LoadingScreen';
import { DatabasePlantType } from '../../../interfaces/interfaces';
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
  const { isLoggedIn, user: contextUser } = useGlobalContext();
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
  
  const { plants, isLoading, error, getPlantById, updatePlant, deletePlant, markAsWatered } = usePlantStore();

  // Move plant retrieval into useEffect to handle async state
  const [plant, setPlant] = useState(getPlantById(id));

  useEffect(() => {
    if (!plant && !loading && !isLoading) {
      router.push('/(root)/(tabs)');
    }
  }, [plant, loading, isLoading]);

  const deletePlantButton = async () => {
    Alert.alert(
      "Delete Plant",
      "Are you sure you want to delete this plant? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              await deletePlant(id);
              setLoading(false);
              navigateBack();
            } catch (error) {
              setLoading(false);
              Alert.alert('Error', 'Failed to delete plant');
            }
          }
        }
      ]
    );
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
    // Update local plant state to reflect the new name immediately
    setPlant(newPlant);
  };

  const markPlantAsWatered = async () => {
    try {
      await markAsWatered(id);
      // Update local plant state to reflect the changes immediately
      const updatedPlant = getPlantById(id);
      if (updatedPlant) {
        setPlant(updatedPlant);
      }
      Alert.alert("Success", "Plant marked as watered!");
    } catch (error) {
      Alert.alert("Error", "Failed to mark plant as watered");
    }
  };

  if (loading || isLoading) {
    return <LoadingScreen />;
  }

  if (!plant) {
    return null;
  }

  // Calculate watering status
  const getWateringStatus = () => {
    if (!plant?.lastWatered || !plant?.wateringFrequency) {
      return { status: 'no-schedule', message: 'No watering schedule set', color: 'text-text-secondary' };
    }

    const daysLate = calculateDaysLate(new Date(plant.lastWatered), plant.wateringFrequency);
    const daysUntilNext = calculateDaysUntilNextWatering(new Date(plant.lastWatered), plant.wateringFrequency);
    
    if (daysLate > 0) {
      return { 
        status: 'overdue', 
        message: `${daysLate} ${daysLate === 1 ? 'day' : 'days'} overdue`, 
        color: 'text-danger',
        bgColor: 'bg-danger/10'
      };
    } else if (daysUntilNext > 0) {
      return { 
        status: 'upcoming', 
        message: `${daysUntilNext} ${daysUntilNext === 1 ? 'day' : 'days'} until next watering`, 
        color: 'text-primary-medium',
        bgColor: 'bg-primary-medium/10'
      };
    } else {
      return { 
        status: 'today', 
        message: 'Water today!', 
        color: 'text-accent',
        bgColor: 'bg-accent/10'
      };
    }
  };

  const wateringStatus = getWateringStatus();

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
              onPress={navigateBack}
              className="bg-white p-3 rounded-2xl shadow-sm shadow-black/5"
            >
              <Ionicons name="arrow-back" size={24} color="#4F772D" />
            </TouchableOpacity>
            <View className="flex-row space-x-2">
              <TouchableOpacity
                onPress={handleShowModal}
                className="bg-white p-3 rounded-2xl shadow-sm shadow-black/5"
              >
                <Ionicons name="create-outline" size={24} color="#4F772D" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={deletePlantButton}
                className="bg-white p-3 rounded-2xl shadow-sm shadow-black/5"
              >
                <Ionicons name="trash-outline" size={24} color="#E53935" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Plant Header */}
        <PlantHeader
          scientificName={plant?.scientificName}
          commonNames={plant?.commonNames ?? []}
          imageUri={plant?.imageUrl ?? "Failed to load image URL"}
          nickname={plant?.nickname}
        />

        {/* Watering Status Card */}
        <View className="mx-4 mb-6">
          <View className={`bg-white rounded-3xl p-4 shadow-sm shadow-black/5 ${wateringStatus.bgColor || ''}`}>
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center">
                <Ionicons 
                  name={wateringStatus.status === 'overdue' ? 'warning' : 'water'} 
                  size={24} 
                  color={wateringStatus.status === 'overdue' ? '#E53935' : '#4F772D'} 
                />
                <Text className="text-text-primary text-lg font-semibold ml-2">
                  Watering Status
                </Text>
              </View>
              <TouchableOpacity
                onPress={markPlantAsWatered}
                className="bg-blue-500 px-4 py-2 rounded-xl"
              >
                <Text className="text-white font-medium">Mark Watered</Text>
              </TouchableOpacity>
            </View>
            <Text className={`text-lg font-semibold ${wateringStatus.color}`}>
              {wateringStatus.message}
            </Text>
            {wateringStatus.status === 'overdue' && (
              <Text className="text-text-secondary text-sm mt-1">
                Your plant needs water!
              </Text>
            )}
          </View>
        </View>

        {/* Watering Schedule Info */}
        <View className="mx-4 mb-6">
          <Text className="text-lg font-semibold text-text-primary mb-3">Watering Schedule</Text>
          <View className="bg-white rounded-3xl p-4 shadow-sm shadow-black/5">
            <View className="space-y-4">
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center">
                  <Ionicons name="calendar-outline" size={20} color="#4F772D" />
                  <Text className="text-text-secondary ml-2">Last watered:</Text>
                </View>
                <Text className="text-text-primary font-medium">
                  {plant?.lastWatered ? new Date(plant.lastWatered).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  }) : 'Never watered'}
                </Text>
              </View>
              
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center">
                  <Ionicons name="time-outline" size={20} color="#4F772D" />
                  <Text className="text-text-secondary ml-2">Next watering:</Text>
                </View>
                <Text className="text-text-primary font-medium">
                  {plant?.nextWateringDate ? new Date(plant.nextWateringDate).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  }) : 'No schedule set'}
                </Text>
              </View>

              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center">
                  <Ionicons name="repeat-outline" size={20} color="#4F772D" />
                  <Text className="text-text-secondary ml-2">Frequency:</Text>
                </View>
                <Text className="text-text-primary font-medium">
                  {plant?.wateringFrequency ? `Every ${plant.wateringFrequency} days` : 'Not set'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Plant Care Information */}
        <View className="mx-4 mb-6">
          <Text className="text-lg font-semibold text-text-primary mb-3">Care Information</Text>
          <PlantCareInfoComponent plant={plant as DatabasePlantType} />
        </View>

        {/* Watering History */}
        {plant.wateringHistory && plant.wateringHistory.length > 0 && (
          <View className="mx-4 mb-6">
            <Text className="text-lg font-semibold text-text-primary mb-3">Watering History</Text>
            <View className="bg-white rounded-3xl p-4 shadow-sm shadow-black/5">
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row space-x-3">
                  {plant.wateringHistory.slice(-10).reverse().map((date, index) => (
                    <View key={index} className="bg-primary-medium/10 px-3 py-2 rounded-xl min-w-[80px]">
                      <Text className="text-primary-medium text-sm font-medium text-center">
                        {new Date(date).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short'
                        })}
                      </Text>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>
        )}

        {/* Quick Actions */}
        <View className="mx-4 mb-6">
          <Text className="text-lg font-semibold text-text-primary mb-3">Quick Actions</Text>
          
          {/* First row - Plant specific actions */}
          <View className="flex-row mb-4">
            <TouchableOpacity
              onPress={handleShowModal}
              className="flex-1 bg-white rounded-3xl p-4 items-center shadow-sm shadow-black/5 border border-primary-medium/20 mr-2"
            >
              <Ionicons name="create-outline" size={24} color="#4F772D" />
              <Text className="text-primary-medium font-medium mt-2 text-center">Rename Plant</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={markPlantAsWatered}
              className="flex-1 bg-blue-500 rounded-3xl p-4 items-center shadow-sm shadow-black/5 ml-2"
            >
              <Ionicons name="water" size={24} color="white" />
              <Text className="text-white font-medium mt-2 text-center">Mark Watered</Text>
            </TouchableOpacity>
          </View>
          
          {/* Second row - App navigation actions */}
          <View className="flex-row">
            <TouchableOpacity
              onPress={() => router.push("/(root)/(tabs)/identify")}
              className="flex-1 bg-primary-medium rounded-3xl p-4 items-center shadow-sm shadow-black/5 mr-2"
            >
              <Ionicons name="camera" size={24} color="white" />
              <Text className="text-white font-medium mt-2 text-center">Identify Plant</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/(root)/(tabs)/care")}
              className="flex-1 bg-white rounded-3xl p-4 items-center shadow-sm shadow-black/5 border border-primary-medium/20 ml-2"
            >
              <Ionicons name="calendar" size={24} color="#4F772D" />
              <Text className="text-primary-medium font-medium mt-2 text-center">View Schedule</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="h-20" />
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