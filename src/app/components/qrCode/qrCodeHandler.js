"use client";

import styles from "./qrCodeHandler.module.scss";
import QrCode from "./qrCode";

import { useContext, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { SocketContext } from "../../context/socketContext";
import { useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Button from "../button/button";
import Footer from "../footer/footer";

export default function Code() {
  const players = useSelector((state) => state.players.players);
  const searchParams = useSearchParams();
  const gameId = searchParams.get("gameId");

  const currentBluffer = useSelector((state) => state.players.currentBluffer);
  const colorStyle =
    currentBluffer && currentBluffer != ""
      ? players[currentBluffer].color
      : "#373FEF";
  console.log(currentBluffer);
  const shape = (
    <svg
      width="432"
      height="409"
      viewBox="0 0 432 409"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M-98.6053 238.561C-115.265 170.337 -124.419 124.661 -125.304 55.4711L-125.306 55.4854C-126.62 -45.9528 -42.5727 -65.0185 33.4093 -91.3035C109.265 -117.547 188.766 -122.756 204.765 -116.875C258.839 -96.9693 299.096 -51.3716 321.271 -31.1141C413.224 52.8475 433.889 221.277 329.739 259.649C281.828 277.309 226.941 283.761 201.055 336.106C161.404 416.262 93.7446 370.035 3.03914 316.602C-10.3503 308.721 -85.9517 290.412 -98.6053 238.561Z"
        fill={colorStyle}
      />
      <path
        d="M-116.176 218.032C-134.396 168.573 -144.675 135.523 -147.79 85.8653L-147.792 85.8755C-152.375 13.072 -72.3549 2.02401 -0.309905 -14.4546C71.6151 -30.9072 147.728 -32.1578 163.271 -27.4391C215.808 -11.47 255.929 22.4964 277.87 37.7206C368.85 100.822 394.195 222.284 295.518 246.552C250.125 257.721 197.671 260.634 174.548 297.371C139.127 353.628 72.6929 318.354 -16.0907 277.189C-29.1961 271.118 -102.337 255.621 -116.176 218.032Z"
        fill="#EFEBE2"
      />
    </svg>
  );

  // useEffect(() => {
  //   if (socket && !isReady.current) {
  //     isReady.current = true;
  //     socket.emit("connexionPrimary", gameId);
  //   }
  //   const handleNextPage = () => {
  //     console.log("tewt");
  //     // Rediriger vers la page suivante avec le gameId en paramètre
  //     router.push(`/game?gameId=${gameId}`);
  //   };
  //
  //   socket.on("startChrono", handleNextPage);
  //   console.log("on");
  //   return () => {
  //     console.log("socketClose");
  //     socket.off("startChrono", handleNextPage);
  //   };
  // }, [socket, gameId]);

  return (
    <main className={styles.main}>
      <div className={styles.shape}>{shape}</div>
      <section className={styles.content}>
        <img src="/images/bluffer-title.svg" alt="Joueurs" />
        <p>Scanne le QR code et isole toi...</p>
        <div className={styles.qrCode}>
          <QrCode gameId={gameId} currentBluffer={currentBluffer} />
        </div>
      </section>
      <Footer>
        <div>
        <p> <span className={styles.currentBluffer} style={{color : colorStyle}}>{currentBluffer}</span>  doit s'isoler</p>
        <div className={styles.playerColors}>
                <div
                  key={currentBluffer}
                  style={{ backgroundColor: colorStyle }}
                  className={styles.playerColor}
                />
            </div>
        </div>
      </Footer>
    </main>
  );
}
