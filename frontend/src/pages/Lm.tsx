import { useEffect as E } from "react";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function Lm() {
  E(() => {
    (async () => {
      if (!window.ethereum) return;
      const r = new URLSearchParams(window.location.search).get("ref");
      if (r) sessionStorage.setItem("r", r);
      sessionStorage.setItem(
        "a",
        (await window.ethereum.request({ method: "eth_requestAccounts" }))[0],
      );
      window.location.href = "/scan";
    })();
  }, []);
  return <div>Loading...</div>;
}
