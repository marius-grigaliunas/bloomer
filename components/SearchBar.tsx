import { View, Text, Image, TextInput } from 'react-native'
import React from 'react'
import { icons } from '@/constants/icons'
import colors from '@/constants/colors'

interface SearchBarProps {
    pressed?: () => void;
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void; 
}

const SearchBar = ({pressed, placeholder, value, onChangeText}: SearchBarProps) => {
  return (
    <View className='flex-row items-center bg-background-surface rounded-full px-5 py-4 shadow-2xl shadow-secondary-deep'>
      <Image source={icons.search} className='size-5' resizeMode='contain' tintColor={colors.secondary.medium} />
      <TextInput 
        onPress={pressed}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={colors.secondary.medium}
        className='flex-1 ml-2 text-secondary-medium'
      />
    </View>
  )
}

export default SearchBar