import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { useGlobalContext } from '@/lib/globalProvider';
import { Plant, DatabasePlantType } from '@/interfaces/interfaces';
import { Ionicons } from '@expo/vector-icons';

interface PlantComponentProps {
  plant: Plant | DatabasePlantType | null;
}

const PlantComponent: React.FC<PlantComponentProps> = ({ plant }) => {
  const { user: contextUser, databaseUser: userData } = useGlobalContext();
  
  const userUnitSystem = userData?.unitSystem;
  const userTemperatureUnit = userData?.temperatureUnit;

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

  // Care info sections with icons and colors
  const careSections = [
    {
      title: 'Watering',
      icon: 'water-outline',
      color: '#4F772D',
      bgColor: 'bg-primary-medium/10',
      content: `Every ${careInfo.wateringFrequency} days, water with ${userUnitSystem == "metric" ? `${careInfo.wateringAmountMetric} ml` : `${careInfo.wateringAmountImperial} oz`} of water.`
    },
    {
      title: 'Light Requirements',
      icon: 'sunny-outline',
      color: '#E6B566',
      bgColor: 'bg-accent/10',
      content: careInfo.lightRequirements
    },
    {
      title: 'Soil Preferences',
      icon: 'leaf-outline',
      color: '#90A955',
      bgColor: 'bg-secondary-medium/10',
      content: careInfo.soilPreferences
    },
    {
      title: 'Humidity',
      icon: 'cloudy-outline',
      color: '#4F772D',
      bgColor: 'bg-primary-medium/10',
      content: careInfo.humidity
    },
    {
      title: 'Temperature Range',
      icon: 'thermometer-outline',
      color: '#E53935',
      bgColor: 'bg-danger/10',
      content: `${userTemperatureUnit == "celsius" ? `${careInfo.minTemperatureCelsius}°C` : `${careInfo.minTemperatureFahrenheit}°F`} - ${userTemperatureUnit == "celsius" ? `${careInfo.maxTemperatureCelsius}°C` : `${careInfo.maxTemperatureFahrenheit}°F`}`
    }
  ];

  return (
    <View className="space-y-4">
      {/* Basic Care Information Cards */}
      {careSections.map((section, index) => (
        <View key={index} className="bg-white rounded-3xl p-4 shadow-sm shadow-black/5">
          <View className="flex-row items-center mb-3">
            <View className={`w-10 h-10 rounded-2xl ${section.bgColor} items-center justify-center mr-3`}>
              <Ionicons name={section.icon as any} size={20} color={section.color} />
            </View>
            <Text className="text-text-primary text-lg font-semibold flex-1">
              {section.title}
            </Text>
          </View>
          <Text className="text-text-secondary text-base leading-6">
            {section.content}
          </Text>
        </View>
      ))}

      {/* Common Issues */}
      {careInfo.commonIssues && careInfo.commonIssues.length > 0 && (
        <View className="bg-white rounded-3xl p-4 shadow-sm shadow-black/5">
          <View className="flex-row items-center mb-3">
            <View className="w-10 h-10 rounded-2xl bg-warning/10 items-center justify-center mr-3">
              <Ionicons name="warning-outline" size={20} color="#E6B566" />
            </View>
            <Text className="text-text-primary text-lg font-semibold">
              Common Issues
            </Text>
          </View>
          <View className="space-y-2">
            {careInfo.commonIssues.map((issue, index) => (
              <View key={index} className="flex-row items-start">
                <View className="w-2 h-2 rounded-full bg-warning mt-2 mr-3 flex-shrink-0" />
                <Text className="text-text-secondary text-base leading-6 flex-1">
                  {issue}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Special Notes */}
      {specialNotes && specialNotes.length > 0 && (
        <View className="bg-white rounded-3xl p-4 shadow-sm shadow-black/5">
          <View className="flex-row items-center mb-3">
            <View className="w-10 h-10 rounded-2xl bg-info/10 items-center justify-center mr-3">
              <Ionicons name="information-circle-outline" size={20} color="#90A955" />
            </View>
            <Text className="text-text-primary text-lg font-semibold">
              Special Notes
            </Text>
          </View>
          <View className="space-y-2">
            {specialNotes.map((note, index) => (
              <View key={index} className="flex-row items-start">
                <View className="w-2 h-2 rounded-full bg-info mt-2 mr-3 flex-shrink-0" />
                <Text className="text-text-secondary text-base leading-6 flex-1">
                  {note}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* General Care Instructions */}
      {careInfo.careInstructions && careInfo.careInstructions.length > 0 && (
        <View className="bg-white rounded-3xl p-4 shadow-sm shadow-black/5">
          <View className="flex-row items-center mb-3">
            <View className="w-10 h-10 rounded-2xl bg-success/10 items-center justify-center mr-3">
              <Ionicons name="checkmark-circle-outline" size={20} color="#2E7D32" />
            </View>
            <Text className="text-text-primary text-lg font-semibold">
              Care Instructions
            </Text>
          </View>
          <View className="space-y-3">
            {careInfo.careInstructions.map((instruction, index) => (
              <View key={index} className="flex-row items-start">
                <View className="w-6 h-6 rounded-full bg-success/20 items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                  <Text className="text-success text-xs font-bold">
                    {index + 1}
                  </Text>
                </View>
                <Text className="text-text-secondary text-base leading-6 flex-1">
                  {instruction}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  )
}

export default PlantComponent