import { GoogleGenAI } from "@google/genai";

let ai: GoogleGenAI | null = null;

function getAI() {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_API_KEY") {
      throw new Error("GEMINI_API_KEY is missing. Please set it in your environment variables (e.g., in Vercel settings).");
    }
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
}

export async function analyzeSkinLesion(base64Image: string, mimeType: string) {
  const ANALYSIS_MODEL = "gemini-3-flash-preview";
  const aiInstance = getAI();
  
  const prompt = `
    You are a specialized dermatological assistant AI. 
    Analyze the provided image of a skin lesion using the knowledge base of the HAM10000 dataset ("Human Against Machine with 10000 training images").
    
    The HAM10000 dataset includes 7 diagnostic categories:
    1. akiec: Actinic keratoses and intraepithelial carcinoma / Bowen's disease
    2. bcc: Basal cell carcinoma
    3. bkl: Benign keratosis-like lesions (solar lentigines / seborrheic keratoses and lichen-planus like keratoses)
    4. df: Dermatofibroma
    5. mel: Melanoma
    6. nv: Melanocytic nevi
    7. vasc: Vascular lesions (angiomas, angiokeratomas, pyogenic granulomas and hemorrhage)
    
    1. Identify potential characteristics (color, symmetry, border, diameter).
    2. Provide a preliminary assessment, specifically considering if the lesion matches any of the 7 HAM10000 categories.
    3. Suggest next steps (e.g., monitor for changes, seek professional evaluation).
    
    Return the response in a structured format with:
    - Assessment: A brief summary, including the most likely HAM10000 category.
    - Observations: Bullet points on ABCDE features.
    - RiskLevel: Low, Moderate, or High (with justification).
    - Recommendations: Practical next steps.
  `;

  const imagePart = {
    inlineData: {
      data: base64Image.split(',')[1], // Remove data:image/png;base64,
      mimeType: mimeType,
    },
  };

  try {
    const response = await aiInstance.models.generateContent({
      model: ANALYSIS_MODEL,
      contents: { parts: [imagePart, { text: prompt }] },
    });

    return response.text;
  } catch (error) {
    console.error("Analysis Error:", error);
    throw new Error("Failed to analyze image. Please try again.");
  }
}
