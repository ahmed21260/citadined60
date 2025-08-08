
import { GoogleGenAI, Type } from "@google/genai";
import { Car, Booking, AIVerificationResult } from '../types';

let ai: GoogleGenAI | null = null;
let isInitialized = false;

const getAiClient = (): GoogleGenAI | null => {
    if (isInitialized) {
        return ai;
    }

    isInitialized = true; // Attempt initialization only once

    try {
        if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
            ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            return ai;
        } else {
            console.error("Gemini API key (API_KEY env var) is not configured. AI features are disabled.");
            return null;
        }
    } catch (error) {
        console.error("Failed to initialize GoogleGenAI:", error);
        ai = null;
        return null;
    }
};

export const getCarSuggestion = async (tripDescription: string, carList: Car[]): Promise<{ carName: string; justification: string; } | null> => {
    const localAi = getAiClient();
    if (!localAi) {
        return null;
    }

    const carNames = carList.map(c => c.name).join(', ');
    const model = 'gemini-2.5-flash';

    const prompt = `
        Given the following list of available city cars: ${carNames}.
        A customer wants to rent a car for the following purpose: "${tripDescription}".
        Based on this description, which single car would you recommend?
        The recommendation should consider car features like gearbox (Automatic/Manual) if mentioned or implied.
        Provide a very short, compelling justification for your choice (one sentence max).
        You must respond in French.
    `;

    try {
        const response = await localAi.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        carName: {
                            type: Type.STRING,
                            description: "The exact name of the recommended car from the list provided."
                        },
                        justification: {
                            type: Type.STRING,
                            description: "A short justification in French for the recommendation."
                        }
                    },
                    required: ["carName", "justification"]
                }
            }
        });

        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);

        if (carList.some(car => car.name === result.carName)) {
            return result;
        } else {
            console.error("Gemini suggested a car that is not in the list:", result.carName);
            return {
                carName: carList[0].name,
                justification: `La ${carList[0].name} est un excellent choix polyvalent.`
            };
        }

    } catch (error) {
        console.error("Error fetching car suggestion from Gemini:", error);
        return null;
    }
};


export const verifyDocumentsWithAI = async (booking: Booking): Promise<AIVerificationResult | null> => {
    const localAi = getAiClient();
    if (!localAi) {
        return null;
    }
    
    const { user, documents } = booking;
    const model = 'gemini-2.5-flash';
    
    const prompt = `
      You are an AI assistant for a car rental agency. Your task is to check if a user's documents seem to match their profile information.
      You cannot actually read the images, but you must act as if you can for this simulation.
      
      User Profile Information:
      - Full Name: ${user.firstName} ${user.lastName}
      - Address: ${user.address}

      Simulated Document URLs (you don't need to access them):
      - Identity Document: ${documents.identity}
      - Proof of Address: ${documents.proofOfAddress}
      
      Based on this information, perform a simulated check and respond in JSON format.
      - Check if the name on the identity document matches the profile name. For this simulation, assume it matches if the name is not "John Doe".
      - Check if the address on the proof of address document matches the profile address. For this simulation, assume it matches if the address is not "123 Fake Street".
      - Provide a short summary in French about your findings. If something doesn't match, mention it. If everything matches, confirm it.
    `;
    
     try {
        const response = await localAi.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        nameMatch: { type: Type.BOOLEAN },
                        addressMatch: { type: Type.BOOLEAN },
                        summary: { type: Type.STRING }
                    },
                    required: ["nameMatch", "addressMatch", "summary"]
                }
            }
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText);

    } catch (error) {
        console.error("Error verifying documents with Gemini:", error);
        return null;
    }
};
