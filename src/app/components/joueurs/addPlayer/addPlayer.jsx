import styles from "./addPlayer.module.scss";
import { useSelector, useDispatch } from "react-redux";
import { addPlayer } from "../../../store/reducers/playersReducer";
import { useEffect, useRef } from "react";
import Button from "../../button/button";
import { gsap } from "gsap";
import Link from "next/link";

export default function AddPlayer({ gameId }) {
  const playersInGame = useSelector((state) => state.players.playersInGame);
  const players = useSelector((state) => state.players.players);
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
            ></Button>
          );
        })}
      </div>
      <Link
        href={`/game/qrcode?gameId=${gameId}`}
        disabled={playersInGame.length < 3}
      >
        Next Page
      </Link>
    </section>
  );
}
