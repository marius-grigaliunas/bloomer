import * as ExpoLocation from 'expo-location';

export interface WeatherProps {
    location: string
    temperature: number;
    description: string;
    descriptionIcon: string; 
}

export async function getWeather(): Promise<WeatherProps | string> {

    const location = await ExpoLocation.getCurrentPositionAsync({});
    const {latitude, longitude} = location.coords;

    try {
        // Ensure proper URL construction for WeatherAPI.com
        const baseUrl = process.env.EXPO_PUBLIC_WEATHERAPI_ENDPOINT || 'http://api.weatherapi.com/v1/current.json?';
        const apiKey = process.env.EXPO_PRIVATE_WEATHERAPI_API_KEY;
        
        // Debug environment variables
        console.log('Weather API Debug Info:');
        console.log('- Base URL:', baseUrl);
        console.log('- API Key exists:', !!apiKey);
        console.log('- API Key length:', apiKey ? apiKey.length : 0);
        console.log('- API Key starts with:', apiKey ? apiKey.substring(0, 4) + '...' : 'N/A');
        
        if (!apiKey) {
            throw new Error('Weather API key is not configured');
        }
        
        // Construct URL properly - ensure it starts with ? if not already present
        const separator = baseUrl.includes('?') ? '&' : '?';
        const weatherUrl = `${baseUrl}${separator}key=${apiKey}&q=${latitude},${longitude}&aqi=no`;
        
        console.log('Weather API URL (without key):', weatherUrl.replace(apiKey, '[API_KEY_HIDDEN]'));
        console.log('Coordinates:', { latitude, longitude });
        
        const response = await fetch(weatherUrl);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Weather API response error:', response.status, errorText);
            console.error('Response headers:', Object.fromEntries(response.headers.entries()));
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        const weatherData = {
            location: data.location.name,
            temperature: data.current.temp_c,
            description: data.current.condition.text,
            descriptionIcon: data.current.condition.icon
        };

        return weatherData;
    } catch (error) {
        console.error('Weather fetch error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return `Failed to get weather data: ${errorMessage}`;
    }
}