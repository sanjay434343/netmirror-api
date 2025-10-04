import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { id, title } = req.query;

    if (!id || !title) {
      return res.status(400).json({ error: "id and title query parameters required" });
    }

    // Dynamic timestamp
    const tm = Math.floor(Date.now() / 1000);

    // ⚠️ The 'h' hash is dynamic — in production you need to generate it or fetch from playlist.php
    const H = "GENERATED_HASH_HERE"; // Placeholder

    const playlistUrl = `https://net51.cc/playlist.php?id=${id}&t=${encodeURIComponent(title)}&tm=${tm}&h=${H}`;

    const response = await axios.get(playlistUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "Referer": `https://net51.cc/play.php?id=${id}`
      }
    });

    res.status(200).json({
      success: true,
      playlist: response.data
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to fetch playlist" });
  }
}
