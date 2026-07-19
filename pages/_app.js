import { GoogleTagManager } from "@next/third-parties/google";

import "../styles/globals.css";
import Script from "next/script";
import ChatbotWidget from "../components/ChatbotWidget";
import SEO from "../components/SEO";

export default function App({ Component, pageProps }) {
  return (
    <>
      <SEO
        title="Homivo | Student PG & Hostel"
        description="Find verified PGs and hostels."
        image="https://myhomivo.com/logo.png"
        url="https://myhomivo.com/"
      />
      <GoogleTagManager gtmId="GTM-KVH3WTXH" />
      <Component {...pageProps} />
      <ChatbotWidget />
    </>
  );
}
