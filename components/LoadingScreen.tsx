import { View, ActivityIndicator, Image } from 'react-native';
import React from 'react';
import colors from '@/constants/colors';
import RotatingImage from './RotatingImage';

export const LoadingScreen = () => (
  <View style={{ 
    flex: 1, 
    backgroundColor: '#121F12',
    justifyContent: 'center', 
    alignItems: 'center' 
  }}>
    <RotatingImage
        image={require("../assets/images/logo-noname-500x500.png")}
        width={50}
        height={50}
    />
  </View>
);

export default LoadingScreen