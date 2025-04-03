import { View, Text, Button, Pressable } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import SearchBar from '@/components/SearchBar'
import * as ExpoCamera from 'expo-camera'
import { Permission } from 'react-native-appwrite'


const identify = () => {

  const [searchQuery, setSearchQuery] = useState("");
  const [cameraPermission, requestCameraPermission] = ExpoCamera.useCameraPermissions();
  const ref = useRef<ExpoCamera.CameraView>(null)
  const [uri, setUri] = useState<string | null>(null);

  const takePicture = async () => {
    const photo = await ref.current?.takePictureAsync();
    setUri(photo?.uri ?? null);
  }


  if(!cameraPermission) {
    return null;
  }

  if(!cameraPermission?.granted) {
    return (
      <View >
        <Text className='text-3xl text-text-primary'>We need your permission to show the camera</Text>
        <Button onPress={requestCameraPermission} title="grant permission" />
      </View>
    );
  }

  return (
    <View className='flex justify-start items-center w-full h-full bg-background-primary'>
      <ExpoCamera.CameraView 
        className='flex' 
        facing={'back'}
        ref={ref}
        mode={'picture'}
        mute={true}
        responsiveOrientationWhenOrientationLocked
      >
        <View className='flex bg-transparent h-4/6 w-screen rounded-full'>
          <Pressable onPress={takePicture}/>
        </View>
      </ExpoCamera.CameraView>
      <View className='flex justify-center items-center w-screen mt-5'>
        <SearchBar
          placeholder='Search for your plant'
          value={searchQuery}
          onChangeText={(text: string) => setSearchQuery(text)}
        />
        <Text
          className='text-3xl text-text-primary'
        >
          {searchQuery}
        </Text>
      </View>
    </View>
  )
}

export default identify