"use client";

import styles from "./page.module.scss";
import Countdown from "../../components/chrono/countdown";
import { useState, useRef, useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import Button from "../../components/button/button";
import Footer from "../../components/footer/footer";
import { useRouter } from "next/navigation";
import Title from "../../components/title/title";
import { setGameId } from "../../store/reducers/playersReducer";
import { SocketContext } from "../../context/socketContext";
import {
  setDistanceCircle,
  setShaderPosition,
} from "../../store/reducers/gameReducer";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function Cartes() {
  const players = useSelector((state) => state.players.players);
  const playersInGame = useSelector((state) => state.players.playersInGame);
  const gameIdRef = useRef();
  const { socket } = useContext(SocketContext);
  const dispatch = useDispatch();

  const playersInGameObj = playersInGame.reduce((acc, color) => {
    acc[color] = players[color];
    return acc;
  }, {});

  const [chronoStart, setChronoStart] = useState(120);

  function clickEvt(e, tl) {
    if (socket) {
      dispatch(setDistanceCircle([0.65, 0.65]));
      tl.call(
        () => {
          dispatch(setShaderPosition(0));
        },
        null,
        ">1",
      )
        .call(
          () => {
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
                  }),
                );
                gameIdRef.current = data.game_id;
                localStorage.setItem("gameId", data.game_id);

                socket.emit("connexionPrimary", data.game_id, {
                  Players: players,
                  PlayersInArray: playersInGame,
                });
              });
          },
          null,
          ">1",
        )
        .call(
          () => {
            dispatch(setShaderPosition(1));
            dispatch(setDistanceCircle([0.1, 0.1]));
          },
          null,
          ">3",
        );
    }
  }

  return (
    <main className={styles.main}>
      {/* <AddPlayer></AddPlayer> */}
      <section className={styles.content}>
        <Countdown start={chronoStart}></Countdown>
        <div className={styles.text}>
          <Title
            text={"Chacun pioche \n"}
            important={"3 "}
            text2={"cartes "}
          ></Title>
          <p>Aidez-vous de celles-ci pour vous remémorer un souvenir...</p>
        </div>
      </section>
      {/*<div className={styles.cardAnim}>*/}
      {/*  <div className={styles.cards}>*/}
      {/*    <img src="/images/card.svg"></img>*/}
      {/*    <img src="/images/card.svg"></img>*/}
      {/*    <img src="/images/card.svg"></img>*/}
      {/*  </div>*/}
      {/*  <img src="/images/hand.svg" className={styles.hand}></img>*/}
      {/*</div>*/}
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
          <Button color={"#373FEF"} type="link" events={{ onClick: clickEvt }}>
            Continuer
          </Button>
        </div>
      </Footer>
    </main>
  );
}
