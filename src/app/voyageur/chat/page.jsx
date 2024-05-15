"use client";

import { useContext, useEffect, useRef, useState } from "react";
import styles from "./page.module.scss";
import Chat from "../../components/chat/chat";
import { div } from "three/nodes";
import Countdown from "../../components/chrono/countdown";
import { SocketContext } from "../../context/socketContext";

export default function Voyageur() {
  const { socket } = useContext(SocketContext);
  const [currentPhase, setCurrentPhase] = useState("Conversation");
  const [chronoStart, setChronoStart] = useState(120);
  const [disconnect, setDisconnect] = useState(false);
  const gameId = useRef(null);

  function phaseManagement(state, gameId) {
    console.log(state);
    switch (state) {
      case "Conversation":
        setChronoStart(120);
        setCurrentPhase("Conversation");
        break;
      case "RevealImage":
        setChronoStart(20);
        setCurrentPhase("RevealImage");
        break;
    }
  }

  useEffect(() => {
    if (!gameId.current) {
      const urlParams = new URLSearchParams(window.location.search);
      gameId.current = urlParams.get("gameId");
    }

    socket.on("stateChanged", phaseManagement);
    return () => {
      socket.off("stateChanged", phaseManagement);
    };
  }, []);

  const onEndCountdown = () => {
    if (currentPhase == "RevealImage" && !disconnect) {
      console.log("End countdown", currentPhase);
      setDisconnect(true);
      socket?.emit("sendActorAction", gameId.current, "EndChrono", {});
    }
  };

  return (
    <main>
      <div className={styles.containerCountdown}>
        <Countdown start={chronoStart} onEnd={onEndCountdown} />
      </div>
      <Chat />
    </main>
  );
}
