"use client";

import styles from "./page.module.scss";
import Countdown from "../../components/chrono/countdown";
import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Button from "../../components/button/button";
import Footer from "../../components/footer/footer";
import { useRouter } from "next/navigation";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function Cartes() {
  const players = useSelector((state) => state.players.players);
  const playersInGame = useSelector((state) => state.players.playersInGame);
  const gameIdRef = useRef();
  const router = useRouter();

  const playersInGameObj = playersInGame.reduce((acc, color) => {
    acc[color] = players[color];
    return acc;
  }, {});

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    gameIdRef.current = urlParams.get("gameId");
  }, []);

  const [chronoStart, setChronoStart] = useState(120);

  function clickEvt(e) {
    router.push(`/game/qrcode?gameId=${localStorage.getItem("gameId")}`);
  }

  return (
    <main className={styles.main}>
      {/* <AddPlayer></AddPlayer> */}
      <section className={styles.content}>
        <Countdown start={chronoStart}></Countdown>
        <img src="/images/cartes-title.svg" alt="Joueurs" />
        <p>Aidez-vous de celles-ci pour vous remémorer un souvenir...</p>
        <img src="/images/cartes.svg"></img>
      </section>
      <div className={styles.footer}>
        <Footer>
          <div>
            <p>
              <b>Tous</b> les joueurs doivent piocher
            </p>
            <div className={styles.playerColors}>
              {Object.keys(playersInGameObj).map((player) => (
                <div
                  key={player}
                  style={{ backgroundColor: players[player].color }}
                  className={styles.playerColor}
                />
              ))}
            </div>
          </div>
          <div>
            <Button
              color={"#373FEF"}
              type="link"
              events={{ onClick: clickEvt }}
            >
              Continuer
            </Button>
          </div>
        </Footer>
      </div>
    </main>
  );
}
