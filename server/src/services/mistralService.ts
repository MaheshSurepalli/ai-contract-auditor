import { Mistral } from "@mistralai/mistralai";
import dotenv from "dotenv";
dotenv.config();

const mistral = new Mistral({
    apiKey: process.env.MISTRAL_API_KEY!,
});

// Define the expected structure of ContentChunk
interface ContentChunk {
    content: string;
    // Add other properties if necessary
}

export const analyzeCode = async (code: string) => {
    const prompt = `
You are a professional smart contract auditor.
Analyze the following Solidity code for:

1. Security vulnerabilities
2. Gas inefficiencies
3. Best practice violations
4. Logical errors

Return your response in structured JSON format with keys:
"security", "gas", "bestPractices", and "suggestions".

Solidity Code:
${code}
`;

    const completion = await mistral.chat.complete({
        model: "mistral-large-latest", // or mistral-small-latest depending on your plan
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
    });

    let response = completion.choices[0]?.message?.content ?? "";

    if (typeof response !== "string") {
        throw new Error("Invalid response format from Mistral.");
    }

    const cleaned = cleanJsonString(response);

    try {
        return JSON.parse(cleaned);
    } catch (err) {
        console.warn("❗ Failed to parse JSON. Sending raw string.");
        return { raw: cleaned };
    }
};

const cleanJsonString = (raw: string): string => {
    return raw
        .replace(/^```json\s*/i, "")
        .replace(/```$/i, "")
        .trim();
};
