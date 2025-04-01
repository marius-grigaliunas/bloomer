import { View, Text, ScrollView } from 'react-native'
import React, { ReactNode, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CalendarGenerator from '@/components/CalendarGenerator';

const care = () => {

    const getFormattedFullDate = (date: Date) : string => {
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
          
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        const day = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();
        return `${days[date.getDay()]}, ${day} ${months[month]} ${year}`;
    };

    return (
    <SafeAreaView className='bg-background-primary flex justify-center items-center h-full'>
      <ScrollView contentContainerStyle={{height: 'auto'}}>
        <View className="flex flex-row justify-around w-screen h-24  
          rounded-2xl items-center bg-background-surface
          shadow-lg shadow-amber-50">
          <Text className="text-text-primary text-2xl mx-4">
            Schedule
          </Text>
          <Text className="text-text-primary text-2xl mx-4">
            {getFormattedFullDate(new Date())}
          </Text>
        </View>
        <CalendarGenerator />
        <View className="h-72 bg-background-primary rounded-2xl">

        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default care