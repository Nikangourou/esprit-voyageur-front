import styles from "./addPlayer.module.scss";
import { useSelector, useDispatch } from "react-redux";
import { setPlayers, setColor } from "../../../store/reducers/playersReducer";
import { useRef, useState } from "react";
import Button from "../../button/button";
export default function AddPlayer() {
  const colors = useSelector((state) => state.players.colors);
  const [playerName, setPlayerName] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const timerRef = useRef(null);
  const handleMouseDown = () => {
    timerRef.current = setTimeout(() => {
      setIsConfirming(true);
      handleConfirm();
    }, 1000); // Temps en millisecondes (3 secondes)
  };

  const handleMouseUp = () => {
    clearTimeout(timerRef.current);
    setIsConfirming(false);
  };

  const handleConfirm = () => {
    // Logique à exécuter lorsque l'utilisateur a confirmé en maintenant le bouton enfoncé
    console.log("Événement confirmé !");
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
