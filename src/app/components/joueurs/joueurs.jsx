import styles from "./joueurs.module.scss";
import PlayersList from "./playersList/playersList";
import { useState } from "react";
import AddPlayer from "./addPlayer/addPlayer";

export default function Joueurs({ nextPage }) {
  return (
    <main className={styles.container}>
      <div className={styles.titleContent}>
        <h1>
          Tableau de bord des <span>joueurs</span>
        </h1>
      </div>
      <AddPlayer nextPage={nextPage}></AddPlayer>
    </main>
  );
}
