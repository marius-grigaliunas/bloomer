import { View, Text, Image, TextInput } from 'react-native'
import React from 'react'
import { icons } from '@/constants/icons'
import colors from '@/constants/colors'

interface SearchBarProps {
    pressed?: () => {};
    placeholder: string;
}

const SearchBar = ({pressed, placeholder}: SearchBarProps) => {
  return (
    <View className='flex-row items-center bg-background-surface rounded-full  px-5 py-4'>
      <Image source={icons.search} className='size-5' resizeMode='contain' tintColor={colors.secondary.medium} />
      <TextInput 
        onPress={pressed}
        placeholder={placeholder}
        value=''
        onChangeText={() => {}}
        placeholderTextColor={colors.secondary.medium}
        className='flex-1 ml-2 text-white'
      />
    </View>
  )
}

export default SearchBar