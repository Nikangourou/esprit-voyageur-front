"use client";

import styles from "./page.module.scss";
import AddPlayer from "../../components/joueurs/addPlayer/addPlayer";
import Countdown from "../../components/chrono/countdown";
import { SocketContext } from "../../context/socketContext";
import { setGameId } from "../../store/reducers/playersReducer";
import { useContext, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Button from "../../components/button/button";
import Footer from "../../components/footer/footer";
import Link from "next/link";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function Cartes() {
  const { socket } = useContext(SocketContext);
  const dispatch = useDispatch();
  const players = useSelector((state) => state.players.players);
  const playersInGame = useSelector((state) => state.players.playersInGame);
  const gameId = useSelector((state) => state.players.players);
  const [chronoStart, setChronoStart] = useState(120);



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
          <p>{playersInGame} joueur enregistré</p>
          <div>
            <Link
              className={styles.btn}
              href={`/game/qrcode?gameId=${gameId}`}
              onClick={() => {
                dispatch(setDistanceCircle([0.1, 0.1]));
              }}
            >
              <Button color={"#373FEF"} type="link">
              Continuer
              </Button>
            </Link>
          </div>
        </Footer>
      </div>
    </main>
  );
}
