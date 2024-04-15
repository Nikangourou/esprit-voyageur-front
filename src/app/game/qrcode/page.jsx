"use client";

import styles from "./page.module.scss";
import QrCode from "../../components/qrCode/qrCode";
import PageContainer from "../../components/pageContainer/pageContainer";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Code() {
  const [gameId, setGameId] = useState();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setGameId(urlParams.get("gameId"));
  }, []);

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <PageContainer pageCategory={"bluffer"}>
          <QrCode gameId={gameId} />
          <Link href={`/game?gameId=${gameId}`}>Next Page</Link>
        </PageContainer>
      </div>
    </main>
  );
}
