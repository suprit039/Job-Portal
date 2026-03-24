import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const parseJSON = (text) => {
    // Strip markdown code fences if present
    const cleaned = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
};

export const generateQuestions = async (req, res) => {
    try {
        const { role } = req.body;
        if (!role) return res.status(400).json({ message: "Role is required", success: false });

        const prompt = `You are a senior technical interviewer.
Role: ${role}
Generate 5 multiple choice quiz questions.
- Mix conceptual and practical
- Increasing difficulty
- Real-world oriented
Return strictly as JSON array (no markdown, no extra text):
[
  {
    "question": "...",
    "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
    "correct": "A",
    "explanation": "..."
  }
]
"correct" must be just the letter: A, B, C, or D.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const questions = parseJSON(text);

        return res.status(200).json({ questions, success: true });
    } catch (error) {
        console.log("Generate questions error:", error);
        return res.status(500).json({ message: "Failed to generate questions", success: false });
    }
};

export const evaluateAnswer = async (req, res) => {
    try {
        const { question, answer } = req.body;
        if (!question || !answer)
            return res.status(400).json({ message: "Question and answer are required", success: false });

        const prompt = `You are an expert interviewer.
Question: ${question}
Candidate Answer: ${answer}
Evaluate and return strictly in JSON (no markdown, no extra text):
{"score":0,"strengths":["..."],"weaknesses":["..."],"correct_answer":"..."}
score must be a number from 0 to 10.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const feedback = parseJSON(text);

        return res.status(200).json({ feedback, success: true });
    } catch (error) {
        console.log("Evaluate answer error:", error);
        return res.status(500).json({ message: "Failed to evaluate answer", success: false });
    }
};
