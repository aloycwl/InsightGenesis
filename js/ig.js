import axios from "axios";
import fetch from "node-fetch";
import ffmpegPath from "ffmpeg-static";
import fs from "fs";
import fsp from "fs/promises";
import FormData from "form-data";
import { dbV as D } from "./supabase.js";
import { execa as X } from "execa";
import { store as O } from "./onchain.js";
import { aa, GH, IK, IS } from "./config.js";
const I = "https://api.insightgenie.ai/";

async function auth() {
  return {
    Authorization: `Bearer ${
      (await axios.post(`${I}auth/authenticate`, { key: IK, secret: IS })).data
        .token
    }`,
  };
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
}

export async function voice(f, v, a, r) {
  const n = `${a}_${Date.now()}_v.aac`,
    p = `tmp/${n}`,
    d = new FormData();

  await X(ffmpegPath, ["-i", f.path, "-c:a", "aac", p]);
  d.append("audio", fs.createReadStream(p));
  d.append("isSendingWebHookToInstitution", "false");
  d.append("audioServiceType", await D(v));
  d.append("channelType", "0");

  try {
    const h = await auth(),
      s = (
        await (
          await fetch(`${I}upload-file/audio`, {
            method: "POST",
            headers: h,
            body: d,
          })
        ).json()
      ).id;

    await fetch(`https://api.github.com/repos/aloycwl/v/contents/${n}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${GH}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "_",
        content: (await fsp.readFile(p)).toString("base64"),
      }),
    });

    let t;
    while (true) {
      const j = await (
        await fetch(`${I}get-score?id=${s}`, { headers: h })
      ).json();
      if (j.scoreId) {
        t = j;
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    O(t, a, v, aa);
    fs.unlink(f.path, () => {});
    fs.unlink(p, () => {});

    return r.json(t);
  } catch (e) {
    console.log(e);
  }
}
