import { useEffect as U } from "react";
import { Magic as M } from "magic-sdk";
import { OAuthExtension as O } from "@magic-ext/oauth2";
import { mp } from "../../config";

export default function Lg() {
  U(() => {
    (async () => {
      const m = new M(mp, { extensions: [new O()] }),
        r = new URLSearchParams(window.location.search).get("ref");
      if (r) sessionStorage.setItem("r", r);

      await m.oauth2.loginWithPopup({ provider: "telegram" });
      sessionStorage.setItem("a", (await m.user.getInfo()).publicAddress ?? "");
      window.location.href = "/scan";
    })();
  }, []);

  return <div>Loading...</div>;
}
