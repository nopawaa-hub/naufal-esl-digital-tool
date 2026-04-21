export default async function handler(req, res) {
    const { text } = req.query;
    const apiKey = process.env.GEMINI_API_KEY; // Hidden in Vercel settings

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`;
    
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text }] }],
                generationConfig: {
                    responseModalities: ["AUDIO"],
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Aoede" } } }
                }
            })
        });

        const data = await response.json();
        // Send the raw audio data back to your frontend
        res.status(200).json(data.candidates[0].content.parts[0].inlineData);
    } catch (error) {
        res.status(500).json({ error: "Failed to generate audio" });
    }
}
