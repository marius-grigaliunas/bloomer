import { View, Text, Image, Alert } from 'react-native'
import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react'
import * as ExpoLocation from 'expo-location'
import { getWeather } from '@/lib/services/weatherApiService'
import { WeatherProps } from '@/interfaces/interfaces'
import { translate } from '@/lib/i18n/config'

// Global cache for weather data
let weatherCache: { data: WeatherProps | null; timestamp: number; error: string | null } = {
  data: null,
  timestamp: 0,
  error: null
};

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

interface WeatherComponentProps {
  onWeatherUpdate?: (weather: WeatherProps | null, error: string | null) => void;
}

export interface WeatherComponentRef {
  refreshWeather: () => Promise<void>;
}

const WeatherComponent = forwardRef<WeatherComponentRef, WeatherComponentProps>(({ onWeatherUpdate }, ref) => {
    const [weather, setWeather] = useState<WeatherProps | null>(weatherCache.data);
    const [isLoading, setIsLoading] = useState<boolean>(!weatherCache.data);
    const [hasError, setHasError] = useState<boolean>(false);
    const hasInitialized = useRef(false);

    const fetchWeatherData = async (forceRefresh: boolean = false) => {
        try {
            setIsLoading(true);
            setHasError(false);
            
            const {status} = await ExpoLocation.requestForegroundPermissionsAsync();
            if(status !== 'granted') {
                console.error('Location permission denied');
                setHasError(true);
                setIsLoading(false);
                weatherCache.error = translate('weather.locationAccessDenied');
                onWeatherUpdate?.(null, translate('weather.locationAccessDenied'));
                Alert.alert(
                    translate('weather.locationAccessRequired'),
                    translate('weather.enableLocationAccess'),
                    [{ text: translate('weather.ok') }]
                );
                return;
            } 

            const result = await getWeather();
            const now = Date.now();
            
            if (typeof result === 'string') {
                console.error('Weather API error:', result);
                setHasError(true);
                setIsLoading(false);
                weatherCache.error = result;
                weatherCache.timestamp = now;
                onWeatherUpdate?.(null, result);
                Alert.alert(
                    translate('weather.weatherUnavailableTitle'),
                    translate('weather.unableToFetchWeather'),
                    [{ text: translate('weather.ok') }]
                );
            } else {
                setWeather(result);
                setIsLoading(false);
                setHasError(false);
                weatherCache.data = result;
                weatherCache.error = null;
                weatherCache.timestamp = now;
                onWeatherUpdate?.(result, null);
            }
        } catch (error) {
            console.error('Unexpected error in WeatherComponent:', error);
            setHasError(true);
            setIsLoading(false);
            const now = Date.now();
            weatherCache.error = translate('weather.unexpectedErrorOccurred');
            weatherCache.timestamp = now;
            onWeatherUpdate?.(null, translate('weather.unexpectedErrorOccurred'));
            Alert.alert(
                translate('weather.error'),
                translate('weather.unexpectedError'),
                [{ text: translate('weather.ok') }]
            );
        }
    };

    useImperativeHandle(ref, () => ({
        refreshWeather: async () => {
            await fetchWeatherData(true);
        }
    }));

    useEffect(() => {
        // Only fetch weather once when component mounts
        if (hasInitialized.current) return;
        hasInitialized.current = true;
        
        const now = Date.now();
        const isCacheValid = weatherCache.timestamp && (now - weatherCache.timestamp) < CACHE_DURATION;
        
        // If we have valid cached data, use it
        if (isCacheValid && weatherCache.data) {
            setWeather(weatherCache.data);
            setIsLoading(false);
            setHasError(false);
            onWeatherUpdate?.(weatherCache.data, null);
            return;
        }
        
        // Otherwise fetch fresh data
        fetchWeatherData();
    }, [onWeatherUpdate]);

    return (
        <View className='text-text-primary'>
            {isLoading ? (
                <Text className='text-l text-text-primary'>{translate('weather.loadingWeather')}</Text>
            ) : hasError ? (
                <Text className='text-l text-text-primary'>{translate('weather.weatherUnavailable')}</Text>
            ) : weather ? (
                <View className='flex flex-row justify-between items-center'>
                    <Image 
                        style={{ width: 50, height: 50 }}  
                        source={{ uri: `https:${weather.descriptionIcon}`}}
                        onError={(error) => console.error('Weather icon loading error:', error.nativeEvent.error)}
                    />
                    <Text className='text-2xl text-text-primary'>{weather.temperature.toFixed(0)}°C</Text>
                </View>
            ) : (
                <Text className='text-l text-text-primary'>{translate('weather.weatherUnavailable')}</Text>
            )}
        </View>
    )
});

WeatherComponent.displayName = 'WeatherComponent';

export default WeatherComponent