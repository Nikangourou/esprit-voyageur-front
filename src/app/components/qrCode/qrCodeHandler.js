"use client";

import styles from "./qrCodeHandler.module.scss";
import QrCode from "./qrCode";

import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { SocketContext } from "../../context/socketContext";
import { useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Button from "../button/button";
import Footer from "../footer/footer";
import Title from "../../components/title/title";
import ClipBlob from "../../components/clipBlob/clipBlob";

export default function Code() {
  const players = useSelector((state) => state.players.players);
  const searchParams = useSearchParams();
  const gameId = searchParams.get("gameId");

  const currentBluffer = useSelector((state) => state.players.currentBluffer);
  const colorStyle =
    currentBluffer && currentBluffer != ""
      ? players[currentBluffer].color
      : "#373FEF";
  console.log(colorStyle);
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
      <div className={styles.shape}>
        <ClipBlob
          numPoints={20}
          color={colorStyle}
          minDuration={3}
          maxDuration={4}
          width={600}
          height={600}
          maxRadius={300}
          minRadius={225}
          seed={10}
        ></ClipBlob>
      </div>
      <section className={styles.content}>
        <Title
          text={""}
          important={`${currentBluffer} `}
          text2={"tu es le\n bluffer "}
        ></Title>
        <p>Scanne le QR code et isole toi...</p>
        <div className={styles.qrCode}>
          <QrCode gameId={gameId} currentBluffer={currentBluffer} />
        </div>
      </section>
      <Footer>
        <div>
          <p style={{ marginBottom: ".25rem" }}>
            <b
              className={styles.currentBluffer}
              style={{ color: colorStyle, textTransform: "capitalize" }}
            >
              {currentBluffer}
            </b>{" "}
            doit s'isoler
          </p>
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
