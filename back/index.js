import express from "express";
import cors from "cors";
import {spawn } from "child_process";
import status from "express-status-monitor";

const app = express();
const PORT = 5000;






app.use(status());
app.use(cors());
app.use(express.json());

// 🔍 Get video info
// app.post("/get-info", async (req, res) => {
//   const { url } = req.body;
//   if (!url) return res.status(400).json({ error: "URL required" });
//   videoUrlLink.youtube.getInfo(url, { hl: "en" }, (error, info) => {
//     if (error) {
//       console.error(error);
//     } else {
//       console.log(info.details);
//       console.log(info.formats);
//     }
//   });
//   // let videoInfo = await ytdl(url);

//   // console.log(videoInfo)
//   exec(`yt-dlp -J "${url}"`, (err, stdout, stderr) => {
//     if (err) return res.status(500).json({ error: stderr });
//     try {
//       const info = JSON.parse(stdout);
//       res.json({
//         title: info.title,
//         formats: info.formats.filter(
//           (f) => f.ext === "mp4" && f.vcodec !== "none" && f.filesize
//         ),
//         thumbnail: info.thumbnail,
//         uploader: info.uploader,
//         duration: info.duration,
//         url: info.url,
//       });
//     } catch (e) {
//       res.status(500).json({ error: "Error parsing video info" });
//     }
//   });
// });
// app.get("/", (req, res) => {
//   res.send("Welcome to the Video Downloader API! Use /download?url=YOUR_VIDEO_URL to download videos.");
// });
// app.get("/download", (req, res) => {
//   const { url, formatId } = req.query;
//   if (!url) return res.status(400).json({ message: "URL is required" });

//   const domain = new URL(url).hostname;
//   let title = "video";

//   // Step 1: Get title for filename
//   exec(`yt-dlp -J "${url}"`, (err, stdout) => {
//     if (!err) {
//       try {
//         const info = JSON.parse(stdout);
//         title = info.title.replace(/[^a-z0-9_\-]/gi, "_").substring(0, 80);
//       } catch (e) {}
//     }

//     const filename = `${title}.mp4`;
//     res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
//     res.setHeader("Content-Type", "video/mp4");

//     let formatSelector;

//     // Step 2: Detect platform & choose format selector
//     if (domain.includes("youtube.com") || domain.includes("youtu.be")) {
//       if (!formatId)
//         return res
//           .status(400)
//           .json({ message: "formatId required for YouTube" });
//       formatSelector = `${formatId}+bestaudio`;
//     } else {
//       // Instagram, Facebook, etc. – fallback
//       formatSelector =
//         "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best";
//     }

//     // Step 3: Spawn yt-dlp stream

//     // const ytProcess1 = spawn("yt-dlp", [
//     //   "-f",
//     //   `${formatSelector}+bestaudio`,
//     //   "--merge-output-format",
//     //   "mp4",
//     //   "--downloader",
//     //   "aria2c",
//     //   "--downloader-args",
//     //   'aria2c:"-x 16 -s 16 -k 1M"',
//     //   "--no-playlist",
//     //   "--no-part",
//     //   "-o",
//     //   "-", // stream output
//     //   url,
//     // ]);
//     // ytProcess1.stdout.pipe(res);
//     // ytProcess1.stderr.on("data", (data) => {
//     //   console.error("yt-dlp error:", data.toString());
//     // });
//     // ytProcess1.on("close", (code) => {
//     //   if (code !== 0) {
//     //     console.error("yt-dlp exited with code:", code);
//     //     res.end();
//     //   }
//     // });
//     res.setHeader("Transfer-Encoding", "chunked");
//     const ytProcess = spawn("yt-dlp", [
//       "-f",
//       `${formatSelector}+bestaudio`,
//       "--merge-output-format",
//       "mp4",
//       "--concurrent-fragments",
//       "100",
//       "--no-playlist",
//       "--no-part",
//       "-o",
//       "-",
//       url,
//     ]);

//     res.download = true; // Enable streaming download
//     // res.setHeader("Content-Type", "video/mp4");
//     // res.setHeader("Content-Length", ""); // Let the client know we're streaming
//     // res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
//     // res.setHeader("Pragma", "no-cache");

//     ytProcess.stdout.pipe(res);

//     ytProcess.stderr.on("data", (data) => {
//       console.error("yt-dlp error:", data.toString());
//     });
//     ytProcess.on("error", (err) => {
//       // console.error("yt-dlp failed:", err);
//       res.status(500).send("Download failed.");
//     });

//     ytProcess.on("close", (code) => {
//       if (code !== 0) {
//         // console.error("yt-dlp exited with code:", code);
//         res.end();
//       }
//     });
//   });
// });

// app.get("/api/insta/download/:url", async (req, res) => {
//   const { url } = req.params;
//   if (!url || !url.startsWith("http")) {
//     return res.status(400).json({ error: "Invalid URL" });
//   }

//   const filename = `instagram_video_${Date.now()}.mp4`;

//   // Set download headers
//   res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
//   res.setHeader("Content-Type", "video/mp4");

//   const ytdlp = spawn("yt-dlp", [
//     "-f", "bv*+ba/best", // best video+audio
//     "--merge-output-format", "mp4",
//     "-o", "-", // output to stdout
//     url,
//   ]);

//   ytdlp.stdout.pipe(res); // stream to client

//   ytdlp.stderr.on("data", (d) => console.error("yt-dlp:", d.toString()));

//   ytdlp.on("close", (code) => {
//     if (code !== 0) {
//       console.error("❌ yt-dlp exited with code", code);
//       if (!res.headersSent) {
//         res.status(500).end("Failed to download video");
//       }
//     }
//   });
// });

