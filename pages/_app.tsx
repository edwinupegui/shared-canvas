import "../common/styles/global.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { ToastContainer } from "react-toastify";
import { RecoilRoot } from "recoil";

import ModalManager from "@/common/components/modal/components/ModalManager";

import "react-toastify/dist/ReactToastify.min.css";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width" />
        <meta name="description" content="Create and draw with your friends." />
        <meta name="keywords" content="Keywords" />
        <title>Shared Canvas | Real-time Whiteboard</title>

        <link rel="manifest" href="/manifest.json" />
        <link
          href="/shared-canvas-logo.png"
          rel="icon"
          type="image/png"
          sizes="16x16"
        />
        <link
          href="/shared-canvas-logo.png"
          rel="icon"
          type="image/png"
          sizes="32x32"
        />
        <link rel="apple-touch-icon" href="/shared-canvas-logo.png"></link>
        <meta name="theme-color" content="#3700B3" />
      </Head>
      <RecoilRoot>
        <ToastContainer />
        <ModalManager />
        <Component {...pageProps} />
      </RecoilRoot>
    </>
  );
};

export default App;
