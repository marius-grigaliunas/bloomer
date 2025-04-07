import { View, Text, Button, Pressable, Image, SafeAreaView } from 'react-native'
import React, { useRef, useState, useEffect } from 'react'
import SearchBar from '@/components/SearchBar'
import * as ExpoCamera from 'expo-camera'
import AntDesign from '@expo/vector-icons/AntDesign';
import colors from '@/constants/colors';
import * as MediaLibrary from 'expo-media-library';

const identify = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [cameraPermission, requestCameraPermission] = ExpoCamera.useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
  const ref = useRef<ExpoCamera.CameraView>(null);
  const [uri, setUri] = useState<string | null>(null);

  useEffect(() => {
    requestMediaPermission();
  }, []);

  const takePicture = async () => {
    try {
      if (!mediaPermission?.granted) {
        console.log("No media permission");
        return;
      }

      const photo = await ref.current?.takePictureAsync();
      if (photo?.uri) {
        // Save to media library
        await MediaLibrary.saveToLibraryAsync(photo.uri);
        setUri(photo.uri);
      }
    } catch (error) {
      console.error("Error taking picture:", error);
    }
  }

  const renderCamera = () => (
    <View style={{ height: 600 , backgroundColor: colors.background.primary }}>
      <ExpoCamera.CameraView 
        style={{ flex: 1 }}
        facing={'back'}
        ref={ref}
        mode={'picture'}
      >
        <View className='absolute bottom-10 w-full flex-row justify-center'>
          <Pressable 
            onPress={takePicture}
            className='w-20 h-20 rounded-full bg-white border-4 border-secondary-medium'
          >
            <View className='flex-1 rounded-full m-1 bg-secondary-medium' />
          </Pressable>
        </View>
      </ExpoCamera.CameraView>
    </View>
  );

  const renderPicture = () => (
    <View style={{ height:600,  }}>
      <Image 
        source={{ uri: uri || '' }}
        style={{ flex: 1 }}
        resizeMode='cover'
      />
      <Pressable 
        className='absolute bottom-10 self-center bg-secondary-medium p-4 rounded-full'
        onPress={() => setUri(null)}
      >
        <AntDesign name="camera" size={32} color="white" />
      </Pressable>
    </View>
  );

  // Check both permissions
  if (!cameraPermission || !mediaPermission) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background.primary }}>
        <Text className='text-3xl text-text-primary'>Loading permissions...</Text>
      </View>
    );
  }

  if (!cameraPermission.granted || !mediaPermission.granted) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background.primary }}>
        <Text className='text-3xl text-text-primary mb-4'>We need camera and media permissions</Text>
        <Button 
          onPress={async () => {
            await requestCameraPermission();
            await requestMediaPermission();
          }} 
          title="Grant permissions" 
        />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <View style={{ flex: 1 }}>
        {uri ? renderPicture() : renderCamera()}
        <View className='mt-10 w-full px-4'>
          <SearchBar
            placeholder='Search for your plant'
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <View className="h-72 bg-background-primary rounded-2xl">
        
        </View>
      </View>
    </SafeAreaView>
  );
}

export default identify;