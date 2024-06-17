"use client";

import { useContext, useEffect, useRef, useState } from "react";
import styles from "./page.module.scss";
import Chat from "../../components/chat/chat";
import { div } from "three/nodes";
import Countdown from "../../components/chrono/countdown";
import { SocketContext } from "../../context/socketContext";
import Footer from "../../components/footer/footer";
import Title from "../../components/title/title";

export default function Voyageur() {
  const { socket } = useContext(SocketContext);
  const [disconnect, setDisconnect] = useState(false);
  const gameId = useRef(null);

  useEffect(() => {
    if (!gameId.current) {
      const urlParams = new URLSearchParams(window.location.search);
      gameId.current = urlParams.get("gameId");
    }
    //
    // socket.on("stateChanged", phaseManagement);
    // return () => {
    //   socket.off("stateChanged", phaseManagement);
    // };
  }, []);

  const onEndCountdown = () => {};

  return (
    <main className={styles.container}>
      <div className={styles.containerCountdown}>
        <Countdown start={120} onEnd={onEndCountdown} />
        <div className={styles.title}>
          <Title text={"Raconte ton"} important={"souvenir"}></Title>
        </div>
      </div>
      <Chat />
      <Footer></Footer>
    </main>
  );
}
