import { useEffect as E, useRef as R, useState as S } from "react";

interface M {
  action?: string;
  analysisData?: { vitalSigns?: any };
}

export default () => {
  const [a, b] = S<string | null>(null),
    [c, d] = S<string>(""),
    v = R<HTMLVideoElement | null>(null),
    r = R<MediaRecorder | null>(null),
    k = R<Blob[]>([]),
    [n, o] = S<boolean>(false);

  E(() => {
    b(localStorage.getItem("a"));
    o(/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
  }, []);

  E(() => {
    if (!a) return;

    async function setupMedia() {
      const p = new URLSearchParams(window.location.search);
      d(
        await (
          await fetch(`/iframe?g=${p.get("g")}&y=${p.get("y")}`, {
            headers: { auth: localStorage.getItem("s") || "" },
          })
        ).text(),
      );
      if (n) return;

      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: true,
      });
      if (v.current) v.current.srcObject = s;
      r.current = new MediaRecorder(s);
      r.current.ondataavailable = (e: BlobEvent) => {
        if (e.data.size > 0) k.current.push(e.data);
      };
      r.current.onstop = async () => {
        // const l = new File(
        //   [new Blob(k.current, { type: "video/webm" })],
        //   `${a}_${Date.now()}.webm`,
        // );
        s.getTracks().forEach((z) => z.stop());
        // await fetch(
        //   `https://api.github.com/repos/aloycwl/v/contents/${l.name}`,
        //   {
        //     method: "PUT",
        //     headers: {
        //       Authorization: `Bearer ${await (await fetch("/github")).text()}`,
        //       "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify({
        //       message: "_",
        //       content: btoa(
        //         new Uint8Array(await l.arrayBuffer()).reduce(
        //           (data, byte) => data + String.fromCharCode(byte),
        //           "",
        //         ),
        //       ),
        //     }),
        //   },
        // );
      };
    }

    setupMedia();

    function h(event: MessageEvent<M>) {
      if (!a || !r.current) return;
      const d = event.data;
      if (d.action === "onAnalysisStart") r.current.start();
      if (d.analysisData && d.analysisData.vitalSigns) {
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
    <iframe allow="camera;microphone;fullscreen;display-capture" src={c} />
  );
};
