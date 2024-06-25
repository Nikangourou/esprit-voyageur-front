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
import Card from "../../components/card/card";
import { setAdvancementManche } from "../../store/reducers/gameReducer";
import { gsap } from "gsap";

export default function Code() {
  const players = useSelector((state) => state.players.players);
  const searchParams = useSearchParams();
  const gameId = searchParams.get("gameId");
  const dispatch = useDispatch();
  const cardRef = useRef();

  const currentBluffer = useSelector((state) => state.players.currentBluffer);
  const colorStyle =
    currentBluffer && currentBluffer != ""
      ? players[currentBluffer].color
      : "#373FEF";
  console.log(colorStyle);

  useEffect(() => {
    dispatch(setAdvancementManche(1));
    anim();
  }, []);
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

  function anim() {
    const tl = gsap
      .timeline()
      .fromTo(
        cardRef.current,
        { scale: 1.25, boxShadow: "2px 6px 10px rgba(44,44,44,0.15)" },
        {
          scale:  1,
          duration: 0.5,
          delay: 5,
          boxShadow: "2px 6px 10px rgba(44,44,44,.25)",
          ease: "power2.out",
        }
      )
      .fromTo(
        cardRef.current,
        { top: "170%", left: "70%" },
        {
          top: "85%",
          left: "80%",
          duration: 1.5,
          ease: "power2.out",
        },
        "<"
      )
      .fromTo(
        cardRef.current,
        { rotationZ: 70 },
        {
          rotationZ: 25,
          duration: 0.25,
          ease: "power2.out",
        },
        "<"
      );
  }

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
        <Card
          ref={cardRef}
          stylesCard={{
            position: "absolute",
            zIndex: 1,
          }}
          frontChild={
            <div className={styles.qrCode}>
              <QrCode gameId={gameId} currentBluffer={currentBluffer} />
            </div>
          }
        ></Card>
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
