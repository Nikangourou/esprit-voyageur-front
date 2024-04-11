import styles from "./addPlayer.module.scss";
import { useSelector, useDispatch } from "react-redux";
import { setPlayers, setColor } from "../../../store/reducers/playersReducer";
import { useState } from "react";
export default function AddPlayer() {
  const colors = useSelector((state) => state.players.colors);
  const [playerName, setPlayerName] = useState("");
  const [colorSelected, setColorSelected] = useState();

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
            <div key={id}>
              <input
                type={"radio"}
                value={colorName}
                id={colorName}
                style={{ display: "none" }}
                name={"color"}
                onChange={(e) => {
                  setColorSelected(e.target.value);
                }}
              ></input>
              <label
                htmlFor={colorName}
                className={`${styles.colorChoose} ${
                  isUsed ? styles.isUsed : ""
                }`}
                style={{ backgroundColor: colorName }}
              >
                {colorName}
              </label>
            </div>
          );
        })}
      </div>
      <button>Submit</button>
    </section>
  );
}
