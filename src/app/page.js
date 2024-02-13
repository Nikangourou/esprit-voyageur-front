import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <h1>Esprit voyageur</h1>
      <a href="/intro">Play</a>
    </main>
  );
}
