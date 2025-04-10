function buildPlantCarePrompt(plant: string, commonNamesArray: string[]) {
    
    const commonNames = commonNamesArray.join("");
    
    return `
        Provide care information for ${plant} commonly known as: ${commonNames} with the following structure:

        1. Watering frequency (in days) (give one specific number)
        2. Light requirements
        3. Soil preferences
        4. Common issues
        5. Special notes

        Format the response as a JSON object with these fields.
    `
}

export { buildPlantCarePrompt }