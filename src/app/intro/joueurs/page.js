"use client";

import styles from "./page.module.scss";
import AddPlayer from "../../components/joueurs/addPlayer/addPlayer";
import { SocketContext } from "../../context/socketContext";
import { setGameId } from "../../store/reducers/playersReducer";
import { useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import Button from "../../components/button/button";
import Footer from "../../components/footer/footer";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function Joueurs() {
  const { socket } = useContext(SocketContext);
  const dispatch = useDispatch();
  const players = useSelector((state) => state.players.players);
  const playersInGame = useSelector((state) => state.players.playersInGame);

  const playersInGameObj = playersInGame.reduce((acc, color) => {
    acc[color] = players[color];
    return acc;
  }, {});


  const onRedirectEvent = () => {
    if (socket) {
      fetch(`${apiUrl}/game/post/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          v2: true,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Create Game");
          dispatch(
            setGameId({
              gameId: data.game_id,
            })
          );
          localStorage.setItem("gameId", data.game_id);

          socket.emit("connexionPrimary", data.game_id, {
            Players: players,
            PlayersInArray: playersInGame,
          });
        });
    }
  };

  return (
    <main className={styles.main}>
      <AddPlayer></AddPlayer>
      <section className={styles.content}>
        <img src="/images/players.svg" alt="Joueurs" />
        <p>
          Touchez un pion pour vous enregistrer en tant que joueur.
          <br />
          Il faut entre 3 et 7 joueurs par partie.
        </p>
      </section>
      <Footer>
        <div>
          <p> <span className={styles.nbPlayers}>{playersInGame.length}</span> joueur enregistrés</p>
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
