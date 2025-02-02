import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export async function generateReactApp(prompt: string) {
  const model = genAI.getGenerativeModel({ 
    model: "gemini-pro",
    generationConfig: {
      temperature: 0.7,
      topK: 1,
      topP: 1,
      maxOutputTokens: 8192,
    }
  });

  const systemPrompt = `Create a React TypeScript application with the following description: "${prompt}".
  
  Return a JSON object with escaped strings for each file. Format:
  {
    "package.json": "{\\\"name\\\": \\\"react-app\\\", ...}",
    "src/App.tsx": "import React from 'react';\\n...",
    "src/index.tsx": "import React from 'react';\\n...",
    "src/styles/main.css": "body {\\n  margin: 0;\\n...}",
    "public/index.html": "<!DOCTYPE html>\\n..."
  }`;

  try {
    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      // First try direct parsing
      const parsed = JSON.parse(text);
      return parsed;
    } catch (parseError) {
      // If direct parsing fails, try to extract JSON from markdown code blocks
      const jsonMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        return JSON.parse(jsonMatch[1].trim());
      }
      throw parseError;
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate React app. Please try again.");
  }
} 