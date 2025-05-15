import { ethers as et } from "ethers";
import * as de from "dotenv";

de.config();

export const ci = "0xe4162Fb9f03F2e8bF8022F4E236FAce93efaf5AA";
export const ig = "https://api.insightgenie.ai/";
export const pg = "amber-implicit-jay-463.mypinata.cloud";
export const pv = new et.JsonRpcProvider(
  "https://data-seed-prebsc-1-s1.bnbchain.org:8545/",
);
export const su = "https://uxxfyiukhlsahcyszutt.supabase.co";

export const { PJ, PK, SB, IK, IS } = process.env;
