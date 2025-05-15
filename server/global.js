import { ethers as et } from "ethers";
import * as de from "dotenv";

de.config();

export const ci = "0x60821D4B0B64b09449974865881B4c26A44B18dB";
export const ig = "https://api.insightgenie.ai/";
export const pg = "amber-implicit-jay-463.mypinata.cloud";
export const pv = new et.JsonRpcProvider(
  "https://data-seed-prebsc-1-s1.bnbchain.org:8545/",
);
export const su = "https://uxxfyiukhlsahcyszutt.supabase.co";

export const { PJ, PK, SB, IK, IS } = process.env;
