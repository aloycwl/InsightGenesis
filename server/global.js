import { ethers as et } from "ethers";
import * as de from "dotenv";

de.config();

export const ci = "0x4E6766019a3CA4f9951609f147F9Ebc3dcf4Bf6c";
export const ig = "https://api.insightgenie.ai/";
export const pg = "amber-implicit-jay-463.mypinata.cloud";
export const pv = new et.JsonRpcProvider(
  "https://data-seed-prebsc-1-s1.bnbchain.org:8545/",
);
export const su = "https://uxxfyiukhlsahcyszutt.supabase.co";

export const { PJ, PK, SB, IK, IS } = process.env;
