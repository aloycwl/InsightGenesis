import { BrowserRouter as B, Routes as S, Route as R } from "react-router-dom";
import Le from "./pages/Le";
import Lg from "./pages/Lg";
import Lm from "./pages/Lm";
import Lt from "./pages/Lt";
import Scan from "./pages/Scan";
import Topup from "./pages/Topup";

export default function App() {
  return (
    <B>
      <S>
        <R path="/le" element={<Le />} />
        <R path="/lg" element={<Lg />} />
        <R path="/lm" element={<Lm />} />
        <R path="/lt" element={<Lt />} />
        <R path="/scan" element={<Scan />} />
        <R path="/topup" element={<Topup />} />
      </S>
    </B>
  );
}