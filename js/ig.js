import axios from "axios";
import fetch from "node-fetch";
import ffmpegPath from "ffmpeg-static";
import fs from "fs";
import FormData from "form-data";
import { dbV as D } from "./supabase.js";
import { execa as X } from "execa";
import { store as O } from "./onchain.js";
import { aa, IK, IS } from "./config.js";
const I = "https://api.insightgenie.ai/";

async function auth() {
  try {
    return {
      Authorization: `Bearer ${
        (await axios.post(`${I}auth/authenticate`, { key: IK, secret: IS }))
          .data.token
      }`,
    };
  } catch (e) {
    return e;
  }
}

export async function print(e, c, n) {
  try {
    return (
      await axios.post(
        `${I}digital-footprint`,
        { email: e, phoneCode: c, phoneNumber: n },
        { headers: await auth() },
      )
    ).data;
  } catch (e) {
    return e;
  }
}

export async function iframe(g, y) {
  try {
    return (
      await axios.post(
        `${I}face-scan/generate-video-token`,
        {
          clientId: "igai",
          age: parseInt(y),
          gender: g,
          showResults: "display",
          isVoiceAnalysisOn: false,
          forceFrontCamera: true,
        },
        { headers: await auth() },
      )
    ).data.videoIframeUrl;
  } catch (e) {
    return e;
  }
}

// export async function voice(f, v, a, r) {
//   try {
//     const n = `${a}_${Date.now()}_v.aac`,
//       p = `tmp/${n}`,
//       d = new FormData();

//     await X(ffmpegPath, ["-i", f.path, "-c:a", "aac", p]);
//     d.append("audio", fs.createReadStream(p));
//     d.append("isSendingWebHookToInstitution", "false");
//     d.append("audioServiceType", await D(v));
//     d.append("channelType", "0");
//     fs.unlink(f.path, () => {});

//     const h = await auth(),
//       s = (
//         await (
//           await fetch(`${I}upload-file/audio`, {
//             method: "POST",
//             headers: h,
//             body: d,
//           })
//         ).json()
//       ).id;

//     let t;

//     while (true) {
//       const j = await (
//         await fetch(`${I}get-score?id=${s}`, { headers: h })
//       ).json();
//       console.log(j);
//       if (j.scoreId) {
//         t = j;
//         break;
//       }
//       await new Promise((resolve) => setTimeout(resolve, 2000));
//     }

//     O(t, a, v, aa);
//     fs.unlink(p, () => {});

//     return r.json(t);
//   } catch (e) {
//     return e;
//   }
// }

export async function voice(f, v, a, r) {
  try {
    const n = `${a}_${Date.now()}_v.aac`;
    const p = `tmp/${n}`;
    const d = new FormData();

    console.log("Starting voice analysis...");

    // Convert audio to AAC
    await X(ffmpegPath, ["-i", f.path, "-c:a", "aac", p]);

    console.log("Audio converted:", p);

    // Prepare upload form
    d.append("audio", fs.createReadStream(p));
    d.append("isSendingWebHookToInstitution", "false");
    d.append("audioServiceType", await D(v));
    d.append("channelType", "0");

    // Remove original upload
    fs.unlink(f.path, () => {});

    const h = await auth();

    console.log("Uploading audio to InsightGenie...");

    // Upload audio
    const uploadRes = await axios.post(`${I}upload-file/audio`, d, {
      headers: {
        ...h,
        ...d.getHeaders(),
      },
    });

    const s = uploadRes.data.id;

    if (!s) {
      throw new Error("Upload failed: no job id returned");
    }

    console.log("Upload successful. Job ID:", s);

    // Poll for result
    let t = null;
    let attempts = 0;
    const maxAttempts = 60; // 2 minutes max

    while (attempts < maxAttempts) {
      const j = (await axios.get(`${I}get-score?id=${s}`, { headers: h })).data;

      console.log("Polling result:", j);

      if (j.scoreId) {
        t = j;
        break;
      }

      attempts++;

      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    if (!t) {
      console.error("Voice analysis timeout");

      return r.status(504).json({
        success: false,
        message: "Voice analysis timed out",
      });
    }

    console.log("Voice analysis complete");

    // Store on-chain
    await O(t, a, v, aa);

    // Clean up converted file
    fs.unlink(p, () => {});

    return r.json({
      success: true,
      data: t,
    });
  } catch (e) {
    console.error("Voice processing error:", e);

    return r.status(500).json({
      success: false,
      message: "Voice processing failed",
      error: e.message || e,
    });
  }
}
