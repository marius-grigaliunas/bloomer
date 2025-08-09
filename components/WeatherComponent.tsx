import { View, Text, Image } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import * as ExpoLocation from 'expo-location'
import { WeatherProps, getWeather } from '@/lib/services/weatherApiService'

// Global cache for weather data
let weatherCache: { data: WeatherProps | null; timestamp: number; error: string | null } = {
  data: null,
  timestamp: 0,
  error: null
};

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

const WeatherComponent = () => {
    const [weather, setWeather] = useState<WeatherProps | null>(weatherCache.data);
    const [errorMessage, setErrorMessage] = useState<string | null>(weatherCache.error);
    const hasInitialized = useRef(false);

    useEffect(() => {
        // Only fetch weather once when component mounts
        if (hasInitialized.current) return;
        hasInitialized.current = true;
        
        const now = Date.now();
        const isCacheValid = weatherCache.timestamp && (now - weatherCache.timestamp) < CACHE_DURATION;
        
        // If we have valid cached data, use it
        if (isCacheValid && weatherCache.data) {
            setWeather(weatherCache.data);
            return;
        }
        
        (async () => {
            const {status} = await ExpoLocation.requestForegroundPermissionsAsync();
            if(status !== 'granted') {
                const error = "Location access denied";
                setErrorMessage(error);
                weatherCache.error = error;
                return
            } 

            const result = await getWeather();
            if (typeof result === 'string') {
                setErrorMessage(result);
                weatherCache.error = result;
                weatherCache.timestamp = now;
            } else {
                setWeather(result);
                weatherCache.data = result;
                weatherCache.error = null;
                weatherCache.timestamp = now;
            }
        })();
    }, []);

    return (
        <View className='text-text-primary'>
            {errorMessage ? (
                <Text className='text-l text-text-primary'>{errorMessage}</Text>
            ) : !weather ? (<Text className='text-l text-text-primary'>Weather loading</Text>) :
            (
                <View className='flex flex-row justify-between items-center'>
                    <Text className='text-2xl text-text-primary '>{weather.location} </Text>
                    <Image 
                        style={{ width: 50, height: 50 }}  
                        source={{ uri: `https:${weather.descriptionIcon}`}}
                        onError={(error) => console.error('Image loading error:', error.nativeEvent.error)}
                    />
                    <Text className='text-2xl text-text-primary'>{weather.temperature.toFixed(0)}°C</Text>
                </View>
            )}
        </View>
    )
}

export default WeatherComponent