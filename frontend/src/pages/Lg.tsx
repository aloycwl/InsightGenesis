import { useEffect as E } from "react";
import { Magic as M } from "magic-sdk";
import { OAuthExtension as O } from "@magic-ext/oauth2";
import { r } from "./util";
import { mp } from "../../config";

type OAuthProvider =
  | "google"
  | "facebook"
  | "apple"
  | "github"
  | "linkedin"
  | "twitter"
  | "bitbucket"
  | "gitlab"
  | "twitch"
  | "microsoft"
  | "discord";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default () => {
  E(() => {
    if (!localStorage.getItem("r")) {
      localStorage.setItem("r", window.location.origin);
    }
    (async () => {
      const q = new URLSearchParams(window.location.search),
        t = q.get("t"),
        email = q.get("email");

      if (t === "metamask" && window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        localStorage.setItem("a", accounts[0]);
        r();
        return;
      }

      const m = new M(mp, { extensions: [new O()] });

      if (email) {
        await m.auth.loginWithMagicLink({ email });
        localStorage.setItem(
          "a",
          await (
            await fetch("/les", { headers: { m: await m.user.getIdToken() } })
          ).text(),
        );
        r();
        return;
      }

      if (t === "telegram") {
        await m.oauth2.loginWithPopup({ provider: "telegram" });
        localStorage.setItem("a", (await m.user.getInfo()).publicAddress ?? "");
        r();
        return;
      }

      const p = (t || localStorage.getItem("p")) as OAuthProvider | null;
      if (p) localStorage.setItem("p", p);

      try {
        await m.oauth2.getRedirectResult({});
      } catch (e) {}

      if (await m.user.isLoggedIn()) {
        localStorage.setItem("a", (await m.user.getInfo()).publicAddress ?? "");
        localStorage.removeItem("p");
        r();
      } else if (p) {
        m.oauth2.loginWithRedirect({
          provider: p,
          redirectURI: `${window.location.origin}/lg`,
        });
      }
    })();
  }, []);

  return <>Loading...</>;
};
