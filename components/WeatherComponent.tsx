import { View, Text, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as ExpoLocation from 'expo-location'

interface WeatherProps {
    location: string
    temperature: number;
    description: string;
    descriptionIcon: string; 
}

const WeatherComponent = () => {
    const [weather, setWeather] = useState<WeatherProps | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            const {status} = await ExpoLocation.requestForegroundPermissionsAsync();
            if(status !== 'granted') {
                setErrorMessage("Location acess denied");
                return
            } 

            const location = await ExpoLocation.getCurrentPositionAsync({});
            const {latitude, longitude} = location.coords;

            try {
                const weatherUrl = `${process.env.EXPO_PUBLIC_WEATHERAPI_ENDPOINT}key=${process.env.EXPO_PUBLIC_WEATHERAPI_API_KEY}&q=${latitude},${longitude}&aqi=no`                 
                const response = await fetch(weatherUrl);

                const data = await response.json();
                const weatherData = {
                    location: data.location.name,
                    temperature: data.current.temp_c,
                    description: data.current.condition.text,
                    descriptionIcon: data.current.condition.icon
                };

                setWeather(weatherData);
            } catch (error) {
                console.error(error);
                setErrorMessage("Failed to get weather data");
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