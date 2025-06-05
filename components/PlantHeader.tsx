import { View, Text, ScrollView, TouchableOpacity, Alert, Dimensions, Image, Button } from 'react-native'
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
            <View className='w-screen flex flex-row justify-around items-center bg-background-surface py-8
          rounded-xl'>
          <View
            style={{boxShadow:`
                0 0px 5px 1px ${colors.secondary.medium},
              `, borderRadius:50,
              
            }}
          >
            <Image
              source={{ uri: imageUri }}
              style={{width: width*0.4, height: height*0.4, borderRadius:50,
                  borderColor:colors.secondary.medium, borderWidth:1,  
                  }}
              resizeMode='cover'
            />
          </View>
          <View className=''>
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
              {
                confidence != null ? (
                  <View className='mt-5'>  
                    <Text className="text-text-secondary text-xl">Confidence:</Text>
                    <Text 
                      style={{color:(confidence < 0.33 ? colors.danger : confidence < 0.66 ? colors.accent : colors.secondary.medium)}} 
                      className="text-3xl">{Math.round(confidence*100)}%
                    </Text>
                  </View>
                ) : <View/>
              }
              {
                nickname != null ? (
                  <View className='mt-5'>  
                    <Text className="text-text-secondary text-xl">Nickname:</Text>
                    <Text 
                      className="text-3xl text-text-primary"
                    >
                      {nickname}
                    </Text>
                  </View>
                ) : <View/>
              }
          </View>
        </View>
  )
}

export default PlantHeader