import { View, Text, Button, Pressable, Image, SafeAreaView, Alert } from 'react-native'
import React, { useRef, useState, useEffect } from 'react'
import SearchBar from '@/components/SearchBar'
import * as ExpoCamera from 'expo-camera'
import AntDesign from '@expo/vector-icons/AntDesign';
import colors from '@/constants/colors';
import * as MediaLibrary from 'expo-media-library';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const identify = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [cameraPermission, requestCameraPermission] = ExpoCamera.useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
  const ref = useRef<ExpoCamera.CameraView>(null);
  const [imageUris, setImageUris] = useState<string[]>(Array(5).fill(null));
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [cameraActive, setCameraActive] = useState(true);
  const maxImages = 5;

  useEffect(() => {
    requestMediaPermission();
  }, []);

  const takePicture = async () => {
    try {
      if (!mediaPermission?.granted) {
        console.log("No media permission");
        Alert.alert("Permission Denied", "Please grant media permission to save photos.");
        return;
      }

      const photo = await ref.current?.takePictureAsync();
      if (photo?.uri) {
        // Save to media library
        await MediaLibrary.saveToLibraryAsync(photo.uri);
        setImageUris(prevUris => {
          const newUris = [...prevUris];
          newUris[currentImageIndex] = photo.uri;
          return newUris;
        });
        if (currentImageIndex < maxImages - 1) {
          setCurrentImageIndex(currentImageIndex + 1);
        } else {
          setCameraActive(false);
        }
      }
    } catch (error) {
      console.error("Error taking picture:", error);
      Alert.alert("Error", "Failed to take picture. Please try again.");
    }
  }

  const replacePicture = async () => {
    try {
      if (!mediaPermission?.granted) {
        console.log("No media permission");
        Alert.alert("Permission Denied", "Please grant media permission to replace photos.");
        return;
      }

      const photo = await ref.current?.takePictureAsync();
      if (photo?.uri) {
        // Save to media library
        await MediaLibrary.saveToLibraryAsync(photo.uri);
        setImageUris(prevUris => {
          const newUris = [...prevUris];
          newUris[currentImageIndex] = photo.uri;
          return newUris;
        });
      }
    } catch (error) {
      console.error("Error replacing picture:", error);
      Alert.alert("Error", "Failed to replace picture. Please try again.");
    }
  }

  const renderCamera = () => (
    <View style={{ width: width, height: height * 0.66, backgroundColor: colors.background.primary}}>
      <ExpoCamera.CameraView 
        style={{ flex: 1 }}
        facing={'back'}
        ref={ref}
        mode={'picture'}
      >
        <View className='absolute bottom-10 w-full flex-row justify-center'>
          <Pressable 
            onPress={takePicture}
            disabled={!cameraActive}
            className='w-20 h-20 rounded-full bg-white border-4 border-secondary-medium'
          >
            <View className='flex-1 rounded-full m-1 bg-secondary-medium' />
            {!cameraActive && (
              <Text className='absolute text-xs text-red-500'>All Images Taken</Text>
            )}
          </Pressable>
        </View>
      </ExpoCamera.CameraView>
    </View>
  );

  const renderPicture = () => (
    <View style={{ width: width, height: height * 0.66}}>
      {imageUris.map((uri, index) => {
        if (uri === null) return null; // Skip null URIs
        return (
          <View key={index} style={{ display: index === currentImageIndex ? 'flex' : 'none', width: '100%', height: '100%' }}>
            <Image 
              source={{ uri }}
              style={{ width: '100%', height: '100%' }}
              resizeMode='cover'
            />
          </View>
        );
      })}
      <View className='absolute bottom-10 w-full flex-row justify-around'>
        <Pressable 
          className='bg-secondary-medium p-4 rounded-full'
          onPress={() => {
            setCurrentImageIndex(prevIndex => Math.max(0, prevIndex - 1));
          }}
          disabled={currentImageIndex === 0}
        >
          <AntDesign name="arrowleft" size={32} color="white" />
        </Pressable>
        <Pressable 
          className='bg-secondary-medium p-4 rounded-full'
          onPress={replacePicture}
          disabled={cameraActive}
        >
          <AntDesign name="camera" size={32} color="white" />
        </Pressable>
        <Pressable 
          className='bg-secondary-medium p-4 rounded-full'
          onPress={() => {
            setCurrentImageIndex(prevIndex => Math.min(maxImages - 1, prevIndex + 1));
          }}
          disabled={currentImageIndex === maxImages - 1}
        >
          <AntDesign name="arrowright" size={32} color="white" />
        </Pressable>
      </View>
      <Text className='absolute top-10 self-center text-white text-xl'>{currentImageIndex + 1} / {maxImages}</Text>
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
        <View className="h-24 bg-background-primary rounded-2xl">
        
        </View>
        {!cameraActive ? renderPicture() : renderCamera()}
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