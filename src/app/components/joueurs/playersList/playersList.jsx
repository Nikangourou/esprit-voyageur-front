import styles from "./playersList.scss";
import { useSelector, useDispatch } from 'react-redux';

export default function PlayersList() {
    const players =  useSelector(state => state.players.players)



  return (
    <main>
      <h1>Liste des joueurs</h1>
      <div className={styles.container}>
          {players.map(player => (<h1>player.name</h1>))}
          {players.length < 7 && <button>Ajout joueurs</button>}
      </div>
    </main>
  );
}
