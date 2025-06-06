import { useEffect as E, useState as S } from "react";

export default () => {
  const [s, r] = S(45);
  const [w, x] = S("");
  const [y, z] = S(false);

  E(() => {
    const t = setInterval(() => {
      r((prev) => {
        if (prev <= 1) {
          clearInterval(t);
          z(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const o = async () => {
      const s = await navigator.mediaDevices.getUserMedia({ audio: true }),
        r = new MediaRecorder(s),
        c: Blob[] = [];

      r.ondataavailable = (e) => {
        if (e.data.size > 0) c.push(e.data);
      };

      r.onstop = async () => {
        const f = new FormData();
        f.append("audio", new Blob(c, { type: "audio/webm" }), "v");
        f.append("v", new URLSearchParams(location.search).get("v") || "");
        f.append("a", localStorage.getItem("a") || "");

        const j = await (
          await fetch("/v", {
            method: "POST",
            body: f,
            headers: { auth: localStorage.getItem("s") || "" },
          })
        ).text();
        x(j);
      };

      r.start();

      setTimeout(() => {
        r.stop();
        s.getTracks().forEach((k) => k.stop());
      }, 45e3);
    };

    o();

    return () => clearInterval(t);
  }, []);

  return (
    <>
      {!y ? (
        <p>Start talking now, {s}s left</p>
      ) : w ? (
        <pre>{JSON.stringify(JSON.parse(w), null, 2)}</pre>
      ) : (
        <p>Processing...</p>
      )}
    </>
  );
};