app.post("/get-info/youtube", async (req, res) => {
  const encodedUrl = req.body.url;
  const url = decodeURIComponent(encodedUrl);

  if (!url || !url.includes("youtube.com") && !url.includes("youtu.be")) {
    return res.status(400).json({ error: "Invalid YouTube URL" });
  }

  const ytdlp = spawn("yt-dlp", ["--dump-json", url]);

  let jsonString = "";

  ytdlp.stdout.on("data", (data) => {
    jsonString += data.toString();
  });

  ytdlp.stderr.on("data", (data) => {
    console.error("yt-dlp stderr:", data.toString());
  });

  ytdlp.on("close", (code) => {
    if (code !== 0) {
      return res.status(500).json({ error: "yt-dlp exited with code " + code });
    }

    try {
      const json = JSON.parse(jsonString);
      const { title, formats, uploader, duration, thumbnails } = json;

   const cleanFormats = formats
  .filter(
    (f) =>
      f.ext !== 'mhtml' &&
      !(f.url && f.url.includes('manifest.googlevideo.com'))
  )
  .map((f) => ({
    format_note: f.format_note,
    format_id: f.format_id,
    ext: f.ext,
    resolution: f.resolution || `${f.height || "?"}p`,
    vcodec: f.vcodec,
    acodec: f.acodec,
    filesize: f.filesize,
    url: f.url,
  }));
      res.json({
        platform: "YouTube",
        title,
        uploader,
        duration,
        thumbnail: thumbnails?.[thumbnails.length - 1]?.url,
        availableFormats: cleanFormats,
      });
    } catch (err) {
      console.error("Failed to parse yt-dlp JSON:", err.message);
      res.status(500).json({ error: "Failed to parse video info" });
    }
  });
});
app.post("/get-info/insta", async (req, res) => {
  const encodedUrl = req.body.url;
  const url = decodeURIComponent(encodedUrl);

//   if (!url || !url.includes("youtube.com") && !url.includes("youtu.be")) {
//     return res.status(400).json({ error: "Invalid YouTube URL" });
//   }

  const ytdlp = spawn("yt-dlp", ["--dump-json", url]);

  let jsonString = "";

  ytdlp.stdout.on("data", (data) => {
    jsonString += data.toString();
  });

  ytdlp.stderr.on("data", (data) => {
    console.error("yt-dlp stderr:", data.toString());
  });

  ytdlp.on("close", (code) => {
    if (code !== 0) {
      return res.status(500).json({ error: "yt-dlp exited with code " + code });
    }

    try {
      const json = JSON.parse(jsonString);
      const { title, formats, uploader, duration, thumbnail, description } = json;



      // thumbnail: thumbnails?.[0]?.url,
      // json,
      res.json({
        platform: "Instagram",
        title,
        uploader,
        duration,
        description,
        thumbnail,
        availableFormats: formats,
      });
    } catch (err) {
      console.error("Failed to parse yt-dlp JSON:", err.message);
      res.status(500).json({ error: "Failed to parse video info" });
    }
  });
});
app.post("/get-info/x", async (req, res) => {
  const encodedUrl = req.body.url;
  const url = decodeURIComponent(encodedUrl);

//   if (!url || !url.includes("youtube.com") && !url.includes("youtu.be")) {
//     return res.status(400).json({ error: "Invalid YouTube URL" });
//   }

  const ytdlp = spawn("yt-dlp", ["--dump-json", url]);

  let jsonString = "";

  ytdlp.stdout.on("data", (data) => {
    jsonString += data.toString();
  });

  ytdlp.stderr.on("data", (data) => {
    console.error("yt-dlp stderr:", data.toString());
  });

  ytdlp.on("close", (code) => {
    if (code !== 0) {
      return res.status(500).json({ error: "yt-dlp exited with code " + code });
    }

    try {
      const json = JSON.parse(jsonString);
      const { title, formats, uploader, duration, thumbnails, description  } = json;
  // res.json({
  //   json
  // });
      res.json({
        platform: "X",
        title,
        uploader,
        duration,
        description,
        thumbnail: thumbnails?.[0]?.url,
        availableFormats: formats,
      });
    } catch (err) {
      console.error("Failed to parse yt-dlp JSON:", err.message);
      res.status(500).json({ error: "Failed to parse video info" });
    }
  });
});
// app.get("/api/insta/debug/:url", async (req, res) => {
//   const encodedUrl = req.params.url;
//   const url = decodeURIComponent(encodedUrl);

//   if (!url || !url.startsWith("http")) {
//     return res.status(400).json({ error: "Invalid URL" });
//   }

//   const ytdlp = spawn("yt-dlp", [
//     "--dump-json",
//     url,
//   ]);

//   let jsonString = "";

//   ytdlp.stdout.on("data", (data) => {
//     jsonString += data.toString();
//   });

//   ytdlp.stderr.on("data", (data) => {
//     console.error("yt-dlp stderr:", data.toString());
//   });

//   ytdlp.on("close", (code) => {
//     if (code !== 0) {
//       return res.status(500).json({ error: "yt-dlp exited with code " + code });
//     }

//     try {
//       const json = JSON.parse(jsonString);
//       const { title, formats, uploader, duration } = json;

//       const cleanFormats = formats.map((f) => ({
//         format_id: f.format_id,
//         ext: f.ext,
//         resolution: f.resolution || `${f.height || "?"}p`,
//         vcodec: f.vcodec,
//         acodec: f.acodec,
//         filesize: f.filesize,
//         format_note: f.format_note,
//         url: f.url,
//       }));

//       res.json({
//         title,
//         uploader,
//         duration,
//         availableFormats: cleanFormats,
//       });
//     } catch (err) {
//       console.error("Failed to parse yt-dlp JSON:", err.message);
//       res.status(500).json({ error: "Failed to parse video info" });
//     }
//   });
// });
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
