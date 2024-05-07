import styles from "./addPlayer.module.scss";
import { useSelector, useDispatch } from "react-redux";
import { addPlayer, setGameId } from "../../../store/reducers/playersReducer";
import { useContext, useEffect, useRef, useState } from "react";
import Button from "../../button/button";
import { gsap } from "gsap";
import Link from "next/link";
import { SocketContext } from "../../../context/socketContext";
import { useRouter } from "next/navigation";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
export default function AddPlayer() {
  const playersInGame = useSelector((state) => state.players.playersInGame);
  const players = useSelector((state) => state.players.players);
  const gameId = useSelector((state) => state.players.players);
  const { socket } = useContext(SocketContext);
  const timerRef = useRef(null);
  const containerRef = useRef(null);
  const dispatch = useDispatch();
  const handleTouchStart = (e) => {
    timerRef.current = setTimeout(() => {
      const colorName = e.target.getAttribute("data-color");
      dispatch(addPlayer({ color: colorName }));
      gsap.to(e.target, {
        backgroundColor: players[colorName].color,
      });
    }, 1000);
  };

  const handleTouchEnd = () => {
    clearTimeout(timerRef.current);
  };

  const eventsFunctions = {
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
    onTouchCancel: handleTouchEnd,
    onMouseDown: handleTouchStart,
    onMouseUp: handleTouchEnd,
    onMouseLeave: handleTouchEnd,
  };

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
            }),
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
    <section className={styles.addingPlayer} ref={containerRef}>
      <div className={styles.playerChoice}>
        {Object.entries(players).map(([colorName, value], id) => {
          return (
            <Button
              key={id}
              type={"player"}
              events={eventsFunctions}
              color={colorName}
              dataColor={colorName}
            ></Button>
          );
        })}
      </div>

      <Button
        type={"link"}
        // disabled={playersInGame.length < 3}
        events={{ onClick: onRedirectEvent }}
      >
        Valider
      </Button>
    </section>
  );
}
