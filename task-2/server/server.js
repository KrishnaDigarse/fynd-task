const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Gemini
const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;
const model = genAI ? genAI.getGenerativeModel({ model: "gemini-2.5-flash" }) : null;

// Data Storage
const DATA_FILE = path.join(__dirname, 'data', 'submissions.json');

// Helper: Read Data
function getSubmissions() {
    try {
        if (!fs.existsSync(DATA_FILE)) return [];
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Read error:", err);
        return [];
    }
}

// Helper: Save Data
function saveSubmission(submission) {
    try {
        const submissions = getSubmissions();
        submissions.unshift(submission);

        const dir = path.dirname(DATA_FILE);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        fs.writeFileSync(DATA_FILE, JSON.stringify(submissions, null, 2));
    } catch (err) {
        console.error("Save error:", err);
    }
}

// Routes
app.get('/api/submissions', (req, res) => {
    res.json(getSubmissions());
});

app.post('/api/submit', async (req, res) => {
    try {
        const { rating, review } = req.body;
        if (!rating || !review) return res.status(400).json({ error: 'Missing fields' });

        let aiResponse = "Thank you!";
        let aiSummary = "No summary";
        let aiAction = "Review";

        // Call Gemini
        if (model) {
            const prompt = `
            Analyze this feedback:
            Rating: ${rating}/5
            Review: "${review}"

            JSON Output only with keys:
            1. "userResponse": Polite reply (max 2 sentences).
            2. "summary": Brief summary (max 10 words).
            3. "action": Admin action (max 5 words).
            `;

            try {
                const result = await model.generateContent(prompt);
                const response = await result.response;
                const text = response.text().replace(/```json/g, '').replace(/```/g, '').trim();
                const json = JSON.parse(text);

                aiResponse = json.userResponse;
                aiSummary = json.summary;
                aiAction = json.action;
            } catch (e) {
                console.error("AI Error:", e);
                aiResponse = "Thank you for your feedback!";
            }
        }

        const submission = {
            id: uuidv4(),
            rating,
            review,
            aiResponse,
            aiSummary,
            aiAction,
            createdAt: new Date().toISOString()
        };

        saveSubmission(submission);
        res.json({ success: true, aiResponse });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
