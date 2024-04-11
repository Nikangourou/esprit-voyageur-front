import styles from "./joueurs.module.scss";
import PlayersList from "./playersList/playersList";
import { useState } from "react";
import AddPlayer from "./addPlayer/addPlayer";

export default function Joueurs() {
  const [isAddingPlayer, setIsAddingPlayers] = useState(false);

  function innerContent() {
    if (isAddingPlayer) {
      return <AddPlayer></AddPlayer>;
    } else {
      return (
        <PlayersList setIsAddingPlayers={setIsAddingPlayers}></PlayersList>
      );
    }
  }

  return (
    <main className={styles.container}>
      <div className={styles.titleContent}>
        <h1>
          Tableau de bord des <span>joueurs</span>
        </h1>
      </div>
      {innerContent()}
    </main>
  );
}
