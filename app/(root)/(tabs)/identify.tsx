import { View, Text } from 'react-native'
import React, { useState } from 'react'
import SearchBar from '@/components/SearchBar'

const identify = () => {

  const [searchQuery, setSearchQuery] = useState("");

  return (
    <View className='flex justify-center items-center w-full h-full bg-background-primary'>
      <SearchBar
        placeholder='Search for your plant'
        value={searchQuery}
        onChangeText={(text: string) => setSearchQuery(text)}
      />
      <Text
        className='text-3xl text-text-primary'
      >
        {searchQuery}
      </Text>
    </View>
  )
}

export default identify