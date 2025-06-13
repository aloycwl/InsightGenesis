import { BrowserRouter as B, Routes as S, Route as R } from "react-router-dom";
import I from "./pages/Index";
import Lg from "./pages/Lg";
import Print from "./pages/Print";
import Scan from "./pages/Scan";
import Topup from "./pages/Topup";
import Voice from "./pages/Voice";
import Wallet from "./pages/Wallet";

export default function App() {
  return (
    <B>
      <S>
        <R path="/" element={<I />} />
        <R path="/lg" element={<Lg />} />
        <R path="/scan" element={<Scan />} />
        <R path="/print" element={<Print />} />
        <R path="/topup" element={<Topup />} />
        <R path="/voice" element={<Voice />} />
        <R path="/wallet" element={<Wallet />} />
      </S>
    </B>
  );
}
