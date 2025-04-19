import { PlantCareInfo } from "@/interfaces/interfaces";
import { buildPlantCarePrompt } from "./promptTemplates";
import { parseDeepseekResponse } from "./responseParser";

async function getPlantCareInfo(plant: string, commonNames: string[]): Promise<PlantCareInfo | null> {
    try {
        const prompt = buildPlantCarePrompt(plant, commonNames);

        const response = await fetch(`${process.env.EXPO_PUBLIC_DEEPSEEK_CHUTES_ENDPOINT}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.EXPO_PUBLIC_DEEPSEEK_CHUTES_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "deepseek-ai/DeepSeek-V3-0324",
                "messages": [
                    {
                        "role": "user",
                        "content": `${prompt}`
                    }, 
                ],
                "stream": false,
                "max_tokens": 1024,
                "temperature": 0.7
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API responded with:', response.status, errorText);
            throw new Error(`API responded with status ${response.status}`);
        }

        const data = await response.json();
        console.log('prompt: ', prompt);
        console.log('chutes raw response:', JSON.stringify(data, null, 2));

        const parsedData = parseDeepseekResponse(data)

        if (parsedData) {
            console.log("Structured plant data:", parsedData);
            return parsedData;
        } else {
            throw new Error("Failed to parse plant care data");
        }
        
    } catch(error) {
        console.log("Error getting plant info: ", error);
        return null;
    }
}

export {getPlantCareInfo}