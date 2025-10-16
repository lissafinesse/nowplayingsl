const express = require("express");
const fetch = require("node-fetch");
const app = express();

// === EDIT THESE ===
const LASTFM_USERNAME = "iamjoat";
const LASTFM_API_KEY = "5caadbf2d57a6501fe0fd540e2b2c816";
// ==================

app.get("/nowplaying", async (req, res) => {
  try {
    const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${encodeURIComponent(LASTFM_USERNAME)}&api_key=${encodeURIComponent(LASTFM_API_KEY)}&format=json&limit=1`;
    const response = await fetch(url);
    const json = await response.json();

    const tracks = json?.recenttracks?.track;
    if (!tracks || tracks.length === 0) return res.status(204).send("");

    const track = tracks[0];
    const artist = track.artist?.["#text"] || "";
    const title = track.name || "";
    const album = track.album?.["#text"] || "";
    res.type("text/plain").send(`${artist}|${title}|${album}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});

app.get("/", (req, res) => res.send("Your Last.fm converter is running!"));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
