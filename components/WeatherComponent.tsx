import { View, Text, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as ExpoLocation from 'expo-location'
import { WeatherProps, getWeather } from '@/lib/services/weatherApiService'


const WeatherComponent = () => {
    const [weather, setWeather] = useState<WeatherProps | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            const {status} = await ExpoLocation.requestForegroundPermissionsAsync();
            if(status !== 'granted') {
                setErrorMessage("Location access denied");
                return
            } 

            const result = await getWeather();
            if (typeof result === 'string') {
                setErrorMessage(result);
            } else {
                setWeather(result);
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