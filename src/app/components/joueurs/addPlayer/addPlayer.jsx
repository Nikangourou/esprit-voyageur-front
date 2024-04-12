import styles from "./addPlayer.module.scss";
import { useSelector, useDispatch } from "react-redux";
import { addPlayer, setColor } from "../../../store/reducers/playersReducer";
import { useRef, useState } from "react";
import Button from "../../button/button";
import { gsap } from "gsap";
export default function AddPlayer() {
  const colors = useSelector((state) => state.players.colors);
  const [playerName, setPlayerName] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const timerRef = useRef(null);
  const dispatch = useDispatch();
  const handleMouseDown = (e) => {
    timerRef.current = setTimeout(() => {
      setIsConfirming(true);
      dispatch(addPlayer({ color: e.target.getAttribute("data-color") }));
      gsap.to(e.target.style, {
        background: "#32CD84",
      });
    }, 1000); // Temps en millisecondes (3 secondes)
  };

  const handleMouseUp = () => {
    clearTimeout(timerRef.current);
  };

  const eventsFunctions = {
    onMouseDown: handleMouseDown,
    onMouseUp: handleMouseUp,
    onMouseLeave: handleMouseUp,
  };

  return (
    <section className={styles.addingPlayer}>
      <input
        type="text"
        className={styles.playerName}
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
      />
      <div className={styles.playerChoice}>
        {Object.entries(colors).map(([colorName, value], id) => {
          const isUsed = value.used;
          return (
            <Button
              key={id}
              type={"player"}
              events={eventsFunctions}
              color={colorName}
              isUsed={value.used}
            ></Button>
          );
        })}
      </div>
      <button>Submit</button>
    </section>
  );
}
