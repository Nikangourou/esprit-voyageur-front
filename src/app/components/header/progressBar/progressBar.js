import React, { useState, useEffect } from "react";
import styles from "./progressBar.module.scss";
import { useSelector } from "react-redux";

const ProgressBar = () => {
  const valueManche = useSelector((state) => state.game.manche);
  const valueAdvancedManche = useSelector((state) => state.game.advancementManche);
  
  const players = useSelector((state) => state.players.players);
  const playersInGame = useSelector((state) => state.players.playersInGame);

  const maxManche = playersInGame.length;
  const maxAdvancedManche = 7
  

  const currentBluffer = useSelector((state) => state.players.currentBluffer);
  const color =
    currentBluffer && currentBluffer != ""
      ? players[currentBluffer].color
      : "#373FEF";

  return (
    <div className={styles.progressBar}>
      <span className={styles.label}>
        Manche <span className={styles.manche}><span style={{color: color}}>{valueManche}</span>/{maxManche}</span> 
      </span>
      <div
        className={styles.progressBarContainer}
        style={{ width: "100%", backgroundColor: "#e0e0de" }}
      >
        <div
          className={styles.progressBarValue}
          style={{
            width: `${(valueAdvancedManche / maxAdvancedManche) * 100}%`,
            backgroundColor: color,
          }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
