// Call this function to convert text → speech
async function speak(text) {
    try {
        const res = await fetch("/api/tts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text })
        });

        const data = await res.json();

        // Debug (remove later if you want)
        console.log("TTS response:", data);

        if (!data || !data.data) {
            console.error("No audio data returned:", data);
            return;
        }

        // Create audio from base64
        const audioSrc = `data:${data.mimeType};base64,${data.data}`;
        const audio = new Audio(audioSrc);

        audio.play();

    } catch (err) {
        console.error("TTS error:", err);
    }
}
