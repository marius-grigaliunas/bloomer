import { View, Text, Button, Pressable, Image, SafeAreaView, Alert, Modal, TouchableOpacity } from 'react-native'
import React, { useRef, useState, useEffect } from 'react'
import SearchBar from '@/components/SearchBar'
import * as ExpoCamera from 'expo-camera'
import AntDesign from '@expo/vector-icons/AntDesign';
import colors from '@/constants/colors';
import * as FileSystem from 'expo-file-system';
import { Dimensions } from 'react-native';
import { identifyPlants } from '@/lib/services/plantNetService';
import { getPlantCareInfo } from '@/lib/services/chutesService/deepseekService';
import { usePlantInformation } from '@/interfaces/plantInformation';
import { router } from 'expo-router';
import LoadingScreen from '../../../components/LoadingScreen';

const { width, height } = Dimensions.get('window');

const DEV_MODE = process.env.NODE_ENV === 'development';

const identify = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCamera, setShowCamera] = useState(true); // Start with camera view
  const [cameraPermission, requestCameraPermission] = ExpoCamera.useCameraPermissions();
  const ref = useRef<ExpoCamera.CameraView>(null);
  const [imageUris, setImageUris] = useState<string[]>(Array(5).fill(null));
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const maxImages = 5;
  const [showReplaceCamera, setShowReplaceCamera] = useState(false);

  // Add loading state
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [identificationError, setIdentificationError] = useState<string | null>(null);

  useEffect(() => {
    // Store the URIs that exist when the effect runs
    const currentUris = [...imageUris];
    
    return () => {
      // Synchronously start deletion of all files
      currentUris.forEach(uri => {
        if (uri) {
          FileSystem.deleteAsync(uri, { idempotent: true })
            .catch(error => console.log('Error cleaning up temp file:', error));
        }
      });
    };
  }, []);

  const takePicture = async () => {
      try {
        if (!ref.current || !ref.current.takePictureAsync) {
          throw new Error("Camera reference is not properly initialized.");
        }
  
        const photo = await ref.current.takePictureAsync();
        if (photo?.uri) {
          // Add timestamp to make filename unique
          const timestamp = new Date().getTime();
          const tempUri = FileSystem.cacheDirectory + `temp_photo_${currentImageIndex}_${timestamp}.jpg`;
          await FileSystem.moveAsync({
            from: photo.uri,
            to: tempUri
          });
  
          setImageUris(prevUris => {
            const newUris = [...prevUris];
            newUris[currentImageIndex] = tempUri;
            return newUris;
          });
  
          if (currentImageIndex < maxImages - 1) {
            setCurrentImageIndex(currentImageIndex + 1);
          }
        } else {
          throw new Error("Photo URI is not available.");
        }
      } catch (error) {
        console.error("Error taking picture:", error);
        Alert.alert("Error", "Failed to take picture. Please try again.");
      }
    };

  const replacePicture = async () => {
    setShowReplaceCamera(true);
  }

  const handleReplacePicture = async () => {
    try {
      const photo = await ref.current?.takePictureAsync();
      if (photo?.uri) {
        // Delete existing temporary file if it exists
        const oldUri = imageUris[currentImageIndex];
        if (oldUri) {
          const fileInfo = await FileSystem.getInfoAsync(oldUri);
          if (fileInfo.exists) {
            await FileSystem.deleteAsync(oldUri, { idempotent: true });
          }
        }
  
        // Add timestamp to make filename unique
        const timestamp = new Date().getTime();
        const tempUri = FileSystem.cacheDirectory + `temp_photo_${currentImageIndex}_${timestamp}.jpg`;
        await FileSystem.moveAsync({
          from: photo.uri,
          to: tempUri
        });
  
        setImageUris(prevUris => {
          const newUris = [...prevUris];
          newUris[currentImageIndex] = tempUri;
          return newUris;
        });
        setShowReplaceCamera(false);
      }
    } catch (error) {
      console.error("Error replacing picture:", error);
      Alert.alert("Error", "Failed to replace picture. Please try again.");
    }
  };

  const handleIdentify = async () => {
    try {
      setIsIdentifying(true);
      setIdentificationError(null);
      
      // Filter out null values and get valid URIs
      const validImageUris = imageUris.filter((uri): uri is string => uri !== null);
      
      if (validImageUris.length === 0) {
        throw new Error('No images to identify');
      }

      const results = await identifyPlants(validImageUris);
      const scientificName = results.bestMatch;
      const plantCommonNames = results.commonNames ?? [''];
      const careInfo = await getPlantCareInfo(scientificName, plantCommonNames);

      usePlantInformation.getState().setIdentifiedPlant({
        scientificName,
        commonNames: plantCommonNames,
        confidence: results.confidence,
        careInfo,
        imageUri: validImageUris[0]
      })

      router.push("/plants/identifiedPlant")

    } catch (error) {
      console.error('Identification failed:', error);
      setIdentificationError(error instanceof Error ? error.message : 'Failed to identify plants');
    } finally {
      setIsIdentifying(false);
    }
  };

  const resetIdentification = async () => {
    try {
      for (const uri of imageUris) {
        if (uri) {
          try {
            const fileInfo = await FileSystem.getInfoAsync(uri);
            if (fileInfo.exists) {
              await FileSystem.deleteAsync(uri, { idempotent: true });
            }
          } catch (error) {
            console.log('Error checking/deleting file:', error);
          }
        }
      }
  
      // Reset states only after confirming deletions
      setImageUris(Array(5).fill(null));
      setCurrentImageIndex(0);
      setIdentificationError(null);

    } catch (error) {
      console.error('Error resetting identification:', error);
    }
  };

  const switchToSearch = async () => {
    try {  
      await resetIdentification(); 
      setShowCamera(false);
      
    } catch (error) {
      console.error('Error switching to camera:', error);
      // Reset states anyway as fallback
      setImageUris(Array(5).fill(null));
      setCurrentImageIndex(0);
      setShowCamera(true);
    }
  };

  const switchToCamera = async () => {
    try {
      await resetIdentification();      
      setShowCamera(true);

    } catch (error) {
      console.error('Error switching to camera:', error);
      // Reset states anyway as fallback
      setImageUris(Array(5).fill(null));
      setCurrentImageIndex(0);
      setShowCamera(true);
    }
  };

  const renderCamera = () => (
    <View style={{ width: width, height: height * 0.8, backgroundColor: colors.background.primary}}>
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
    <View style={{ width: width, height: height * 0.8}}>
      {/* Display only the current image */}
      {imageUris[currentImageIndex] && (
        <Image 
          source={{ uri: imageUris[currentImageIndex] }}
          style={{ width: '100%', height: '100%' }}
          resizeMode='cover'
        />
      )}
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

  // Check camera permission
  if (!cameraPermission) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background.primary }}>
        <Text className='text-3xl text-text-primary'>Loading permissions...</Text>
      </View>
    );
  }

  if (!cameraPermission.granted) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background.primary }}>
        <Text className='text-3xl text-text-primary mb-4'>We need camera permissions</Text>
        <Button 
          onPress={async () => {
            await requestCameraPermission();
          }} 
          title="Grant permissions" 
        />
      </View>
    );
  }

  const handleQuickTest = () => {
    const testPlantData = {
      plant: {
        scientificName: "Ocimum basilicum",
        commonNames: ["Sweet Basil", "Common Basil"],
        confidence: 0.95,
        imageUri: "https://example.com/basil.jpg", // Add imageUri field
        careInfo: {
            wateringFrequency: 3,
            wateringAmount: 200,
            lightRequirements: "high" as "high", // Type assertion to match enum
            soilPreferences: "Well-draining, rich soil",
            humidity: "medium" as "medium", // Type assertion to match enum
          minTemperature: 15, // Added required field
          maxTemperature: 30, // Added required field
          commonIssues: ["Leaf spots", "Root rot", "Aphids"],
          specialNotes: ["Pinch off flower buds to promote leaf growth", "Harvest regularly"],
          careInstructions: [ // Added required field
            "Water when top inch of soil feels dry",
            "Provide 6-8 hours of sunlight daily",
            "Maintain temperatures between 15-30°C",
            "Regular pruning encourages bushier growth"
          ]
        }
      }
    };

    usePlantInformation.getState().setIdentifiedPlant(testPlantData.plant);
    router.push(`/plants/${encodeURIComponent(testPlantData.plant.scientificName)}`);
  };

  return (
    isIdentifying ? <LoadingScreen/> : 
    (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <View style={{ flex: 1 }}>
        {showCamera ? (
          // Camera view
          <View className="flex-1">
            {imageUris[currentImageIndex] ? renderPicture() : renderCamera()}
            <View className="px-4 mt-1 space-y-4">
              <Pressable 
                className={`p-4 rounded-xl ${imageUris.every(uri => uri !== null) ? 'bg-secondary-medium' : 'bg-gray-400'}`}
                onPress={handleIdentify}
                disabled={!imageUris.some(uri => uri !== null) || isIdentifying}
              >
                <Text className="text-white text-center text-lg font-semibold">
                  Identify {imageUris.filter(uri => uri !== null).length}/5 photos
                </Text>
              </Pressable>
              {identificationError && (
                <Text className="text-red-500 text-center mt-2">
                  {identificationError}
                </Text>
              )}
              <TouchableOpacity 
                className="bg-secondary-deep p-4 mt-3 rounded-xl"
                onPress={switchToSearch}
                disabled={true}
              >
                <Text className="text-text-primary text-center">
                  Search your plant instead
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          // Search view
          <View className="flex-1 mt-10 px-4 pt-8">
            <Pressable 
              className="bg-secondary-medium p-4 rounded-xl mb-4"
              onPress={switchToCamera}
            >
              <Text className="text-white text-center text-lg font-semibold">
                Identify with camera
              </Text>
            </Pressable>
            <SearchBar
              placeholder='Search for your plant'
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {DEV_MODE && (
              <TouchableOpacity 
                className="bg-danger p-4 rounded-xl mt-4"
                onPress={handleQuickTest}
              >
                <Text className="text-text-primary text-center font-bold">
                  DEV: Quick Test Plant Details
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        {/* Replace camera modal */}
        <Modal
          visible={showReplaceCamera}
          animationType="slide"
          onRequestClose={() => setShowReplaceCamera(false)}
        >
          <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
            <ExpoCamera.CameraView 
              style={{ flex: 1 }}
              facing={'back'}
              ref={ref}
              mode={'picture'}
            >
              <View className='absolute bottom-10 w-full flex-row justify-around'>
                <Pressable 
                  onPress={() => setShowReplaceCamera(false)}
                  className='bg-secondary-medium p-4 rounded-full'
                >
                  <AntDesign name="close" size={32} color="white" />
                </Pressable>
                <Pressable 
                  onPress={handleReplacePicture}
                  className='w-20 h-20 rounded-full bg-white border-4 border-secondary-medium'
                >
                  <View className='flex-1 rounded-full m-1 bg-secondary-medium' />
                </Pressable>
              </View>
            </ExpoCamera.CameraView>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
    )
  );
}

export default identify;