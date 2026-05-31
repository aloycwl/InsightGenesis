import { dbCID } from "./supabase.js";
import { error, info, serializeError } from "./logger.js";

let cid;

export async function mm(a) {
  try {
    for (let i = 0; i < a; i++) {
      cid = await dbCID();
      info("migration_cid_loaded", { cid });
    }
  } catch (err) {
    error("migration_mint_error", { error: serializeError(err) });
    return { success: false, error: err.message };
  }
}
