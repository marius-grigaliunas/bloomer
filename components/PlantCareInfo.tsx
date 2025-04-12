import { View, Text } from 'react-native'
import React from 'react'
import { PlantCareInfo } from '@/lib/services/chutesService/deepseekService'

interface PlantCareInfoComponentProps {
  plantCareInfo: PlantCareInfo| null;
}

const PlantCareInfoComponent: React.FC<PlantCareInfoComponentProps> = ({ plantCareInfo }) => {
  if (!plantCareInfo) return null;

  return (
    <View>
        <View className="space-y-4">
          <Text className="text-text-primary text-2xl font-bold">Care Instructions</Text>

          <View className="space-y-2"></View>
            <Text className="text-text-primary text-xl">Watering:</Text>
            <Text className="text-text-secondary text-lg">{plantCareInfo.wateringFrequency}</Text>
          </View>

          <View className="space-y-2">
            <Text className="text-text-primary text-xl">Light Requirements:</Text>
            <Text className="text-text-secondary text-lg">{plantCareInfo.lightRequirements}</Text>
          </View>

          <View className="space-y-2">
            <Text className="text-text-primary text-xl">SoilPreferences:</Text>
            <Text className="text-text-secondary text-lg">{plantCareInfo.soilPreferences}</Text>
          </View>

          <View className="space-y-2">
            <Text className="text-text-primary text-xl">Common Issues:</Text>
            <Text className="text-text-secondary text-lg">{plantCareInfo.commonIssues}</Text>
          </View>

          <View className="space-y-2">
            <Text className="text-text-primary text-xl">Additional Care:</Text>
            <Text className="text-text-secondary text-lg">{plantCareInfo.specialNotes}</Text>
          </View>
    </View>
  )
}

export default PlantCareInfoComponent