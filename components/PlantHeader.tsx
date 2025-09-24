import { View, Text, Image, Dimensions } from 'react-native'
import React from 'react'
import colors from '@/constants/colors'
const { width, height } = Dimensions.get('window');

interface PlantHeaderInterface {
  scientificName: string;
  commonNames: string[];
  imageUri: string;
  confidence?: number;
  nickname?: string;
}

const PlantHeader = ({scientificName, commonNames, imageUri, confidence, nickname}: PlantHeaderInterface) => {
  
  return (
    <View className="mx-4 mb-6">
      <View className="bg-white rounded-3xl p-6 shadow-sm shadow-black/5">
                 {/* Image and Main Info Row */}
         <View className="flex-row items-start">
           {/* Plant Image */}
           <View className="mr-4">
             <View style={{
               width: 120,
               height: 120,
               borderRadius: 20,
               borderColor: colors.secondary.medium,
               borderWidth: 2,
               overflow: 'hidden',
             }}>
               <Image
                 source={{ uri: imageUri }}
                 style={{
                   width: '100%',
                   height: '100%',
                 }}
                 resizeMode='cover'
               />
             </View>
           </View>
           
           {/* Plant Names */}
           <View className="flex-1">
             {nickname && (
               <Text className="text-text-primary text-2xl font-bold mb-1">
                 {nickname}
               </Text>
             )}
             <Text className="text-text-secondary text-sm font-medium mb-1">
               {scientificName}
             </Text>
             {commonNames && commonNames.length > 0 && (
               <Text className="text-text-secondary text-sm">
                 {commonNames[0]}
                 {commonNames.length > 1 && `, ${commonNames[1]}`}
                 {commonNames.length > 2 && (
                   <Text className="text-text-secondary text-xs">
                     {' • Also: '}{commonNames.slice(2, 4).join(', ')}
                     {commonNames.length > 4 && '...'}
                   </Text>
                 )}
               </Text>
             )}
           </View>
           
           {/* Confidence Badge */}
           {confidence != null && (
             <View className="bg-primary-medium/10 px-3 py-2 rounded-xl">
               <Text className="text-primary-medium text-sm font-semibold">
                 {Math.round(confidence*100)}%
               </Text>
             </View>
           )}
         </View>
      </View>
    </View>
  )
}

export default PlantHeader