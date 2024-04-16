"use client";

import styles from "./page.module.scss";
import QrCode from "../../components/qrCode/qrCode";
import PageContainer from "../../components/pageContainer/pageContainer";

import { useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SocketContext } from "../../context/socketContext";

export default function Code() {
  const [gameId, setGameId] = useState(null);
  const router = useRouter();
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    if (!gameId && socket) {
      const urlParams = new URLSearchParams(window.location.search);
      setGameId(urlParams.get("gameId"));
      socket.emit("connexionPrimary", gameId);
      socket.on("startChrono", handleNextPage);
    }
  }, [socket]);

  const handleNextPage = () => {
    // Rediriger vers la page suivante avec le gameId en paramètre
    router.push(`/game?gameId=${gameId}`);
  };

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
