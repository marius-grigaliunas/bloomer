import * as ExpoLocation from 'expo-location';
import { getWeather as getWeatherFromAppwrite } from '../appwrite';
import { WeatherProps } from '@/interfaces/interfaces';

export async function getWeather(): Promise<WeatherProps | string> {
    try {
        console.log('Getting current location...');
        
        // Check if location services are enabled
        const locationEnabled = await ExpoLocation.hasServicesEnabledAsync();
        if (!locationEnabled) {
            console.error('Location services are disabled');
            return 'Location services are disabled. Please enable location services in your device settings.';
        }
        
        const location = await ExpoLocation.getCurrentPositionAsync({
            accuracy: ExpoLocation.Accuracy.Balanced,
            timeInterval: 10000,
            distanceInterval: 10
        });
        
        console.log('Raw location object:', location);
        console.log('Location coords:', location.coords);
        
        const {latitude, longitude} = location.coords;
        
        // Validate coordinates
        if (latitude === undefined || longitude === undefined || 
            isNaN(latitude) || isNaN(longitude)) {
            console.error('Invalid coordinates received:', { latitude, longitude });
            return 'Failed to get valid location coordinates. Please try again.';
        }
        
        console.log(`Valid location obtained: ${latitude}, ${longitude}`);

        console.log('Calling Appwrite weather function with coordinates:', { latitude, longitude });
        const result = await getWeatherFromAppwrite(latitude, longitude);
        
        if (typeof result === 'string') {
            console.error('Weather API returned error:', result);
            return result;
        }
        
        console.log('Weather data received successfully:', {
            location: result.location,
            temperature: result.temperature,
            description: result.description
        });
        return result;
    } catch (error) {
        console.error('Error in getWeather function:', error);
        if (error instanceof Error) {
            return `Failed to get weather data: ${error.message}`;
        }
        return 'Failed to get weather data: Unknown error';
    }
}