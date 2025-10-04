import axios from "axios";

const USER_TOKEN = "9d4c12ba53ebf19cd863028316c8f1d6";
const T_HASH_T = "8118a1bb8126e910ff2b852e35ee4bcc::2a83eb6cb493b0205e5a9d79b44b3680::1759558767::ni";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { id, title } = req.query;
    if (!id || !title) {
      return res.status(400).json({ error: "id and title query parameters required" });
    }

    const tm = Math.floor(Date.now() / 1000);

    // Playlist.php URL with t_hash_t
    const playlistUrl = `https://net51.cc/playlist.php?id=${id}&t=${encodeURIComponent(title)}&tm=${tm}&h=${encodeURIComponent(T_HASH_T)}`;

    const response = await axios.get(playlistUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "Referer": `https://net51.cc/play.php?id=${id}`,
        "Cookie": `user_token=${USER_TOKEN}; t_hash_t=${T_HASH_T}`
      },
      timeout: 8000
    });

    if (!response.data) {
      return res.status(404).json({ error: "No playlist data found" });
    }

    // Return JSON with playlist / HLS URL
    res.status(200).json({
      success: true,
      playlist: response.data
    });

  } catch (err) {
    console.error("Error fetching playlist:", err.message);
    res.status(500).json({ error: "Failed to fetch playlist" });
  }
}
