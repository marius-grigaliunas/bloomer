import { View, Text } from 'react-native'
import React from 'react'
import { Plant, DatabasePlantType } from '@/interfaces/interfaces';

interface PlantComponentProps {
  plant: Plant | DatabasePlantType | null;
}

const PlantComponent: React.FC<PlantComponentProps> = ({ plant }) => {
  if (!plant) return null;

  // Helper function to get care info regardless of plant type
  const getCareInfo = (plant: Plant | DatabasePlantType) => {
    if ('careInfo' in plant) {
      return (plant as Plant).careInfo;
    }
    return plant as DatabasePlantType;
  };

  // Helper function to get special notes depending on plant type
  const getSpecialNotes = (plant: Plant | DatabasePlantType) => {
    if ('careInfo' in plant) {
      return plant.careInfo?.specialNotes;
    }
    return (plant as DatabasePlantType).notes;
  };

  const careInfo = getCareInfo(plant);
  const specialNotes = getSpecialNotes(plant);
  if (!careInfo) return null;

  return (
    <View className='rounded-xl'>
      <View className="space-y-4 flex p-4">
        <Text className="text-text-primary text-2xl font-bold">Care Instructions</Text>
        <View className="space-y-2"></View>
          <Text className="text-accent text-xl">Watering frequency:</Text>
          <Text className="text-text-primary text-lg">
            Every {careInfo.wateringFrequency} days,
            water with {careInfo.wateringAmount} ml of water.
          </Text>
        <View className="space-y-2">
          <Text className="text-accent text-xl">Light Requirements:</Text>
          <Text className="text-text-primary text-lg">{careInfo.lightRequirements}</Text>
        </View>
        <View className="space-y-2">
          <Text className="text-accent text-xl">Soil Preferences:</Text>
          <Text className="text-text-primary text-lg">{careInfo.soilPreferences}</Text>
        </View>
        <View className="space-y-2">
          <Text className="text-accent text-xl">Humidity:</Text>
          <Text className="text-text-primary text-lg">{careInfo.humidity}</Text>
        </View>
        <View className="space-y-2">
          <Text className="text-accent text-xl">Temperature minimum:</Text>
          <Text className="text-text-primary text-lg">{careInfo.minTemperature}</Text>
        </View>
        <View className="space-y-2">
          <Text className="text-accent text-xl">Temperature maximum:</Text>
          <Text className="text-text-primary text-lg">{careInfo.maxTemperature}</Text>
        </View>
        <View className="">
            {careInfo.commonIssues && (
              <View className="mt-5">
                <Text className="text-accent text-xl">Common Issues:</Text>
                {
                  careInfo.commonIssues.map((name, index) => {
                    return (
                      <Text key={index} className="text-text-primary text-lg">{name}</Text>
                    )
                  })
                }
              </View>
            )}
        </View>
        <View className="">
          {specialNotes && specialNotes.length > 0 && (
              <View className="mt-5">
                <Text className="text-accent text-xl">Special Notes:</Text>
                {
                  specialNotes.map((name, index) => {
                    return (
                      <Text key={index} className="text-text-primary text-lg">{name}</Text>
                    )
                  })
                }
              </View>
            )}
        </View>
        <View className="">
          {careInfo.careInstructions && (
              <View className="mt-5">
                <Text className="text-accent text-xl">General care instructions:</Text>
                {
                  careInfo.careInstructions.map((name, index) => {
                    return (
                      <Text key={index} className="text-text-primary text-lg">{name}</Text>
                    )
                  })
                }
              </View>
            )}
        </View>
      </View>
    </View>
  )
}

export default PlantComponent