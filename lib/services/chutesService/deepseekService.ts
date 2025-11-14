import { PlantCareInfo } from "@/interfaces/interfaces";
import { getPlantCareFunction } from "@/lib/appwrite";

export async function getPlantCareInfo(plant: string, commonNames: string[], preferredLanguage: string): Promise<PlantCareInfo | string> {
    try {
        if (!plant || !commonNames) {
            throw new Error('Plant and common names are required, no input provided');
        }

        const result = await getPlantCareFunction(plant, commonNames, preferredLanguage);
        if (typeof result === 'string') {
            console.error('Failed to get plant info: ', result);
            return result;
        }

        console.log('Plant info:', result);
        return result;
        
    } catch(error) {
        console.log("Error getting plant info: ", error);
        if(error instanceof Error) {
            return `Failed to get plant info: ${error.message}`;
        }
        return 'Failed to get plant info: Unknown error';
    }
}
