import { ethers } from "ethers";
import * as dotenv from "dotenv";
dotenv.config();

const pv = new ethers.JsonRpcProvider("https://data-seed-prebsc-1-s1.bnbchain.org:8545/");

async function callFunction() {
  const tx = await new ethers.Contract("0xF70068E66527294f6073bF7a39414E2B12a03C8f",
    ["function store(string calldata, address) external"], pv).
    connect(new ethers.Wallet(process.env.PK!, pv)).
    store("someIPFScidthatis59byteslongjuztoadd21characters", "0xA34357486224151dDfDB291E13194995c22Df505");
  await tx.wait();
  console.log("200");
}

callFunction();