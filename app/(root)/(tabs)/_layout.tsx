import { View, Text, ImageBackground, Image, ImageProps } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { images } from '@/constants/images'
import { icons } from '@/constants/icons'
import colors from '@/constants/colors'

interface TabIconProps {
    focused: boolean;
    icon: ImageProps;
    title: string;
}

const TabIcon = ({focused, icon, title} : TabIconProps) => {
    if(focused) {
        return (
            <View
                className='flex flex-row w-full flex-1 min-w-[112px] min-h-16 
                mt-4 justify-center items-center rounded-full overflow-hidden
                bg-primary border border-accent-leaf'
            >
                <Image source={icon} tintColor="#151312" className='size-5'/>
                <Text className=' text-base font-semibold ml-2' >
                    {title}
                </Text>
            </View>
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
    <Tabs
        screenOptions={{
            tabBarShowLabel: false,
            tabBarItemStyle: {
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center'
            },
            tabBarStyle: {
                backgroundColor: colors.primary.muted,
                borderRadius: 50,
                marginHorizontal: 20,
                marginBottom: 20,
                height: 52,
                position: 'absolute',
                overflow: "hidden",
                borderWidth: 1,
                borderColor: colors.accent.leaf
            }
        }}
    >
        <Tabs.Screen
            name='index'
            options={{
                title: "Home",
                headerShown: false,
                tabBarIcon: ({focused}) => (
                    <TabIcon focused={focused} title='Home' icon={icons.home}/>
                )
            }}
        />
        <Tabs.Screen
            name='care'
            options={{
                title: "Care",
                headerShown: false,
                tabBarIcon: ({focused}) => (
                    <TabIcon focused={focused} title='Care' icon={icons.arrow}/>
                )
            }}
        />
        <Tabs.Screen
            name='identify'
            options={{
                title: "Identify",
                headerShown: false,
                tabBarIcon: ({focused}) => (
                    <TabIcon focused={focused} title='Identify' icon={icons.search}/>
                )
            }}
        />
        <Tabs.Screen
            name='profile'
            options={{
                title: "Profile",
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