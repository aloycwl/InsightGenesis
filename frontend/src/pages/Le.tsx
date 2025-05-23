import { useEffect as E } from "react";
import { Magic as M } from "magic-sdk";
import { mp } from "../../config";

export default function Le() {
  E(() => {
    (async () => {
      const p = new URLSearchParams(window.location.search),
        e = p.get("email"),
        r = p.get("ref");

      if (!e) return;
      if (r) sessionStorage.setItem("r", r);

      const m = new M(mp);
      await m.auth.loginWithMagicLink({ email: e });

      const s = await fetch("/les", {
        method: "POST",
        headers: {
          m: await m.user.getIdToken(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ e }),
      });

      sessionStorage.setItem("a", await s.text());

      window.location.href = "/scan";
    })();
  }, []);

  return <div>Loading...</div>;
}
