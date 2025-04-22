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

  const { scientificName, commonNames, confidence, careInfo } = plant;

  return (
    <View>
      <View className="flex-1 p-4 rounded-xl mt-10">
        <View className="space-y-4">
          <Text className="text-text-primary text-2xl font-bold">Results</Text>
          <View className="space-y-2">
            <Text className="text-text-primary text-xl">Scientific Name:</Text>
            <Text className="text-text-secondary text-lg">{scientificName}</Text>
          </View>

          {commonNames && (
            <View className="space-y-2">
              <Text className="text-text-primary text-xl">Common Names:</Text>
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
      <View className="space-y-4 flex p-4">
        <Text className="text-text-primary text-2xl font-bold">Care Instructions</Text>
        <View className="space-y-2"></View>
          <Text className="text-text-primary text-xl">Watering:</Text>
          <Text className="text-text-secondary text-lg">{plant.careInfo?.wateringFrequency}</Text>
        <View className="space-y-2">
          <Text className="text-text-primary text-xl">Light Requirements:</Text>
          <Text className="text-text-secondary text-lg">{plant.careInfo?.lightRequirements}</Text>
        </View>
        <View className="space-y-2">
          <Text className="text-text-primary text-xl">SoilPreferences:</Text>
          <Text className="text-text-secondary text-lg">{plant.careInfo?.soilPreferences}</Text>
        </View>
        <View className="space-y-2">
          <Text className="text-text-primary text-xl">Common Issues:</Text>
          <Text className="text-text-secondary text-lg">{plant.careInfo?.commonIssues}</Text>
        </View>
        <View className="space-y-2">
          <Text className="text-text-primary text-xl">Additional Care:</Text>
          <Text className="text-text-secondary text-lg">{plant.careInfo?.specialNotes}</Text>
        </View>
      </View>
    </View>
  )
}

export default plantComponent