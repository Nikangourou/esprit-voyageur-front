import { Inter } from "next/font/google";
import "./globals.css";
import LoadShader from "./components/loadShader/loadShader";
import { SocketProvider } from "./context/socketContext";
import FooterBg from "./components/footer/footerBg";

const inter = Inter({ subsets: ["latin"] });
import StoreProvider from "./store/storeProvider";
export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StoreProvider>
          <LoadShader />
          <SocketProvider>
            <div className="pageContainer">{children}</div>
            <FooterBg />
          </SocketProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
