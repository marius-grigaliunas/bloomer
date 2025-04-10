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
        // The actual content is in response.choices[0].message.content
        // And it's wrapped in ```json ... ``` markdown format
        const jsonContent = response.choices[0].message.content;
        
        // Extract just the JSON part between the backticks
        const jsonMatch = jsonContent.match(/```json\n([\s\S]*)\n```/);
        
        if (jsonMatch && jsonMatch[1]) {
            // Parse the extracted JSON
            const parsedData = JSON.parse(jsonMatch[1]);
            
            // Return the specific fields you need
            return {
                wateringFrequency: parsedData["Watering frequency (in days)"],
                lightRequirements: parsedData["Light requirements"],
                soilPreferences: parsedData["Soil preferences"],
                commonIssues: parsedData["Common issues"],
                specialNotes: parsedData["Special notes"]
            };
        } else {
            // If we couldn't extract the JSON with regex
            console.log("Could not extract JSON from response");
            return null;
        }
    } catch (error) {
        console.log("Error parsing the response from Chutes/Deepseek", error);
        return null;
    }
}

export { parseDeepseekResponse };