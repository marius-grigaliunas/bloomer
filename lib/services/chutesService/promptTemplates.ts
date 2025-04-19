function buildPlantCarePrompt(plant: string, commonNamesArray: string[]) {
    const commonNames = commonNamesArray.join(", ");
    
    return `
        You are a plant care expert assistant. Provide care information for ${plant} (common names: ${commonNames}).
        
        Return ONLY a JSON object with these exact fields. Do not include any additional text or explanation:
        {
            "watering_frequency_days": number, // Integer between 1-30
            "light_requirements": "low" | "medium" | "high" | "direct", // One of these exact values
            "soil_preferences": string, // Brief soil description, max 100 chars
            "humidity": "low" | "medium" | "high", // One of these exact values
            "min_temperature": number, // Minimum temperature in Celsius, between -5 and 40
            "max_temperature": number, // Maximum temperature in Celsius, between -5 and 40
            "common_issues": string[], // Array of up to 5 most common issues, each max 50 chars
            "special_notes": string[], // Array of up to 3 important care notes, each max 100 chars
            "care_instructions": string[] // Array of up to 5 general care instructions, each max 100 chars
        }

        The response must:
        1. Be valid JSON
        2. Include all fields
        3. Match the exact types specified
        4. Be wrapped in json code blocks
        5. Not include any text outside the JSON object
    `
}

export { buildPlantCarePrompt }