import { PlantCareInfo } from "@/interfaces/interfaces";

interface ChutesResponse {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: {
      index: number;
      message: {
        role: string;
        content: string;
        reasoning_content: null | string;
        tool_calls: null | any[];
      };
      logprobs: null | any;
      finish_reason: string;
      matched_stop: number;
    }[];
    usage: {
      prompt_tokens: number;
      total_tokens: number;
      completion_tokens: number;
      prompt_tokens_details: null | any;
    };
  }

  function parseDeepseekResponse(response: ChutesResponse):PlantCareInfo | null {
    try {
        const jsonContent = response.choices[0].message.content;
        const jsonMatch = jsonContent.match(/```json\n([\s\S]*)\n```/);
        
        if (jsonMatch && jsonMatch[1]) {
            const parsedData = JSON.parse(jsonMatch[1]);
            
            // Validate required fields and types
            if (
                typeof parsedData.watering_frequency_days !== 'number' ||
                !['low', 'medium', 'high', 'direct'].includes(parsedData.light_requirements) ||
                typeof parsedData.soil_preferences !== 'string' ||
                !['low', 'medium', 'high'].includes(parsedData.humidity) ||
                typeof parsedData.min_temperature !== 'number' ||
                typeof parsedData.max_temperature !== 'number' ||
                !Array.isArray(parsedData.common_issues) ||
                !Array.isArray(parsedData.special_notes) ||
                !Array.isArray(parsedData.care_instructions)
            ) {
                console.log("Invalid data format in response");
                return null;
            }
            
            return {
                wateringFrequency: parsedData.watering_frequency_days,
                wateringAmountMetric: parsedData.watering_amount_ml,
                wateringAmountImperial: parsedData.watering_amount_oz,
                lightRequirements: parsedData.light_requirements,
                soilPreferences: parsedData.soil_preferences,
                humidity: parsedData.humidity,
                minTemperatureCelsius: parsedData.min_temperature_c,
                maxTemperatureCelsius: parsedData.max_temperature_c,
                minTemperatureFahrenheit: parsedData.min_temperature_f,
                maxTemperatureFahrenheit: parsedData.max_temperature_f,
                commonIssues: parsedData.common_issues,
                specialNotes: parsedData.special_notes,
                careInstructions: parsedData.care_instructions
            };
        } else {
            console.log("Could not extract JSON from response");
            return null;
        }
    } catch (error) {
        console.log("Error parsing the response from Chutes/Deepseek", error);
        return null;
    }
}

export { parseDeepseekResponse };