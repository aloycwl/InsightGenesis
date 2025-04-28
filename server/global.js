import { ethers } from "ethers";
import * as de from "dotenv";

de.config();

export const ci = "0xD328b769BA02D1f68c46BdE2ec6D92eaf6CD7052";

export const pv = new ethers.JsonRpcProvider(
  "https://data-seed-prebsc-1-s1.bnbchain.org:8545/",
);

export const su = "https://uxxfyiukhlsahcyszutt.supabase.co";
