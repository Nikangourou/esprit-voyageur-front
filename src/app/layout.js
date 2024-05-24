import { Work_Sans, Contrail_One } from "next/font/google";
import "./globals.css";
import LoadShader from "./components/loadShader/loadShader";
import { SocketProvider } from "./context/socketContext";
import FooterBg from "./components/footer/footerBg";

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
export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${work_sans.variable} ${contrail_one.variable}`}
    >
      <body>
        <StoreProvider>
          <LoadShader />
          <SocketProvider>
            {/*<ClipBlob*/}
            {/*  numPoints={20}*/}
            {/*  color={"red"}*/}
            {/*  minDuration={3}*/}
            {/*  maxDuration={4}*/}
            {/*  width={600}*/}
            {/*  height={600}*/}
            {/*  maxRadius={300}*/}
            {/*  minRadius={300}*/}
            {/*  active={true}*/}
            {/*  offset={200}*/}
            {/*></ClipBlob>{" "}*/}
            <div className="pageContainer">{children}</div>
            <FooterBg />
          </SocketProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
