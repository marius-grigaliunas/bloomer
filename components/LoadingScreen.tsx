import { View, Text } from 'react-native'
import React from 'react'

interface LoadingScreenProps {
    message?: string;
    showCalendarSkeleton?: boolean;
}

const LoadingScreen = ({ message = "Loading...", showCalendarSkeleton = false }: LoadingScreenProps) => {
    if (showCalendarSkeleton) {
        return (
            <View className="flex-1 justify-center items-center bg-background-primary">
                <View className="w-full px-4">
                    {/* Calendar header skeleton */}
                    <View className="flex flex-row justify-center w-screen h-16 rounded-2xl items-center bg-background-surface mt-2 mb-2">
                        <View className="bg-gray-300 w-10 h-10 rounded-full" />
                        <View className="w-64 flex flex-row justify-center">
                            <View className="w-8/12 h-8 bg-gray-300 rounded  mx-2" />
                            <View className="w-4/12 h-8 bg-gray-300 rounded  mx-2" />
                        </View>
                        <View className="bg-gray-300 w-10 h-10 rounded-full " />
                    </View>
                    
                    {/* Calendar grid skeleton */}
                    <View className="flex flex-row flex-wrap w-full mt-2">
                        {/* Header days */}
                        {Array.from({ length: 7 }).map((_, i) => (
                            <View key={`header-${i}`} className="w-[14.28%] py-4 px-2 flex justify-start items-center">
                                <View className="w-8 h-4 bg-gray-300 rounded " />
                            </View>
                        ))}
                        
                        {/* Calendar days */}
                        {Array.from({ length: 35 }).map((_, i) => (
                            <View key={`day-${i}`} className="w-[14.28%] py-4 px-2 flex justify-start items-center border border-gray-200">
                                <View className="w-6 h-6 bg-gray-300 rounded mb-1" />
                                <View className="w-full h-2 bg-gray-200 rounded" />
                            </View>
                        ))}
                    </View>
                </View>
            </View>
        );
    }

    return (
        <View className="flex-1 justify-center items-center bg-background-primary">
            <Text className="text-text-primary text-lg">{message}</Text>
        </View>
    )
}

export default LoadingScreen