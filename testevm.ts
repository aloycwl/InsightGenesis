import { ethers } from "ethers";
import * as dotenv from "dotenv";
dotenv.config();


const provider = new ethers.JsonRpcProvider("https://data-seed-prebsc-1-s1.bnbchain.org:8545/");

const signer = new ethers.Wallet(process.env.PK!, provider);

// Example: ABI + contract address
const abi = [
  "function myFunction(uint256 value) public view returns (uint256)", // view/pure
  "function setValue(uint256 value) public"                            // write
];
const contractAddress = "0xF70068E66527294f6073bF7a39414E2B12a03C8f";

const contract = new ethers.Contract(contractAddress, abi, provider);

async function callFunction() {
  // For read-only functions
  const result = await contract.myFunction(42);
  console.log("Function result:", result.toString());
}

callFunction();