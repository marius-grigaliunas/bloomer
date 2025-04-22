import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Plant } from '@/interfaces/interfaces';
import { usePlantInformation } from '@/interfaces/plantInformation';
import { router } from 'expo-router';

interface plantComponentProps {
  plant: Plant| null;
}

const plantComponent: React.FC<plantComponentProps> = ({ plant }) => {
  if (!plant) return null;

  const joinArrayText = (array: string[]) => {
    return array.join(", ");
  }

  return (
    <View className='rounded-xl'>
      <View className="space-y-4 flex p-4">
        <Text className="text-text-primary text-2xl font-bold">Care Instructions</Text>
        <View className="space-y-2"></View>
          <Text className="text-accent text-xl">Watering frequency:</Text>
          <Text className="text-text-primary text-lg">Every {plant.careInfo?.wateringFrequency} days</Text>
        <View className="space-y-2">
          <Text className="text-accent text-xl">Light Requirements:</Text>
          <Text className="text-text-primary text-lg">{plant.careInfo?.lightRequirements}</Text>
        </View>
        <View className="space-y-2">
          <Text className="text-accent text-xl">Soil Preferences:</Text>
          <Text className="text-text-primary text-lg">{plant.careInfo?.soilPreferences}</Text>
        </View>
        <View className="space-y-2">
          <Text className="text-accent text-xl">Humidity:</Text>
          <Text className="text-text-primary text-lg">{plant.careInfo?.humidity}</Text>
        </View>
        <View className="space-y-2">
          <Text className="text-accent text-xl">Temperature minimum:</Text>
          <Text className="text-text-primary text-lg">{plant.careInfo?.minTemperature}</Text>
        </View>
        <View className="space-y-2">
          <Text className="text-accent text-xl">Temperature maximum:</Text>
          <Text className="text-text-primary text-lg">{plant.careInfo?.maxTemperature}</Text>
        </View>
        <View className="">
            {plant.careInfo?.commonIssues && (
              <View className="mt-5">
                <Text className="text-accent text-xl">Common Issues:</Text>
                {
                  plant.careInfo?.commonIssues.map((name, index) => {
                    return (
                      <Text key={index} className="text-text-primary text-lg">{name}</Text>
                    )
                  })
                }
              </View>
            )}
        </View>
        <View className="">
          {plant.careInfo?.specialNotes && (
              <View className="mt-5">
                <Text className="text-accent text-xl">Special Notes:</Text>
                {
                  plant.careInfo?.specialNotes.map((name, index) => {
                    return (
                      <Text key={index} className="text-text-primary text-lg">{name}</Text>
                    )
                  })
                }
              </View>
            )}
        </View>
        <View className="">
          {plant.careInfo?.careInstructions && (
              <View className="mt-5">
                <Text className="text-accent text-xl">General care instructions:</Text>
                {
                  plant.careInfo?.careInstructions.map((name, index) => {
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

export default plantComponent