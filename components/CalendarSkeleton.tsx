import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';

const CalendarSkeleton = () => {
  const fadeAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const pulse = () => {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start(() => pulse());
    };
    pulse();
  }, [fadeAnim]);

  return (
    <View className="w-full">
      {/* Header skeleton */}
      <View className="flex flex-row justify-center w-screen h-16 rounded-2xl items-center bg-background-surface mt-2">
        <Animated.View 
          style={{ opacity: fadeAnim }}
          className="bg-gray-300 w-10 h-10 rounded-full" 
        />
        <View className="w-64 flex flex-row justify-center">
          <Animated.View 
            style={{ opacity: fadeAnim }}
            className="w-8/12 h-8 bg-gray-300 rounded mx-2" 
          />
          <Animated.View 
            style={{ opacity: fadeAnim }}
            className="w-4/12 h-8 bg-gray-300 rounded mx-2" 
          />
        </View>
        <Animated.View 
          style={{ opacity: fadeAnim }}
          className="bg-gray-300 w-10 h-10 rounded-full" 
        />
      </View>
      
      {/* Calendar grid skeleton */}
      <View className="flex flex-row flex-wrap w-full mt-2">
        {/* Header days */}
        {Array.from({ length: 7 }).map((_, index) => (
          <View key={`header-${index}`} className="w-[14.28%] py-4 px-2 flex justify-start items-center border border-gray-200">
            <Animated.View 
              style={{ opacity: fadeAnim }}
              className="w-8 h-4 bg-gray-300 rounded" 
            />
          </View>
        ))}
        
        {/* Calendar days */}
        {Array.from({ length: 35 }).map((_, index) => (
          <View key={`day-${index}`} className="w-[14.28%] py-4 px-2 flex justify-start items-center border border-gray-200 relative">
            <Animated.View 
              style={{ opacity: fadeAnim }}
              className="w-6 h-6 bg-gray-300 rounded" 
            />
            {/* Random watering indicators */}
            {Math.random() > 0.7 && (
              <Animated.View 
                style={{ opacity: fadeAnim }}
                className="absolute bottom-[2px] w-full h-4 bg-gray-300 rounded" 
              />
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

export default CalendarSkeleton;
