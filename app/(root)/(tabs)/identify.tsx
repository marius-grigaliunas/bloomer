import { View, Text, Button, Pressable, Image, SafeAreaView, Alert, Modal, TouchableOpacity, Platform, Animated } from 'react-native'
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
  const [showErrorModal, setShowErrorModal] = useState(false);

  // Animation values
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  // Flash toggle function
  const toggleFlash = () => {
    setFlashMode(prevMode => {
      const newMode = prevMode === 'off' ? 'on' : 'off';
      console.log('Flash mode changed from', prevMode, 'to', newMode, 'Platform:', Platform.OS);
      return newMode;
    });
  };

  // Animate progress when photos are taken
  useEffect(() => {
    const photoCount = imageUris.filter(uri => uri !== null).length;
    const progress = photoCount / maxImages;
    
    Animated.timing(progressAnimation, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [imageUris, progressAnimation]);

  // Button press animation
  const animateButtonPress = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
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
      // Get image info first to check original size and dimensions
      const imageInfo = await FileSystem.getInfoAsync(imageUri);
      const originalSize = imageInfo.exists ? imageInfo.size : 0;
      
      // Get the original image dimensions to calculate proper resize
      const originalImage = await Manipulator.manipulateAsync(imageUri, [], { base64: false });
      const originalDimensions = await Manipulator.manipulateAsync(originalImage.uri, [], { 
        base64: false,
        format: Manipulator.SaveFormat.JPEG
      });
      
      // Calculate new dimensions while preserving aspect ratio
      const originalWidth = originalDimensions.width;
      const originalHeight = originalDimensions.height;
      const aspectRatio = originalWidth / originalHeight;
      
      let newWidth, newHeight;
      
      if (aspectRatio > 1) {
        // Landscape: width is the limiting factor
        newWidth = Math.min(originalWidth, IMAGE_CONFIG.maxWidth);
        newHeight = Math.round(newWidth / aspectRatio);
      } else {
        // Portrait or square: height is the limiting factor
        newHeight = Math.min(originalHeight, IMAGE_CONFIG.maxHeight);
        newWidth = Math.round(newHeight * aspectRatio);
      }
      
      // Process the image: resize while maintaining aspect ratio
      const processedImage = await Manipulator.manipulateAsync(
        imageUri,
        [
          { resize: { width: newWidth, height: newHeight } }
        ],
        {
          compress: IMAGE_CONFIG.quality,
          format: IMAGE_CONFIG.format,
          base64: false
        }
      );

      // Get processed image size for logging
      const processedInfo = await FileSystem.getInfoAsync(processedImage.uri);
      const processedSize = processedInfo.exists ? processedInfo.size : 0;

      console.log(`Image processed: ${Math.round(originalSize / 1024)}KB -> ${Math.round(processedSize / 1024)}KB (${originalWidth}x${originalHeight} -> ${newWidth}x${newHeight})`);
      
      return processedImage.uri;
    } catch (error) {
      console.error('Error processing image:', error);
      throw error;
    }
  }, []);

  const takePicture = async () => {
    try {
      if (!ref.current || !ref.current.takePictureAsync) {
        throw new Error("Camera reference is not properly initialized.");
      }

      animateButtonPress();
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

        // Update state without causing a re-render that shows white screen
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
    // Add a small delay to ensure camera is properly initialized
    setTimeout(() => {
      if (ref.current) {
        console.log('Camera reference is ready for replacement');
      }
    }, 500);
  }

  const handleReplacePicture = async () => {
    try {
      if (!ref.current || !ref.current.takePictureAsync) {
        throw new Error("Camera reference is not properly initialized.");
      }

      setIsProcessingImage(true);
      setLoadingMessage("Taking photo...");

      // Take photo with optimized settings and retry mechanism
      let photo;
      let retryCount = 0;
      const maxRetries = 3;
      
      while (retryCount < maxRetries) {
        try {
          photo = await ref.current.takePictureAsync({
            quality: 0.8,
            base64: false,
            skipProcessing: false
          });
          
          if (photo?.uri) {
            break; // Success, exit retry loop
          }
        } catch (captureError) {
          console.log(`Camera capture attempt ${retryCount + 1} failed:`, captureError);
          retryCount++;
          
          if (retryCount >= maxRetries) {
            throw new Error("Failed to capture image after multiple attempts");
          }
          
          // Wait a bit before retrying
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      if (photo?.uri) {
        setLoadingMessage("Processing image...");
        
        // Delete existing file
        const oldUri = imageUris[currentImageIndex];
        if (oldUri) {
          try {
            const fileInfo = await FileSystem.getInfoAsync(oldUri);
            if (fileInfo.exists) {
              await FileSystem.deleteAsync(oldUri, { idempotent: true });
            }
          } catch (error) {
            console.log('Error deleting old file:', error);
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

        // Update state without causing a re-render that shows white screen
        setImageUris(prevUris => {
          const newUris = [...prevUris];
          newUris[currentImageIndex] = finalUri;
          return newUris;
        });
        setShowReplaceCamera(false);
      } else {
        throw new Error("Photo URI is not available.");
      }
    } catch (error) {
      console.error("Error replacing picture:", error);
      let errorMessage = "Failed to replace picture. Please try again.";
      
      if (error instanceof Error) {
        if (error.message.includes("Camera reference is not properly initialized")) {
          errorMessage = "Camera is not ready. Please close and reopen the camera.";
        } else if (error.message.includes("Photo URI is not available")) {
          errorMessage = "Failed to capture image. Please try again.";
        } else {
          errorMessage = error.message;
        }
      }
      
      Alert.alert("Error", errorMessage);
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
      setShowErrorModal(false);
      
      const validImageUris = imageUris.filter((uri): uri is string => uri !== null);
      
      if (validImageUris.length === 0) {
        throw new Error('No images to identify');
      }

      setLoadingMessage("Analyzing images...");
      
      // Start plant identification
      const results = await identifyPlants(validImageUris);
      
      // Check if the result is an error string
      if (typeof results === 'string') {
        console.error('Plant identification returned error:', results);
        setIdentificationError(results);
        setShowErrorModal(true);
        return;
      }
      
      // Check confidence level - treat 0 confidence as failed identification
      if (results.confidence === 0 || results.confidence < 0.01) {
        console.warn('Plant identification failed - confidence too low:', results.confidence);
        setIdentificationError('Plant could not be identified with sufficient confidence. Please try taking clearer photos or different angles.');
        setShowErrorModal(true);
        return;
      }

      setLoadingMessage("Getting care information...");
      
      const scientificName = results.bestMatch;
      const plantCommonNames = results.commonNames ?? [''];
      
      // Get care info from the deepseek service
      const careInfo = await getPlantCareInfo(scientificName, plantCommonNames);
      
      // Check if care info request failed
      let finalCareInfo = null;
      if (typeof careInfo === 'string') {
        console.warn('Care info request failed:', careInfo);
        // Continue with identification but without care info
      } else {
        finalCareInfo = careInfo;
      }
      
      usePlantInformation.getState().setIdentifiedPlant({
        scientificName,
        commonNames: plantCommonNames,
        confidence: results.confidence,
        careInfo: finalCareInfo,
        imageUri: validImageUris[0]
      })

      router.push("/plants/identifiedPlant")

    } catch (error) {
      console.error('Identification failed:', error);
      let errorMessage = 'Failed to identify plants';
      
      if (error instanceof Error) {
        if (error.message.includes('404')) {
          errorMessage = 'Plant identification service is currently unavailable. Please check your internet connection and try again.';
        } else if (error.message.includes('401') || error.message.includes('403')) {
          errorMessage = 'Authentication error. Please contact support.';
        } else if (error.message.includes('500')) {
          errorMessage = 'Server error. Please try again later.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setIdentificationError(errorMessage);
      setShowErrorModal(true);
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
      setShowErrorModal(false);

    } catch (error) {
      console.error('Error resetting identification:', error);
    }
  };

  const retryWithNewPhotos = async () => {
    await resetIdentification();
    setShowErrorModal(false);
  };

  const retakeAllPhotos = async () => {
    await resetIdentification();
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

  // Corner bracket component for viewfinder
  const CornerBracket = ({ position }: { position: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' }) => {
    const getCornerStyle = () => {
      const baseStyle = 'absolute w-8 h-8';
      switch (position) {
        case 'topLeft':
          return `${baseStyle} top-16 left-8 border-l-2 border-t-2 border-primary-medium`;
        case 'topRight':
          return `${baseStyle} top-16 right-8 border-r-2 border-t-2 border-primary-medium`;
        case 'bottomLeft':
          return `${baseStyle} bottom-24 left-8 border-l-2 border-b-2 border-primary-medium`;
        case 'bottomRight':
          return `${baseStyle} bottom-24 right-8 border-r-2 border-b-2 border-primary-medium`;
      }
    };

    return <View className={getCornerStyle()} />;
  };

  // Progress circle component
  const ProgressCircle = () => {
    const photoCount = imageUris.filter(uri => uri !== null).length;
    const progress = photoCount / maxImages;
    
    return (
      <View className="items-center justify-center">
        <View className="w-16 h-16 rounded-full bg-secondary-medium items-center justify-center">
          <Animated.View 
            className="absolute w-16 h-16 rounded-full"
            style={{
              backgroundColor: colors.primary.medium,
              transform: [{ scale: progressAnimation }],
            }}
          />
          <Text className="text-white text-sm font-semibold z-10">
            {photoCount}/{maxImages}
          </Text>
        </View>
      </View>
    );
  };

  // Thumbnail strip component
  const ThumbnailStrip = () => {
    return (
      <View className="flex-row justify-between px-5 mb-6">
        {imageUris.map((uri, index) => (
          <View key={index} className="items-center">
            <View className="w-14 h-14 rounded-lg overflow-hidden border-2 border-secondary-medium bg-background-surface">
              {uri ? (
                <Image 
                  source={{ uri }} 
                  className="w-full h-full"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-full h-full bg-background-surface items-center justify-center">
                  <Text className="text-text-secondary text-xs">+</Text>
                </View>
              )}
            </View>
            <Text className="text-text-secondary text-xs mt-1">
              {index + 1}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderCamera = () => {
    console.log('Rendering camera with flash mode:', flashMode);
    return (
      <View style={{ flex: 1, backgroundColor: '#F8F8F8', minHeight: 400 }}>
        <ExpoCamera.CameraView 
          style={{ flex: 1, width: '100%', height: '100%' }}
          facing={'back'}
          ref={ref}
          mode={'picture'}
          flash={Platform.OS === 'ios' ? flashMode : undefined}
          enableTorch={Platform.OS === 'android' ? flashMode === 'on' : undefined}
        >

          {/* Processing message - positioned at top */}
          {isProcessingImage && (
            <View 
              style={{ 
                position: 'absolute',
                top: 16,
                left: 16,
                right: 16,
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                zIndex: 10,
              }}
              className="rounded-lg p-3"
            >
              <Text className="text-white text-center text-sm font-medium">{loadingMessage}</Text>
            </View>
          )}

          {/* Flash button */}
          <View className="absolute top-8 left-4">
            <Pressable 
              onPress={toggleFlash}
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
              className="p-3 rounded-full"
              disabled={isProcessingImage}
            >
              <AntDesign name="bulb1" size={24} color={flashMode === 'off' ? 'white' : 'yellow'} />
            </Pressable>
          </View>
          
          {/* Progress indicator */}
          <View className="absolute top-8 right-4">
            <ProgressCircle />
          </View>
          
          {/* Camera button */}
          <View className="absolute bottom-16 w-full items-center">
            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
              <Pressable 
                onPress={takePicture}
                className={`w-20 h-20 rounded-full items-center justify-center shadow-lg ${
                  isProcessingImage ? 'bg-gray-400' : 'bg-primary-medium'
                }`}
                disabled={isProcessingImage}
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.15,
                  shadowRadius: 8,
                  elevation: 6,
                }}
              >
                <AntDesign 
                  name="camera" 
                  size={32} 
                  color={isProcessingImage ? '#666666' : 'white'} 
                />
              </Pressable>
            </Animated.View>
          </View>
        </ExpoCamera.CameraView>
      </View>
    );
  };

  const renderPicture = () => (
    <View className="flex-1 bg-background-primary">
      {imageUris[currentImageIndex] && (
        <View className="flex-1 items-center justify-center">
          <Image 
            source={{ uri: imageUris[currentImageIndex] }}
            style={{
              width: '100%',
              height: '100%',
            }}
            resizeMode='cover'
          />
        </View>
      )}
      <View className="absolute bottom-16 w-full flex-row justify-around px-8">
        <Pressable 
          className="bg-primary-medium p-4 rounded-full"
          onPress={() => {
            setCurrentImageIndex(prevIndex => Math.max(0, prevIndex - 1));
          }}
          disabled={currentImageIndex === 0}
        >
          <AntDesign name="arrowleft" size={24} color="white" />
        </Pressable>
        <Pressable 
          className="bg-primary-medium p-4 rounded-full"
          onPress={replacePicture}
          disabled={isProcessingImage}
        >
          <AntDesign name="camera" size={24} color="white" />
        </Pressable>
        <Pressable 
          className="bg-primary-medium p-4 rounded-full"
          onPress={() => {
            setCurrentImageIndex(prevIndex => Math.min(maxImages - 1, prevIndex + 1));
          }}
          disabled={currentImageIndex === maxImages - 1}
        >
          <AntDesign name="arrowright" size={24} color="white" />
        </Pressable>
      </View>
      <View className="absolute top-16 right-5">
        <ProgressCircle />
      </View>
    </View>
  );



  // Check camera permission
  console.log('Camera permission status:', cameraPermission);
  
  if (!cameraPermission) {
    return (
      <View className="flex-1 items-center justify-center bg-background-primary">
        <Text className="text-3xl text-text-primary">Loading permissions...</Text>
      </View>
    );
  }

  if (!cameraPermission.granted) {
    return (
      <View className="flex-1 items-center justify-center bg-background-primary">
        <Text className="text-3xl text-text-primary mb-4">We need camera permissions</Text>
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
    <SafeAreaView className="flex-1 bg-background-primary">
      <View className="flex-1">
        {showCamera ? (
          <View className="flex-1">
            {/* Header Section */}
            <View className="px-5 pt-16 pb-6">
              <Text className="text-3xl font-bold text-primary-medium text-center">
                Identify Plant
              </Text>
            </View>

            {/* Camera or Picture View - Takes most of the screen */}
            <View className="flex-1">
              {imageUris[currentImageIndex] && !isProcessingImage ? renderPicture() : renderCamera()}
            </View>

                         {/* Bottom Section with Thumbnails and Button */}
             <View className="px-5 pb-6 pt-4">
              {
              // <ThumbnailStrip /> {{{{{}}}}}}
              }

               {/* Retake All Photos Button - Only show when all 5 photos are taken */}
               {imageUris.every(uri => uri !== null) && (
                 <View className="mb-3">
                   <Pressable 
                     className="p-3 rounded-xl bg-gray-200 border border-gray-300"
                     onPress={retakeAllPhotos}
                     disabled={isIdentifying || isProcessingImage}
                   >
                     <Text className="text-text-primary text-center text-base font-medium">
                       Retake All Photos
                     </Text>
                   </Pressable>
                 </View>
               )}

               {/* Identify Button */}
               <View className="mb-4">
                 <Pressable 
                   className={`p-4 rounded-xl ${imageUris.some(uri => uri !== null) ? 'bg-primary-medium' : 'bg-gray-400'}`}
                   onPress={handleIdentify}
                   disabled={!imageUris.some(uri => uri !== null) || isIdentifying || isProcessingImage}
                 >
                   <Text className="text-white text-center text-lg font-semibold">
                     {isIdentifying ? 'Identifying...' : `Identify ${imageUris.filter(uri => uri !== null).length}/5 photos`}
                   </Text>
                 </Pressable>
                 {identificationError && (
                   <Text className="text-danger text-center mt-2">
                     {identificationError}
                   </Text>
                 )}
               </View>
             </View>
          </View>
        ) : (
          <View className="flex-1 mt-10">
            <Pressable 
              className="bg-primary-medium p-4 rounded-xl mb-4"
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
          <SafeAreaView className="flex-1 bg-background-primary">
            <View className="flex-1">
              {/* Header */}
              <View className="px-5 pt-4 pb-4 flex-row items-center justify-between">
                <Pressable 
                  onPress={() => setShowReplaceCamera(false)}
                  className="bg-primary-medium p-3 rounded-full"
                >
                  <AntDesign name="close" size={20} color="white" />
                </Pressable>
                <Text className="text-lg font-semibold text-text-primary">Retake Photo</Text>
                <View className="w-11" />
              </View>

              {/* Camera View */}
              <View className="flex-1">
                <ExpoCamera.CameraView 
                  style={{ flex: 1, width: '100%', height: '100%' }}
                  facing={'back'}
                  ref={ref}
                  mode={'picture'}
                  flash={Platform.OS === 'ios' ? flashMode : undefined}
                  enableTorch={Platform.OS === 'android' ? flashMode === 'on' : undefined}
                >
                  {/* Corner brackets for viewfinder */}
                  <CornerBracket position="topLeft" />
                  <CornerBracket position="topRight" />
                  <CornerBracket position="bottomLeft" />
                  <CornerBracket position="bottomRight" />

                  {/* Flash button */}
                  <View className="absolute top-8 left-4">
                    <Pressable 
                      onPress={toggleFlash}
                      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                      className="p-3 rounded-full"
                      disabled={isProcessingImage}
                    >
                      <AntDesign name="bulb1" size={24} color={flashMode === 'off' ? 'white' : 'yellow'} />
                    </Pressable>
                  </View>
                  
                                     {/* Camera button */}
                   <View className="absolute bottom-16 w-full items-center">
                     <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                       <Pressable 
                         onPress={handleReplacePicture}
                         className={`w-20 h-20 rounded-full items-center justify-center shadow-lg ${
                           isProcessingImage ? 'bg-gray-400' : 'bg-primary-medium'
                         }`}
                         disabled={isProcessingImage}
                         style={{
                           shadowColor: '#000',
                           shadowOffset: { width: 0, height: 4 },
                           shadowOpacity: 0.15,
                           shadowRadius: 8,
                           elevation: 6,
                         }}
                       >
                         <AntDesign 
                           name="camera" 
                           size={32} 
                           color={isProcessingImage ? '#666666' : 'white'} 
                         />
                       </Pressable>
                     </Animated.View>
                     
                    {/* Camera ready indicator */}
                    {!isProcessingImage && (
                      <Text 
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                        className="text-white text-sm mt-2 text-center px-3 py-1 rounded-full"
                      >
                        Tap to capture
                      </Text>
                    )}
                   </View>

                  {/* Processing message */}
                  {isProcessingImage && (
                    <View 
                      style={{ 
                        position: 'absolute',
                        top: 16,
                        left: 16,
                        right: 16,
                        backgroundColor: 'rgba(0, 0, 0, 0.75)',
                      }}
                      className="rounded-lg p-3"
                    >
                      <Text className="text-white text-center text-sm font-medium">{loadingMessage}</Text>
                    </View>
                  )}
                </ExpoCamera.CameraView>
              </View>
            </View>
          </SafeAreaView>
        </Modal>
        
        {/* Loading overlay for identification */}
        {isIdentifying && (
          <View 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 50,
            }}
            className="items-center justify-center"
          >
            <View className="bg-background-surface rounded-xl p-6 mx-4 items-center">
              <Text className="text-text-primary text-lg font-semibold mb-2">
                Identifying Plant...
              </Text>
              <Text className="text-text-secondary text-sm text-center">
                {loadingMessage || "Analyzing your photos"}
              </Text>
            </View>
          </View>
        )}

        {/* Error Modal */}
        <Modal
          visible={showErrorModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowErrorModal(false)}
        >
          <View 
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            className="flex-1 items-center justify-center"
          >
            <View 
              style={{ maxWidth: 384 }}
              className="bg-background-surface rounded-xl p-6 mx-4 items-center"
            >
              <View className="w-16 h-16 bg-danger rounded-full items-center justify-center mb-4">
                <AntDesign name="exclamationcircleo" size={32} color="white" />
              </View>
              
              <Text className="text-text-primary text-lg font-semibold mb-2 text-center">
                Identification Failed
              </Text>
              
              <Text className="text-text-secondary text-sm text-center mb-6">
                {identificationError}
              </Text>
              
              <View className="flex-row">
                <Pressable 
                  className="flex-1 bg-gray-300 p-3 rounded-lg mr-2"
                  onPress={() => setShowErrorModal(false)}
                >
                  <Text className="text-text-primary text-center font-medium">
                    Cancel
                  </Text>
                </Pressable>
                
                <Pressable 
                  className="flex-1 bg-primary-medium p-3 rounded-lg ml-2"
                  onPress={retryWithNewPhotos}
                >
                  <Text className="text-white text-center font-medium">
                    Take New Photos
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  )
}

export default identify;