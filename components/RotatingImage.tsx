import React, { useEffect, useRef } from "react";
import { View, Image, Animated, Easing, ImageProps } from "react-native";
import { images } from '../constants/images';

interface RotatingImageProps {
    image: ImageProps,
    width: number,
    height: number
}

const RotatingImage = ({ image, width = 100, height = 100 } : RotatingImageProps) => {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const rotateAnimation = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 2000, // 2 seconds per full rotation
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    rotateAnimation.start();

    return () => rotateAnimation.stop(); // Cleanup on unmount
  }, [rotation]);

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Animated.Image
        source={image}
        style={{
            width,
            height,
            transform: [{ rotate: rotateInterpolate }],
        }}
      />
    </View>
  );
};

export default RotatingImage