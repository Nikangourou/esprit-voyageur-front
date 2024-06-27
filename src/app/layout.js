import { Work_Sans, Contrail_One } from "next/font/google";
import "./globals.css";
import LoadShader from "./components/loadShader/loadShader";
import { SocketProvider } from "./context/socketContext";
import FooterBg from "./components/footer/footerBg";
import { Viewport } from "next";
import { gsap } from "gsap";

const work_sans = Work_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-work-sans",
});
const contrail_one = Contrail_One({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
  variable: "--font-contrail-one",
});

import StoreProvider from "./store/storeProvider";
import Blob from "./components/blob/blob";
import React from "react";
import ClipBlob from "./components/clipBlob/clipBlob";
import Header from "./components/header/header";
export const metadata = {
  title: "VraiMent?",
  description: "Le jeu qui fait douter tout le monde",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // Also supported by less commonly used
  // interactiveWidget: 'resizes-visual',
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${work_sans.variable} ${contrail_one.variable}`}
    >
      <body>
        <StoreProvider>
          <SocketProvider>
            <LoadShader />
            <Header />

            <div className="pageContainer">{children}</div>
            <FooterBg />
          </SocketProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
