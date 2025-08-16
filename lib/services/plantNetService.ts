import * as FileSystem from 'expo-file-system';

export interface PlantIdentificationResponse {
    bestMatch: string;
    commonNames: string[] | null;
    confidence: number;
    rawResponse: any; // This will hold the complete response
}

export async function identifyPlants(imageUris: string[]):Promise<PlantIdentificationResponse> {
    try {
        const formData = new FormData();

        //Add each image to form data
        for (const uri of imageUris) {
            const fileInfo = await FileSystem.getInfoAsync(uri);
            if(!fileInfo.exists) {
                throw new Error(`File does not exist: ${uri}`);
            }

            formData.append('images', {
                uri: uri,
                type: 'image/jpg',
                name: `plant${uri}.jpg`,
            } as any)

            formData.append('organs', 'auto');
        }

        const apiUrl = `${process.env.EXPO_PUBLIC_PLANTNETAPI_ENDPOINT}?api-key=${process.env.EXPO_PRIVATE_PLANTNETAPI_API_KEY}`
        
        // Debug logging (remove in production)
        console.log('PlantNet API URL:', apiUrl.replace(process.env.EXPO_PRIVATE_PLANTNETAPI_API_KEY || '', '[API_KEY_HIDDEN]'));
        console.log('API Key exists:', !!process.env.EXPO_PRIVATE_PLANTNETAPI_API_KEY);
        console.log('Endpoint exists:', !!process.env.EXPO_PUBLIC_PLANTNETAPI_ENDPOINT);

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-type': 'multipart/form-data'
            },
            body: formData
        });

        if(!response.ok) {
            let errorMessage = `HTTP error! status: ${response.status}`;
            
            // Provide more specific error messages based on status codes
            switch (response.status) {
                case 400:
                    errorMessage = "Bad request - Please check your image format and try again";
                    break;
                case 401:
                    errorMessage = "Unauthorized - API key may be invalid or expired";
                    break;
                case 403:
                    errorMessage = "Forbidden - Access denied to the plant identification service";
                    break;
                case 404:
                    errorMessage = "Service not found - Plant identification service is currently unavailable";
                    break;
                case 429:
                    errorMessage = "Too many requests - Please wait a moment and try again";
                    break;
                case 500:
                    errorMessage = "Server error - Plant identification service is experiencing issues";
                    break;
                case 503:
                    errorMessage = "Service unavailable - Plant identification service is temporarily down";
                    break;
                default:
                    errorMessage = `Plant identification service error (${response.status})`;
            }
            
            throw new Error(errorMessage);
        }

        const responseJSON = await response.json();

            // You can also log specific nested objects to inspect them
        if (responseJSON.results && responseJSON.results.length > 0) {
        console.log('First result details:', JSON.stringify(responseJSON.results[0], null, 2));
        }
        
        // Extract only the needed information
        let bestMatch = '';
        let commonNames = [''];
        let confidence = 0;
      
        // Get details from the top result
        if (responseJSON.results && responseJSON.results.length > 0) {
            const topResult = responseJSON.results[0];
            
            // If we didn't get a bestMatch, use the scientific name from the top result
            if (!bestMatch && topResult.species && topResult.species.scientificName) {
              bestMatch = topResult.species.scientificNameWithoutAuthor;
            }

            // Get the confidence score
            if (topResult.score !== undefined) {
              confidence = topResult.score;
            }

            // Get the first common name if available
            if (topResult.species && 
                topResult.species.commonNames && 
                topResult.species.commonNames.length > 0) {
              commonNames = topResult.species.commonNames;
            }
        }

        return {
          bestMatch,
          commonNames,
          confidence,
          rawResponse: responseJSON
        };
    } catch (error) {
        console.error('Plant identification error:', error);
        throw error;
    }
}