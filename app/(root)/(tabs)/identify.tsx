import { View, Text, Button, Pressable, Image, SafeAreaView, Alert, Modal, TouchableOpacity } from 'react-native'
import React, { useRef, useState, useEffect } from 'react'
import SearchBar from '@/components/SearchBar'
import * as ExpoCamera from 'expo-camera'
import AntDesign from '@expo/vector-icons/AntDesign';
import colors from '@/constants/colors';
import * as FileSystem from 'expo-file-system';
import { Dimensions } from 'react-native';
import { PlantIdentificationResponse, identifyPlants } from '@/lib/services/plantNetService';
import { getPlantCareInfo, PlantCareInfo } from '@/lib/services/chutesService/deepseekService';
import PlantCareInfoComponent from '@/components/PlantCareInfoComponent';


const { width, height } = Dimensions.get('window');

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
  const [bestMatch, setBestMatch] = useState<string>("")
  const [commonNames, setCommonNames] = useState<string[]>([""])
  const [confidence, setConfidence] = useState<number>(0)
  const [showResults, setShowResults] = useState(false);
  const [plantCareInfo, setPlantCareInfo] = useState<PlantCareInfo | null>(null);

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
      const photo = await ref.current?.takePictureAsync();
      if (photo?.uri) {
        // Move the photo to temporary directory
        const tempUri = FileSystem.cacheDirectory + `temp_photo_${currentImageIndex}.jpg`;
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
      }
    } catch (error) {
      console.error("Error taking picture:", error);
      Alert.alert("Error", "Failed to take picture. Please try again.");
    }
  }

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
          await FileSystem.deleteAsync(oldUri, { idempotent: true });
        }

        // Move new photo to temporary directory
        const tempUri = FileSystem.cacheDirectory + `temp_photo_${currentImageIndex}.jpg`;
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
  }

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
      
      
      // Store results in variables first
      const scientificName = results.bestMatch;
      const plantCommonNames = results.commonNames ?? [''];
      
      // Update state
      setBestMatch(scientificName);
      setCommonNames(plantCommonNames);
      setConfidence(results.confidence);
      setShowResults(true);

      // Call getPlantCareInfo with the actual values, not the state
      const careInfo = await getPlantCareInfo(scientificName, plantCommonNames);
      setPlantCareInfo(careInfo || null);

    } catch (error) {
      console.error('Identification failed:', error);
      setIdentificationError(error instanceof Error ? error.message : 'Failed to identify plants');
    } finally {
      setIsIdentifying(false);
    }
  };

  const resetIdentification = async () => {
    try {
      // Delete all existing images first
      const deletePromises = imageUris.map(uri => {
        if (uri) {
          return FileSystem.deleteAsync(uri, { idempotent: true })
            .catch(error => console.log('Error deleting file:', error));
        }
        return Promise.resolve();
      });

      await Promise.all(deletePromises);
      
      // Reset all states only after files are deleted
      setShowResults(false);
      setImageUris(Array(5).fill(null));
      setCurrentImageIndex(0);
      setBestMatch('');
      setCommonNames(['']);
      setConfidence(0);
      setIdentificationError(null);
      setShowCamera(true);
    } catch (error) {
      console.error('Error resetting identification:', error);
    }
  };

  const switchToSearch = async () => {
    await resetIdentification(); // This already sets showCamera to true
    setShowCamera(false); // Then we set it to false for search view
  };

  // Create a new function for switching back to camera
  const switchToCamera = async () => {
    try {
      // First, delete any existing images
      const deletePromises = imageUris.map(uri => {
        if (uri) {
          return FileSystem.deleteAsync(uri, { idempotent: true })
            .catch(error => console.log('Error deleting file:', error));
        }
        return Promise.resolve();
      });

      await Promise.all(deletePromises);
      
      // Then reset all states
      setImageUris(Array(5).fill(null));
      setCurrentImageIndex(0);
      setShowCamera(true);
    } catch (error) {
      console.error('Error switching to camera:', error);
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

  const renderResults = () => (
    <View className="flex-1 p-4 bg-background-surface rounded-xl m-1 mt-10">
      <View className="space-y-4">
        <Text className="text-text-primary text-2xl font-bold">Results</Text>
        
        <View className="space-y-2">
          <Text className="text-text-primary text-xl">Scientific Name:</Text>
          <Text className="text-text-secondary text-lg">{bestMatch}</Text>
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

        <View className="space-y-2">
          <Text className="text-text-primary text-xl">Confidence:</Text>
          <Text className="text-text-secondary text-lg">{(confidence * 100).toFixed(1)}%</Text>
        </View>

        <PlantCareInfoComponent plantCareInfo={plantCareInfo} />

        <TouchableOpacity 
          className="bg-secondary-medium p-4 rounded-xl mt-8"
          onPress={resetIdentification}
        >
          <Text className="text-text-primary text-center text-lg font-semibold">
            Identify Another Plant
          </Text>
        </TouchableOpacity>
      </View>
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <View style={{ flex: 1 }}>
        {showResults ? (
          renderResults()
        ) : showCamera ? (
          // Camera view
          <View className="flex-1">
            {imageUris[currentImageIndex] ? renderPicture() : renderCamera()}
            <View className="px-4 mt-1 space-y-4">
              <Pressable 
                className={`p-4 rounded-xl ${imageUris.every(uri => uri !== null) ? 'bg-secondary-medium' : 'bg-gray-400'}`}
                onPress={handleIdentify}
                disabled={!imageUris.every(uri => uri !== null) || isIdentifying}
              >
                <Text className="text-white text-center text-lg font-semibold">
                  {isIdentifying ? 'Identifying...' : `Identify (${imageUris.filter(uri => uri !== null).length}/5 photos)`}
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
              onPress={switchToCamera} // Changed from setShowCamera(true)
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
          </View>
        )}
        {/* Keep only the replace camera modal */}
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
  );
}

export default identify;