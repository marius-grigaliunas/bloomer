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
        const weatherUrl = `${process.env.EXPO_PUBLIC_WEATHERAPI_ENDPOINT}key=${process.env.EXPO_PUBLIC_WEATHERAPI_API_KEY}&q=${latitude},${longitude}&aqi=no`                 
        const response = await fetch(weatherUrl);

        const data = await response.json();
        const weatherData = {
            location: data.location.name,
            temperature: data.current.temp_c,
            description: data.current.condition.text,
            descriptionIcon: data.current.condition.icon
        };

        return weatherData;
    } catch (error) {
        console.error(error);
        return "Failed to get weather data";
    }
}