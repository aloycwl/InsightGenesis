import { ethers } from "ethers";
import * as dotenv from "dotenv";
dotenv.config();

const pv = new ethers.JsonRpcProvider("https://data-seed-prebsc-1-s1.bnbchain.org:8545/");
const contract = new ethers.Contract("0xF70068E66527294f6073bF7a39414E2B12a03C8f",
  ["function store(string calldata, address) external"], pv);

async function callFunction() {
  const tx = await contract.connect(new ethers.Wallet(process.env.PK!, pv)).
    setValue("someIPFScidthatis59byteslongjuztoadd21characters");
  await tx.wait();
  console.log("Transaction confirmed!");
}

callFunction();

// [
//   {
//     "inputs": [
//       {
//         "internalType": "string",
//         "name": "_data",
//         "type": "string"
//       },
//       {
//         "internalType": "address",
//         "name": "_account",
//         "type": "address"
//       }
//     ],
//     "name": "store",
//     "outputs": [],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   }
// ]