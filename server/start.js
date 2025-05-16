import express from "express";
import path from "path";
import { ci, cr, MA } from "./config.js";
import { dbAuth as da } from "./supabase.js";
import { Magic } from "@magic-sdk/admin";
import { upload as up, referral as sr } from "./onchain.js";
import { digiPrint, getIframe } from "./ig.js";

const ap = express();
ap.set("view engine", "ejs");
ap.set("views", path.join(process.cwd(), "views"));
ap.use(express.json());

ap.get("/", (_, re) => {
  re.render("login");
});

ap.get("/referral", da, async (rq, re) => {
  await sr(rq.headers.to, rq.headers.from);
  re.sendStatus(200);
});

ap.get("/scan", async (_, re) => {
  const fr = await getIframe();
  re.render("scan", { fr });
});

ap.get("/topup", (_, re) => {
  re.render("topup", { ci, cr });
});

ap.post("/upload", da, async (rq, re) => {
  await up(rq.body, rq.headers.addr, rq.headers.type, rq.addr);
  re.sendStatus(200);
});

ap.post("/session", async (req, res) => {
  try {
    const didToken = req.headers.authorization?.split("Bearer ")[1];
    const magic = new Magic(MA);
    magic.token.validate(didToken);
    const metadata = await magic.users.getMetadataByToken(didToken);

    res.json({ success: true, wallet: metadata.publicAddress, email: metadata.email });
  } catch (err) {
    console.error(err);
    res.status(401).json({ success: false, error: "Invalid token" });
  }
});

/* FOR TESTING ONLY */
ap.post("/digiPrint", da, async (_, rs) => {
  rs.send(await digiPrint());
});

ap.post("/getIframe", da, async (_, rs) => {
  rs.send(await getIframe());
});

ap.listen(80, () => {});
