import { dbCID } from "./supabase.js";

let cid;

export async function mm(a) {
  try {
    for (let i = 0; i < a; i++) {
      cid = await dbCID();

      console.log(cid);
    }
  } catch (error) {
    console.error("Error during migration and minting:", error);
    return { success: false, error: error.message };
  }
}
