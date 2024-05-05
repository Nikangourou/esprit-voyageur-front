"use client";

import styles from "./qrCodeHandler.module.scss";
import QrCode from "./qrCode";
import PageContainer from "../pageContainer/pageContainer";

import { useContext, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { SocketContext } from "../../context/socketContext";
import { useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";

export default function Code() {
  const router = useRouter();
  const isReady = useRef(false);
  const searchParams = useSearchParams();
  const gameId = searchParams.get("gameId");
  const dispatch = useDispatch();

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
      <div className={styles.container}>
        <PageContainer pageCategory={"bluffer"}>
          <QrCode gameId={gameId} />
        </PageContainer>
      </div>
    </main>
  );
}
