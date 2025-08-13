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
      <View className="flex flex-row justify-center items-center w-full h-16 mb-4">
        <Animated.View 
          style={{ opacity: fadeAnim }}
          className="w-10 h-10 rounded-full bg-gray-200" 
        />
        <View className="flex-1 flex flex-row justify-center items-center">
          <Animated.View 
            style={{ opacity: fadeAnim }}
            className="w-24 h-8 bg-gray-200 rounded mr-2" 
          />
          <Animated.View 
            style={{ opacity: fadeAnim }}
            className="w-16 h-8 bg-gray-200 rounded" 
          />
        </View>
        <Animated.View 
          style={{ opacity: fadeAnim }}
          className="w-10 h-10 rounded-full bg-gray-200" 
        />
      </View>
      
      {/* Calendar grid skeleton */}
      <View className="flex flex-row flex-wrap w-full">
        {/* Header days */}
        {Array.from({ length: 7 }).map((_, index) => (
          <View key={`header-${index}`} className="w-[14.28%] py-3 px-1 flex justify-center items-center">
            <Animated.View 
              style={{ opacity: fadeAnim }}
              className="w-8 h-4 bg-gray-200 rounded" 
            />
          </View>
        ))}
        
        {/* Calendar days */}
        {Array.from({ length: 35 }).map((_, index) => (
          <View key={`day-${index}`} className="w-[14.28%] py-3 px-1 flex justify-center items-center relative">
            <Animated.View 
              style={{ opacity: fadeAnim }}
              className="w-6 h-6 bg-gray-200 rounded" 
            />
            {/* Random watering indicators */}
            {Math.random() > 0.7 && (
              <Animated.View 
                style={{ opacity: fadeAnim }}
                className="absolute bottom-1 w-2 h-2 bg-gray-200 rounded-full" 
              />
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

export default CalendarSkeleton;
