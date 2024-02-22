import styles from "./joueurs.module.scss";


export default function Joueurs() {
  return (
    <main>
      <h1>Joueur</h1>
      <div className={styles.container}>
        <input type="text" placeholder="Nom" />
        <input type="text" placeholder="Nom" />
        <input type="text" placeholder="Nom" />
        <input type="text" placeholder="Nom" />
      </div>
    </main>
  );
}
