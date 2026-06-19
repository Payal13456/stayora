import "../styles/globals.css";
import ChatbotWidget from "../components/ChatbotWidget";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <ChatbotWidget />
    </>
  );
}
