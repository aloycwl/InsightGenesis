import { useEffect as E, useState as S } from "react";
import axios from "axios";

export default () => {
  const [y, z] = S<any>(null);

  E(() => {
    const fetchData = async () => {
      const p = new URLSearchParams(window.location.search),
        e = p.get("e"),
        c = p.get("c"),
        n = p.get("n"),
        d = (await axios.get(`/foot?e=${e}&c=${c}&n=${n}`)).data;

      z(d);

      if (d.customer) {
        await fetch("/store", {
          method: "POST",
          headers: {
            addr: localStorage.getItem("a") || "",
            type: "1",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(d),
        });
      }
    };

    fetchData();
  }, []);

  return (
    <pre style={{ maxHeight: "100%", overflow: "auto" }}>
      {y ? JSON.stringify(y, null, 2) : "Loading..."}
    </pre>
  );
};
