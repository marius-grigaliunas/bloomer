function buildPlantCarePrompt(plant: string, commonNamesArray: string[]) {
    const commonNames = commonNamesArray.join(", ");
    
    return `
        You are a plant care expert assistant. Provide care information for ${plant} (common names: ${commonNames}).
        
        Return ONLY a JSON object with these exact fields. Do not include any additional text or explanation:
        {
            "watering_frequency_days": number, // Integer between 1-30
            "watering_amount_ml": number, // Amount of water in milliliters, integer between 50-1000
            "watering_amount_oz": number, // Amount of water in US fluid ounces, float between 1-34
            "light_requirements": "low" | "medium" | "high" | "direct", // One of these exact values
            "soil_preferences": string, // Brief soil description, max 100 chars
            "humidity": "low" | "medium" | "high", // One of these exact values
            "min_temperature_c": number, // Minimum temperature in Celsius, between -5 and 60
            "max_temperature_c": number, // Maximum temperature in Celsius, between -5 and 60
            "min_temperature_f": number, // Minimum temperature in Fahrenheit, between 23 and 120
            "max_temperature_f": number, // Maximum temperature in Fahrenheit, between 23 and 120
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