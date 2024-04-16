"use client";

import styles from "./page.module.scss";
import QrCode from "../../components/qrCode/qrCode";
import PageContainer from "../../components/pageContainer/pageContainer";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

export default function Code() {
  const [gameId, setGameId] = useState();
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setGameId(urlParams.get("gameId"));
  }, []);

  const handleNextPage = () => {
    // Rediriger vers la page suivante avec le gameId en paramètre
    router.push(`/game?gameId=${gameId}`);
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <PageContainer pageCategory={"bluffer"}>
          <QrCode gameId={gameId} />
          <button onClick={handleNextPage}>Next Page</button>
        </PageContainer>
      </div>
    </main>
  );
}
