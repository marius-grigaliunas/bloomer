function buildPlantCarePrompt(plant: string, commonNamesArray: string[]) {
    const commonNames = commonNamesArray.join(", ");
    
    return `
        Provide care information for ${plant} (common names: ${commonNames}).
        Return a JSON object with exactly these fields and format:
        {
            "watering_frequency_days": number,
            "light_requirements": string,
            "soil_preferences": string,
            "common_issues": string[],
            "special_notes": string[]
        }
    `
}

export { buildPlantCarePrompt }