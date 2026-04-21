export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ error: "Text is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text }] }],
                generationConfig: {
                    responseModalities: ["AUDIO"],
                    speechConfig: {
                        voiceConfig: {
                            prebuiltVoiceConfig: {
                                voiceName: "Aoede"
                            }
                        }
                    }
                }
            })
        });

        const data = await response.json();

        // Debug log (VERY IMPORTANT during testing)
        console.log(JSON.stringify(data, null, 2));

        const audioData =
            data?.candidates?.[0]?.content?.parts?.[0]?.inlineData;

        if (!audioData) {
            return res.status(500).json({
                error: "No audio returned from Gemini",
                raw: data
            });
        }

        res.status(200).json(audioData);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to generate audio",
            details: error.message
        });
    }
}
