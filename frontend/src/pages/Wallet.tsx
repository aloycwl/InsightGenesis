import { useEffect as E } from "react";
import { Magic as M } from "magic-sdk";
import { mp } from "../../config";

export default () => {
  E(() => {
    (async () => {
      const magic = new M(mp);
      if (await magic.user.isLoggedIn()) await magic.wallet.showUI();
      else window.location.href = "/";
    })();
  }, []);
  return <></>;
};
