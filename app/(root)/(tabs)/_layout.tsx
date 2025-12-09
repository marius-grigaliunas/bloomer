import { View, Text, ImageBackground, Image, ImageProps } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { images } from '@/constants/images'
import { icons } from '@/constants/icons'
import colors from '@/constants/colors'
import { AntDesign, Entypo, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { translate } from '@/lib/i18n/config'

interface TabIconProps {
    focused: boolean;
    icon: React.ReactNode;
    title: string;
}

const TabIcon = ({focused, icon, title} : TabIconProps) => {
    return (
        <View className='flex flex-col justify-center items-center py-1 px-1'>
            <View className='h-8'>
                {icon}
            </View>
            <Text 
                className={`text-md font-medium text-center ${
                    focused ? 'text-primary-medium' : 'text-black'
                }`}
                numberOfLines={1}
                style={{ minWidth: 70 }}
            >
                {title}
            </Text>
            {focused && (
                <View 
                    className='w-8 h-0.5 rounded-full'
                    style={{ backgroundColor: colors.primary.medium }}
                />
            )}
        </View>
    )
}

const _layout = () => {
  const insets = useSafeAreaInsets();
  
  return (
    <Tabs
        screenOptions={{
            tabBarShowLabel: false,
            tabBarItemStyle: {
                paddingVertical: 8,
                paddingHorizontal: 4,
                minWidth: 90
            },
            tabBarStyle: {
                backgroundColor: colors.background.surface,
                borderTopWidth: 1,
                borderTopColor: '#E5E5E5',
                height: 64 + insets.bottom,
                paddingBottom: 8 + insets.bottom,
                paddingTop: 8
            }
        }}
    >
        <Tabs.Screen
            name='index'
            options={{
                title: translate('navigation.home'),
                headerShown: false,
                tabBarIcon: ({focused}) => (
                    <TabIcon focused={focused} title={translate('navigation.home')} icon={
                        <Entypo name="home" size={24} color={focused ? colors.primary.medium : colors.black} />
                    }/>
                )
            }}
        />
        <Tabs.Screen
            name='care'
            options={{
                title: translate('navigation.schedule'),
                headerShown: false,
                tabBarIcon: ({focused}) => (
                    <TabIcon focused={focused} title={translate('navigation.schedule')} icon={
                        <FontAwesome5 name="calendar-day" size={24} color={focused ? colors.primary.medium : colors.black} />
                    }/>
                )
            }}
        />
        <Tabs.Screen
            name='identify'
            options={{
                title: translate('navigation.identify'),
                headerShown: false,
                tabBarIcon: ({focused}) => (
                    <TabIcon focused={focused} title={translate('navigation.identify')} icon={
                        <Ionicons
                            name="search"
                            size={24}
                            color={focused ? colors.primary.medium : colors.black}
                        />
                    }/>
                )
            }}
        />
        <Tabs.Screen
            name='profile'
            options={{
                title: translate('navigation.settings'),
                headerShown: false,
                tabBarIcon: ({focused}) => (
                    <TabIcon focused={focused} title={translate('navigation.settings')} icon={
                        <AntDesign
                            name='setting'
                            size={24}
                            color={focused ? colors.primary.medium : colors.black}
                        />
                    }/>
                )
            }}
        />
    </Tabs>
  )
}

export default _layout