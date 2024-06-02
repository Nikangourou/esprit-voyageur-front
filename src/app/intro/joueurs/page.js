"use client";

import styles from "./page.module.scss";
import AddPlayer from "../../components/joueurs/addPlayer/addPlayer";
import { SocketContext } from "../../context/socketContext";
import { setGameId } from "../../store/reducers/playersReducer";
import { useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import Button from "../../components/button/button";
import Footer from "../../components/footer/footer";
import Title from "../../components/title/title";
import { useRouter } from "next/navigation";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function Joueurs() {
  const { socket } = useContext(SocketContext);
  const players = useSelector((state) => state.players.players);
  const playersInGame = useSelector((state) => state.players.playersInGame);
  const router = useRouter();

  const playersInGameObj = playersInGame.reduce((acc, color) => {
    acc[color] = players[color];
    return acc;
  }, {});

  const onRedirectEvent = () => {
    router.push(`/intro/cartes`);
  };

  return (
    <main className={styles.main}>
      <AddPlayer></AddPlayer>
      <section className={styles.content}>
        <Title text={"sélection \ndes"} important={"joueurs "}></Title>
        <p>
          Touchez un pion pour vous enregistrer en tant que joueur.
          <br />
          Il faut entre 3 et 7 joueurs par partie.
        </p>
      </section>
      <Footer>
        <div>
          <p>
            {" "}
            <span className={styles.nbPlayers}>
              {playersInGame.length}
            </span>{" "}
            joueur enregistrés
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
            type={"link"}
            color={"#373FEF"}
            // disabled={playersInGame.length < 3}
            events={{ onClick: onRedirectEvent }}
          >
            Continuer
          </Button>
        </div>
      </Footer>
    </main>
  );
}
