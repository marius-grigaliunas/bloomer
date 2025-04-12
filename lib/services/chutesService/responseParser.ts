import { PlantCareInfo } from "./deepseekService";

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
            
            return {
                wateringFrequency: parsedData.watering_frequency_days,
                lightRequirements: parsedData.light_requirements,
                soilPreferences: parsedData.soil_preferences,
                commonIssues: parsedData.common_issues,
                specialNotes: parsedData.special_notes
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