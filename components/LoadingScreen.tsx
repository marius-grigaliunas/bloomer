import { View, ActivityIndicator, Image } from 'react-native';
import React from 'react';
import colors from '@/constants/colors';
import RotatingImage from './RotatingImage';

export const LoadingScreen = () => (
  <View style={{ 
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    justifyContent: 'center', 
    alignItems: 'center',
    zIndex: 1000
  }}>
    <RotatingImage
        image={require("../assets/images/logo-noname-500x500.png")}
        width={50}
        height={50}
    />
  </View>
);

export default LoadingScreen