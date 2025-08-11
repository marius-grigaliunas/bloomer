import { View, Text, Button, Pressable, Image, SafeAreaView, Alert, Modal, TouchableOpacity, Platform } from 'react-native'
import React, { useRef, useState, useEffect, useCallback } from 'react'
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
import * as Manipulator from 'expo-image-manipulator';

const { width, height } = Dimensions.get('window');

const DEV_MODE = process.env.NODE_ENV === 'development';

// Image processing configuration
const IMAGE_CONFIG = {
  maxWidth: 800,
  maxHeight: 800,
  quality: 0.8,
  format: Manipulator.SaveFormat.JPEG
};

const identify = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCamera, setShowCamera] = useState(true);
  const [cameraPermission, requestCameraPermission] = ExpoCamera.useCameraPermissions();
  const ref = useRef<ExpoCamera.CameraView>(null);
  const [imageUris, setImageUris] = useState<string[]>(Array(5).fill(null));
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const maxImages = 5;
  const [showReplaceCamera, setShowReplaceCamera] = useState(false);

  // Flash state
  const [flashMode, setFlashMode] = useState<'off' | 'on' | 'auto'>('off');

  // Enhanced loading states
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [identificationError, setIdentificationError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState("");

  // Flash toggle function
  const toggleFlash = () => {
    setFlashMode(prevMode => {
      const newMode = prevMode === 'off' ? 'on' : 'off';
      console.log('Flash mode changed from', prevMode, 'to', newMode, 'Platform:', Platform.OS);
      return newMode;
    });
  };



  useEffect(() => {
    const currentUris = [...imageUris];
    
    return () => {
      currentUris.forEach(uri => {
        if (uri) {
          FileSystem.deleteAsync(uri, { idempotent: true })
            .catch(error => console.log('Error cleaning up temp file:', error));
        }
      });
    };
  }, []);

  const processImage = useCallback(async (imageUri: string): Promise<string> => {
    try {
      setIsProcessingImage(true);
      setLoadingMessage("Processing image...");

      // Get image info first to check original size (optional)
      const imageInfo = await FileSystem.getInfoAsync(imageUri);
      const originalSize = imageInfo.exists ? imageInfo.size : 0;
      
      // Process the image: resize, compress, and optimize
      const processedImage = await Manipulator.manipulateAsync(
        imageUri,
        [
          // Resize to maximum dimensions while maintaining aspect ratio
          { resize: { width: IMAGE_CONFIG.maxWidth, height: IMAGE_CONFIG.maxHeight } }
        ],
        {
          compress: IMAGE_CONFIG.quality,
          format: IMAGE_CONFIG.format,
          base64: false // We don't need base64, just the file
        }
      );

      // Get processed image size for logging
      const processedInfo = await FileSystem.getInfoAsync(processedImage.uri);
      const processedSize = processedInfo.exists ? processedInfo.size : 0;

      console.log(`Image processed: ${Math.round(originalSize / 1024)}KB -> ${Math.round(processedSize / 1024)}KB`);
      
      return processedImage.uri;
    } catch (error) {
      console.error('Error processing image:', error);
      throw error;
    } finally {
      setIsProcessingImage(false);
      setLoadingMessage("");
    }
  }, []);

  const takePicture = async () => {
    try {
      if (!ref.current || !ref.current.takePictureAsync) {
        throw new Error("Camera reference is not properly initialized.");
      }

      setIsProcessingImage(true);
      setLoadingMessage("Taking photo...");

      // Take photo with optimized settings
      const photo = await ref.current.takePictureAsync({
        quality: 0.8, // Reduce initial quality
        base64: false,
        skipProcessing: false
      });

      if (photo?.uri) {
        setLoadingMessage("Processing image...");
        
        // Process the image immediately after capture
        const processedUri = await processImage(photo.uri);
        
        // Create final filename
        const timestamp = new Date().getTime();
        const finalUri = FileSystem.cacheDirectory + `processed_photo_${currentImageIndex}_${timestamp}.jpg`;
        
        // Move processed image to final location
        await FileSystem.moveAsync({
          from: processedUri,
          to: finalUri
        });

        // Clean up original photo if it's different from processed
        if (photo.uri !== processedUri) {
          await FileSystem.deleteAsync(photo.uri, { idempotent: true }).catch(() => {});
        }

        setImageUris(prevUris => {
          const newUris = [...prevUris];
          newUris[currentImageIndex] = finalUri;
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
    } finally {
      setIsProcessingImage(false);
      setLoadingMessage("");
    }
  };

  const replacePicture = async () => {
    setShowReplaceCamera(true);
  }

  const handleReplacePicture = async () => {
    try {
      setIsProcessingImage(true);
      setLoadingMessage("Taking photo...");

      const photo = await ref.current?.takePictureAsync({
        quality: 0.8,
        base64: false,
        skipProcessing: false
      });

      if (photo?.uri) {
        setLoadingMessage("Processing image...");
        
        // Delete existing file
        const oldUri = imageUris[currentImageIndex];
        if (oldUri) {
          const fileInfo = await FileSystem.getInfoAsync(oldUri);
          if (fileInfo.exists) {
            await FileSystem.deleteAsync(oldUri, { idempotent: true });
          }
        }

        // Process new image
        const processedUri = await processImage(photo.uri);
        
        const timestamp = new Date().getTime();
        const finalUri = FileSystem.cacheDirectory + `processed_photo_${currentImageIndex}_${timestamp}.jpg`;
        
        await FileSystem.moveAsync({
          from: processedUri,
          to: finalUri
        });

        // Clean up original photo
        if (photo.uri !== processedUri) {
          await FileSystem.deleteAsync(photo.uri, { idempotent: true }).catch(() => {});
        }

        setImageUris(prevUris => {
          const newUris = [...prevUris];
          newUris[currentImageIndex] = finalUri;
          return newUris;
        });
        setShowReplaceCamera(false);
      }
    } catch (error) {
      console.error("Error replacing picture:", error);
      Alert.alert("Error", "Failed to replace picture. Please try again.");
    } finally {
      setIsProcessingImage(false);
      setLoadingMessage("");
    }
  };

  // Optimized identification with progress tracking
  const handleIdentify = async () => {
    try {
      setIsIdentifying(true);
      setIdentificationError(null);
      
      const validImageUris = imageUris.filter((uri): uri is string => uri !== null);
      
      if (validImageUris.length === 0) {
        throw new Error('No images to identify');
      }

      setLoadingMessage("Analyzing images...");
      
      // Start plant identification
      const results = await identifyPlants(validImageUris);
      
      setLoadingMessage("Getting care information...");
      
      const scientificName = results.bestMatch;
      const plantCommonNames = results.commonNames ?? [''];
      
      // Get care info concurrently if possible, or show interim results
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
      setLoadingMessage("");
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
      console.error('Error switching to search:', error);
      setImageUris(Array(5).fill(null));
      setCurrentImageIndex(0);
      setShowCamera(false);
    }
  };

  const switchToCamera = async () => {
    try {
      await resetIdentification();      
      setShowCamera(true);

    } catch (error) {
      console.error('Error switching to camera:', error);
      setImageUris(Array(5).fill(null));
      setCurrentImageIndex(0);
      setShowCamera(true);
    }
  };

  const renderCamera = () => {
    console.log('Rendering camera with flash mode:', flashMode);
    return (
    <View style={{ width: width, height: height * 0.8, backgroundColor: colors.background.primary}}>
      <ExpoCamera.CameraView 
        style={{ flex: 1 }}
        facing={'back'}
        ref={ref}
        mode={'picture'}
        flash={Platform.OS === 'ios' ? flashMode : undefined}
        enableTorch={Platform.OS === 'android' ? flashMode === 'on' : undefined}
      >
        {/* Flash button */}
        <View className='absolute top-10 right-4'>
          <Pressable 
            onPress={toggleFlash}
            className='bg-black bg-opacity-50 p-3 rounded-full'
            disabled={isProcessingImage}
          >
            <AntDesign name="bulb1" size={24} color={flashMode === 'off' ? 'white' : 'yellow'} />
          </Pressable>
          <Text className='text-white text-xs text-center mt-1 bg-black bg-opacity-50 px-2 py-1 rounded'>
            {flashMode.toUpperCase()} ({Platform.OS})
          </Text>
        </View>
        
        <View className='absolute bottom-10 w-full flex-row justify-center'>
          <Pressable 
            onPress={takePicture}
            className='w-20 h-20 rounded-full bg-white border-4 border-secondary-medium'
            disabled={isProcessingImage}
          >
            <View className='flex-1 rounded-full m-1 bg-secondary-medium' />
          </Pressable>
        </View>
        {isProcessingImage && (
          <View className='absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center'>
            <View className='bg-white p-4 rounded-lg'>
              <Text className='text-black text-center'>{loadingMessage}</Text>
            </View>
          </View>
        )}
      </ExpoCamera.CameraView>
    </View>
    );
  };

  const renderPicture = () => (
    <View style={{ width: width, height: height * 0.8}}>
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
          disabled={isProcessingImage}
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

  // Loading screen overlay
  const renderLoadingOverlay = () => {
    if (!isIdentifying && !isProcessingImage) return null;
    
    return (
      <View className='absolute inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50'>
        <View className='bg-white p-6 rounded-lg mx-4'>
          <Text className='text-black text-center text-lg mb-2'>
            {isProcessingImage ? 'Processing Image...' : 'Identifying Plant...'}
          </Text>
          {loadingMessage && (
            <Text className='text-gray-600 text-center'>
              {loadingMessage}
            </Text>
          )}
        </View>
      </View>
    );
  };

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
        {showCamera ? (
          <View className="flex-1">
            {imageUris[currentImageIndex] ? renderPicture() : renderCamera()}
            <View className="px-4 mt-1 space-y-4">
              <Pressable 
                className={`p-4 rounded-xl ${imageUris.some(uri => uri !== null) ? 'bg-secondary-medium' : 'bg-gray-400'}`}
                onPress={handleIdentify}
                disabled={!imageUris.some(uri => uri !== null) || isIdentifying || isProcessingImage}
              >
                <Text className="text-white text-center text-lg font-semibold">
                  {isIdentifying ? 'Identifying...' : `Identify ${imageUris.filter(uri => uri !== null).length}/5 photos`}
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
                disabled={isIdentifying || isProcessingImage}
              >
                <Text className="text-text-primary text-center">
                  Search your plant instead
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
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
              flash={Platform.OS === 'ios' ? flashMode : undefined}
              enableTorch={Platform.OS === 'android' ? flashMode === 'on' : undefined}
            >
              {/* Flash button */}
              <View className='absolute top-10 right-4'>
                <Pressable 
                  onPress={toggleFlash}
                  className='bg-black bg-opacity-50 p-3 rounded-full'
                  disabled={isProcessingImage}
                >
                  <AntDesign name="bulb1" size={24} color={flashMode === 'off' ? 'white' : 'yellow'} />
                </Pressable>
                <Text className='text-white text-xs text-center mt-1 bg-black bg-opacity-50 px-2 py-1 rounded'>
                  {flashMode.toUpperCase()} ({Platform.OS})
                </Text>
              </View>
              
              <View className='absolute bottom-10 w-full flex-row justify-around'>
                <Pressable 
                  onPress={() => setShowReplaceCamera(false)}
                  className='bg-secondary-medium p-4 rounded-full'
                  disabled={isProcessingImage}
                >
                  <AntDesign name="close" size={32} color="white" />
                </Pressable>
                <Pressable 
                  onPress={handleReplacePicture}
                  className='w-20 h-20 rounded-full bg-white border-4 border-secondary-medium'
                  disabled={isProcessingImage}
                >
                  <View className='flex-1 rounded-full m-1 bg-secondary-medium' />
                </Pressable>
              </View>
              {renderLoadingOverlay()}
            </ExpoCamera.CameraView>
          </View>
        </Modal>
        
        {/* Loading overlay */}
        {renderLoadingOverlay()}
        {isIdentifying && <LoadingScreen />}
      </View>
    </SafeAreaView>
  )
}

export default identify;