import { TouchableOpacity, View, Text } from 'react-native';
import { Svg, Rect, Defs, LinearGradient, Stop } from 'react-native-svg';

interface GoogleButtonProps {
    onPress: () => void; 
}

const GoogleButton = ({ onPress }: GoogleButtonProps) => {
    return (
      <View className="relative w-80 h-20">
        <Svg height="100%" width="100%" style={{ position: 'absolute' }}>
          <Defs>
            <LinearGradient 
              id="border" 
              x1="0%" 
              y1="0%" 
              x2="100%" 
              y2="0%" 
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0%" stopColor="#ff0000" />
              <Stop offset="25%" stopColor="#00ff00" />
              <Stop offset="50%" stopColor="#0000ff" />
              <Stop offset="75%" stopColor="#ffff00" />
              <Stop offset="100%" stopColor="#ff0000" />
            </LinearGradient>
          </Defs>
          <Rect
            x="2"
            y="2"
            width={275}
            height={65}
            stroke="url(#border)"
            strokeWidth="4"
            rx="40"
            ry="40"
            fill="none"
          />
        </Svg>
        
        <TouchableOpacity 
          onPress={onPress}
          className="bg-secondary-medium rounded-full w-full h-full flex justify-center items-center"
        >
          <Text className="text-2xl text-white">Continue with google</Text>
        </TouchableOpacity>
      </View>
    );
  };

export default GoogleButton