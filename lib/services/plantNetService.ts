import * as FileSystem from 'expo-file-system';

export interface PlantIdentificationResponse {
    bestMatch: string;
    commonName: string | null;
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

        const apiUrl = `${process.env.EXPO_PUBLIC_PLANTNETAPI_ENDPOINT}?api-key=${process.env.EXPO_PUBLIC_PLANTNETAPI_API_KEY}`

        

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-type': 'multipart/form-data'
            },
            body: formData
        });

        if(!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`); 
        }

        const responseJSON = await response.json();

            // Print the raw response to the console for debugging
        console.log('PlantNet API raw response:', JSON.stringify(responseJSON, null, 2));
        
        // Extract only the needed information
        let bestMatch = '';
        let commonName = null;
        let confidence = 0;
        
        // Check if bestMatch field exists directly in the response
        if (responseJSON.bestMatch) {
          bestMatch = responseJSON.bestMatch;
        } 
        // Otherwise use the top result with highest score
        else if (responseJSON.results && responseJSON.results.length > 0) {
          const topResult = responseJSON.results[0];
          bestMatch = topResult.species.scientificNameWithoutAuthor;
          confidence = topResult.score;
        
          // Get the first common name if available
          if (topResult.species.commonNames && topResult.species.commonNames.length > 0) {
            commonName = topResult.species.commonNames[0];
          }
        }

        return {
          bestMatch,
          commonName,
          confidence,
          rawResponse: responseJSON
        };
    } catch (error) {
        console.error('Plant identification error:', error);
        throw error;
    }
}