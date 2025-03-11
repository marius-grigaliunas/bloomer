import { View, Text, ImageBackground, Image, ImageProps } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { images } from '@/constants/images'
import { icons } from '@/constants/icons'

interface TabIconProps {
    focused: boolean;
    icon: ImageProps;
    title: string;
}

const TabIcon = ({focused, icon, title} : TabIconProps) => {
    if(focused) {
        return (
            <ImageBackground
                source={images.highlight}
                className='flex flex-row w-full flex-1 min-w-[112px] min-h-14 
                mt-4 justify-center items-center rounded-full overflow-hidden'
            >
                <Image source={icon} tintColor="#151312" className='size-5'/>
                <Text className=' text-base font-semibold ml-2' >
                    {title}
                </Text>
            </ImageBackground>
        )
    } else {
        return (
            <View className='size-full justify-center items-center mt-4 rounded-full'>
                <Image source={icon} tintColor="#A8B5DB" className='size-5'/>
            </View>
        )
    }
}

const _layout = () => {
  return (
    <Tabs>
        <Tabs.Screen
            name='index'
            options={{
                title: "",
                headerShown: false,
                tabBarIcon: ({focused}) => (
                    <TabIcon focused={focused} title='Home' icon={icons.home}/>
                )
            }}
        />
        <Tabs.Screen
            name='care'
            options={{
                title: "",
                headerShown: false,
                tabBarIcon: ({focused}) => (
                    <TabIcon focused={focused} title='Care' icon={icons.arrow}/>
                )
            }}
        />
        <Tabs.Screen
            name='identify'
            options={{
                title: "",
                headerShown: false,
                tabBarIcon: ({focused}) => (
                    <TabIcon focused={focused} title='Identify' icon={icons.search}/>
                )
            }}
        />
        <Tabs.Screen
            name='profile'
            options={{
                title: "",
                headerShown: false,
                tabBarIcon: ({focused}) => (
                    <TabIcon focused={focused} title='Profile' icon={icons.person}/>
                )
            }}
        />
    </Tabs>
  )
}

export default _layout