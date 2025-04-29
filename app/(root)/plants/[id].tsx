import { View, Text, ScrollView, TouchableOpacity, Alert, Dimensions, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '@/constants/colors';

import { useGlobalContext } from '@/lib/globalProvider';
import LoadingScreen from '@/components/LoadingScreen';
const { width, height } = Dimensions.get('window');

const PlantDetails = () => {
  const { id } = useLocalSearchParams();
  const { isLoggedIn, user: contextUser, refetch} = useGlobalContext();
  const [ loading, setLoading] = useState(false);

  useEffect (() => {
  }, [])

  return (
    <SafeAreaView style={{ width: width,flex: 1, backgroundColor: colors.background.primary }}>
      <ScrollView className="w-screen flex-1">

      </ScrollView>
    </SafeAreaView>
  )
}

export default PlantDetails