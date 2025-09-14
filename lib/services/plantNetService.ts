import * as FileSystem from 'expo-file-system';
import { PlantIdentificationResponse } from '@/interfaces/interfaces';
import { identifyPlants as appwriteIdentifyPlants } from '@/lib/appwrite';

/**
 * Logs image size information for analysis
 */
async function logImageSize(uri: string, index: number): Promise<void> {
    try {
        const fileInfo = await FileSystem.getInfoAsync(uri);
        if (fileInfo.exists && fileInfo.size !== undefined) {
            const sizeInMB = (fileInfo.size / (1024 * 1024)).toFixed(2);
            const sizeInKB = (fileInfo.size / 1024).toFixed(2);
            console.log(`Image ${index + 1} size analysis:`, {
                uri: uri,
                sizeBytes: fileInfo.size,
                sizeKB: `${sizeInKB} KB`,
                sizeMB: `${sizeInMB} MB`,
                isCompressed: fileInfo.size < 1024 * 1024 ? 'Likely compressed' : 'Large file - may need compression'
            });
        } else {
            console.warn(`Could not get size info for image ${index + 1}:`, uri);
        }
    } catch (error) {
        console.error(`Error getting size info for image ${index + 1}:`, error);
    }
}

/**
 * Converts image URI to base64 string
 */
async function convertImageToBase64(uri: string): Promise<string> {
    try {
        const base64 = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
        });
        return `data:image/jpeg;base64,${base64}`;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new Error(`Failed to convert image to base64: ${errorMessage}`);
    }
}

export async function identifyPlants(imageUris: string[]): Promise<PlantIdentificationResponse | string> {
    try {// Validate input

        if (!imageUris || imageUris.length === 0) {
            throw new Error('No images provided');
        }

        if (imageUris.length > 5) {
            throw new Error('Maximum 5 images allowed');
        }

        // Check if all files exist and convert to base64
        const base64Images: string[] = [];
        
        for (let i = 0; i < imageUris.length; i++) {
            const uri = imageUris[i];
            
            // Log image size for analysis
            await logImageSize(uri, i);
            
            const fileInfo = await FileSystem.getInfoAsync(uri);
            if (!fileInfo.exists) {
                throw new Error(`File does not exist: ${uri}`);
            }

            const base64Image = await convertImageToBase64(uri);
            base64Images.push(base64Image);
        }
        console.log(`Converting ${base64Images.length} images to base64 and sending to Appwrite function`);
        const result = await appwriteIdentifyPlants(base64Images);

        if (typeof result === 'string') {
            console.error('PlantNet API returned error:', result);
            return result;
        }
        
        console.log('Plant identification data received successfully:', {
            bestMatch: result.bestMatch,
            commonNames: result.commonNames,
            confidence: result.confidence,
            rawResponse: result.rawResponse
        });
        return result;

    } catch (error) { 
        console.error('Error in identifyPlants function:', error);
        if (error instanceof Error) {
            return `Failed to identify plants: ${error.message}`;
        }
        return 'Failed to identify plants: Unknown error';
    }
}