"use client";

import styles from "./page.module.scss";
import Joueurs from "../components/joueurs/joueurs";

export default function Intro() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <Joueurs />
      </div>
    </main>
  );
}
