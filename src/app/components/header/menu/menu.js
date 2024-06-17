"use client";

import { useEffect, useState } from "react";
import styles from "./menu.module.scss";


export default function Menu({ openMenu, setOpenMenu }) {

 

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
      <div className={`${styles.card} ${styles.recommencer}`}>
        <div className={styles.containerImg}>
          <img src="/images/stair.svg" alt="logo" />
        </div>
        <p>Recommencer</p>
      </div>
    </div>
  );
}
