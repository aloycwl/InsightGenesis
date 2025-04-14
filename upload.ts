import { PinataSDK } from "pinata";
import * as dotenv from "dotenv";

dotenv.config();

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT!,
  pinataGateway: "indigo-hard-perch-595.mypinata.cloud",
});

// const file = new File(["hello is this working?"], "Testing.txt", { type: "text/plain" });

// (async () => {
//   try {
//     console.log(await pinata.upload.public.file(file));
//   } catch (err) {
//     console.error(err);
//   }
// })();

console.log(pinata)