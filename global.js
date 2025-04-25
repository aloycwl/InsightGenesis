import { ethers } from "ethers";
import * as dotenv from "dotenv";

dotenv.config();

export const ci = "0xAC2E907D1d7348F22770Ff1D693bF03d01847991";

export const pv = new ethers.JsonRpcProvider(
  "https://data-seed-prebsc-1-s1.bnbchain.org:8545/",
);
