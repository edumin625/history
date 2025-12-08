"use server";

const apiKey = process.env.GOOGLE_GENERATIVE_AI_KEY;

export async function generateHistory(region: string) {
  if (!apiKey) {
    throw new Error("Google Generative AI Key is missing");
  }

  const prompt = `${region}의 역사적 내용에 대해 한국어로 500자로 요약해서 알려줘. 결과만 출력해줘.`;

  try {
    // Use v1beta API via fetch
    // Using gemini-pro-latest as it is available in the user's list.
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API Error Data:", JSON.stringify(errorData, null, 2));
      throw new Error(errorData.error?.message || response.statusText);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error("No text generated");
    }

    return text;
  } catch (error: any) {
    console.error("Detailed Gemini Error:", error);
    if (error.message) {
      throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error("Failed to generate history");
  }
}
