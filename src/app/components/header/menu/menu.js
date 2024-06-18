"use client";

import { useEffect, useState } from "react";
import styles from "./menu.module.scss";
import { useRouter } from "next/navigation";
import { newGame } from "../../../store/reducers/playersReducer";
import { useDispatch } from "react-redux";

export default function Menu({ openMenu, setOpenMenu }) {
  const router = useRouter();
  const dispatch = useDispatch();

  const restartGame = () => {
    dispatch(newGame());
    router.push("/");
  };

  return (
    <div className={styles.menu}>
      <div
        onClick={() => setOpenMenu(false)}
        className={`${styles.card} ${styles.continuer}`}
      >
        <div className={styles.containerImg}>
          <img src="/images/key.svg" alt="logo" />
        </div>
        <p>Continuer</p>
      </div>
      <div
        className={`${styles.card} ${styles.recommencer}`}
        onClick={restartGame}
      >
        <div className={styles.containerImg}>
          <img src="/images/stair.svg" alt="logo" />
        </div>
        <p>Recommencer</p>
      </div>
    </div>
  );
}
