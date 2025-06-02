import { useEffect as E } from "react";
import { ethers as H } from "ethers";
import { ci, cr } from "../../config";

export default () => {
  E(() => {
    let A: string;
    let P: H.providers.Web3Provider;
    let M: H.BigNumber;

    async function init() {
      M = H.utils.parseUnits(
        new URLSearchParams(window.location.search).get("amt") || "100",
        18,
      );

      if (!window.ethereum) return;

      const chainId = "0x42A";
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId }],
        });
      } catch (e) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId,
              chainName: "L1X",
              nativeCurrency: { name: "L1X", symbol: "L1X", decimals: 18 },
              rpcUrls: ["https://v2-mainnet-rpc.l1x.foundation/"],
            },
          ],
        });
        window.location.reload();
      }

      A = await P.getSigner().getAddress();
      P = new H.providers.Web3Provider(window.ethereum);

      if (!(await checkApproval())) await approve();

      await topup();
    }

    async function checkApproval(): Promise<boolean> {
      return (
        await new H.Contract(
          cr,
          ["function allowance(address, address)view returns(uint256)"],
          P,
        ).allowance(A, ci)
      ).gte(M);
    }

    async function approve() {
      await (
        await new H.Contract(
          cr,
          ["function approve(address, uint256)"],
          P.getSigner(),
        ).approve(ci, M)
      ).wait();
    }

    async function topup() {
      await new H.Contract(
        ci,
        ["function topup(uint256)"],
        P.getSigner(),
      ).topup(M);
    }

    init();
  }, []);

  return <>Paying...</>;
}
