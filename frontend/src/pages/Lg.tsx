import { useEffect as U } from "react";
import { Magic as M } from "magic-sdk";
import { OAuthExtension as O } from "@magic-ext/oauth2";
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

export default function Lg() {
  U(() => {
    (async () => {
      const m = new M(mp, { extensions: [new O()] }),
        q = new URLSearchParams(window.location.search),
        r = q.get("ref"),
        p = (q.get("t") ||
          sessionStorage.getItem("provider")) as OAuthProvider | null;
      if (r) sessionStorage.setItem("r", r);
      if (p) sessionStorage.setItem("p", p);

      try {
        await m.oauth2.getRedirectResult({});
      } catch (e) {}

      if (await m.user.isLoggedIn()) {
        sessionStorage.setItem(
          "a",
          (await m.user.getInfo()).publicAddress ?? "",
        );
        sessionStorage.removeItem("p");
        window.location.href = "/scan";
      } else if (p) {
        m.oauth2.loginWithRedirect({
          provider: p,
          redirectURI: `${window.location.origin}/lg`,
        });
      }
    })();
  }, []);

  return <div>Loading...</div>;
}
