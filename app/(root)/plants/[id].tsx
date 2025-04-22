import { View, Text, ScrollView, TouchableOpacity, Alert, Dimensions, Image } from 'react-native'
import React from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { usePlantInformation } from '@/interfaces/plantInformation';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '@/constants/colors';
import PlantCareInfoComponent from '@/components/PlantCareInfoComponent';
import { createNewDatabasePlant } from '@/lib/appwrite';
import { useGlobalContext } from '@/lib/globalProvider';
import { DatabasePlantType } from '@/interfaces/interfaces';
const { width, height } = Dimensions.get('window');

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

  const handleAddPlant = async () => {
    if (!contextUser) return;

    try {
      const result = await createNewDatabasePlant(contextUser, identifiedPlant.plant, identifiedPlant.plant.imageUri);
      if(result) {
        await refetch();
        router.replace('/(root)/(tabs)')
      } else {
        Alert.alert("Error", "Failed to add plant");
      }
    } catch (error) {
      console.error("Failed to add the plant to the collection:", error);
      Alert.alert("Error", "Failed to add plant");
    }
  }

  const { scientificName, commonNames, confidence, imageUri } = identifiedPlant.plant;

  return (
    <SafeAreaView style={{ width: width,flex: 1, backgroundColor: colors.background.primary }}>
      <ScrollView className="w-screen flex-1">
        <View className='w-screen flex flex-row justify-around items-center bg-background-surface py-8'>
          <View
            style={{boxShadow:`
                0 0px 5px 1px ${colors.secondary.medium},
              `, borderRadius:50,
              
            }}
          >
            <Image
              source={{ uri: imageUri }}
              style={{width: width*0.5, height: height*0.5, borderRadius:50,
                  borderColor:colors.secondary.medium, borderWidth:1,  
                  }}
              resizeMode='cover'
            />
          </View>
          <View>
            <View className="">
              <Text className="text-text-secondary text-xl">Scientific Name:</Text>
              <Text className="text-text-primary text-xl">{scientificName}</Text>
            </View>
            {commonNames && (
              <View className="mt-5">
                <Text className="text-text-secondary text-xl">Common Names:</Text>
                {
                  commonNames.map((name, index) => {
                    return (
                      <Text key={index} className="text-text-primary text-lg">{name}</Text>
                    )
                  })
                }
              </View>
            )}
          </View>
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