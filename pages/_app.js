import { GoogleTagManager } from "@next/third-parties/google";

import "../styles/globals.css";
import Script from "next/script";
import ChatbotWidget from "../components/ChatbotWidget";

export default function App({ Component, pageProps }) {
  return (
    <>
      <GoogleTagManager gtmId="GTM-KVH3WTXH" />
      <Component {...pageProps} />
      <ChatbotWidget />
    </>
  );
}
