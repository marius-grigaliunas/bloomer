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

            // You can also log specific nested objects to inspect them
        if (responseJSON.results && responseJSON.results.length > 0) {
        console.log('First result details:', JSON.stringify(responseJSON.results[0], null, 2));
        }
        
        // Extract only the needed information
        let bestMatch = '';
        let commonNames = [''];
        let confidence = 0;
        
    // Get the bestMatch directly if available
    if (responseJSON.bestMatch) {
        bestMatch = responseJSON.bestMatch;
      }
      
      // Get details from the top result
      if (responseJSON.results && responseJSON.results.length > 0) {
        const topResult = responseJSON.results[0];
        
        // If we didn't get a bestMatch, use the scientific name from the top result
        if (!bestMatch && topResult.species && topResult.species.scientificName) {
          bestMatch = topResult.species.scientificName;
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