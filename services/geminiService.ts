import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
// Use the recommended model name for Nano Banana
const model = 'gemini-2.5-flash-image';

interface EditResult {
    editedImage: string | null;
    text: string | null;
}

export const editImageWithNanoBanana = async (
    base64ImageData: string,
    mimeType: string,
    prompt: string
): Promise<EditResult> => {
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: model,
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: base64ImageData,
                            mimeType: mimeType,
                        },
                    },
                    {
                        text: prompt,
                    },
                ],
            },
            config: {
                // Per documentation, this must be a single-element array with Modality.IMAGE for image editing
                responseModalities: [Modality.IMAGE],
            },
        });

        const result: EditResult = { editedImage: null, text: null };
        
        // Use the recommended .text accessor for the text part
        result.text = response.text;

        if (response.candidates && response.candidates.length > 0) {
            const parts = response.candidates[0].content.parts;
            for (const part of parts) {
                if (part.inlineData) {
                    result.editedImage = part.inlineData.data;
                    // Found the image, no need to look further
                    break; 
                }
            }
        } else {
           throw new Error("No candidates returned from the API.");
        }

        return result;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to edit image with AI. The model may not have been able to fulfill the request. Please try a different prompt.");
    }
};
