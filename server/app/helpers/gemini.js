const { GoogleGenAI } = require("@google/genai");
const env = require("dotenv");
env.config({ path: ".env" });

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function generateContent(category, query) {
  const prompt = `You are an intelligent assistant for an
LMS platform. A user will type any query about what they
want to learn. Your task is to understand the intent and
return one **most relevant keyword** from the following
list of course categories , levels , language , price range , instructor name.:

${category}

Only reply with one single keyword from the list above that best 
matches the query. Do not explain anything. No extra text. , if value is string number you will be return number type value with out quotes 

Query: ${query}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  return response.text;
}

module.exports = generateContent;
