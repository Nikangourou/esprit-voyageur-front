"use client";

import { useEffect, useState } from "react";
import styles from "./menu.module.scss";
import { useRouter } from "next/navigation";
import { newGame } from "../../../store/reducers/playersReducer";
import { useDispatch } from "react-redux";
import Galerie from "../galerie/galerie";

export default function Menu({ openMenu, setOpenMenu }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showGalerie, setShowGalerie] = useState(false);

  const restartGame = () => {
    dispatch(newGame());
    router.push("/");
  };

  return (
    <div className={styles.menu}>
      {showGalerie && <Galerie setShowGalerie={setShowGalerie} />}
      <div>
        <div
          onClick={() => setOpenMenu(false)}
          className={`${styles.card} ${styles.continuer}`}
        >
          <div className={styles.containerImg}>
            <img src="/images/resume.svg" alt="logo" />
          </div>
        </div>
        <p>Reprendre</p>
      </div>
      <div>
        <div
          className={`${styles.card} ${styles.galerie}`}
          onClick={() => setShowGalerie(true)}
        >
          <div className={styles.containerImg}>
            <img src="/images/galerie.svg" alt="logo" />
          </div>
        </div>
        <p>Galerie</p>
      </div>
      <div>
        <div
          className={`${styles.card} ${styles.recommencer}`}
          onClick={restartGame}
        >
          <div className={styles.containerImg}>
            <img src="/images/quitter.svg" alt="logo" />
          </div>
        </div>
        <p>Recommencer</p>
      </div>
    </div>
  );
}
