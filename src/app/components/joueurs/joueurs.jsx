import styles from "./joueurs.module.scss";
import PlayersList from "./playersList/playersList";

export default function Joueurs() {
  return (
    <main>
      <h1>Joueur</h1>
      <div className={styles.container}>
<PlayersList></PlayersList>

      </div>
    </main>
  );
}
