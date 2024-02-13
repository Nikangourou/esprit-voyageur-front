'use client';

import Image from "next/image";
import styles from "./page.module.scss";
import Tuto1 from "../components/tuto/tuto1";
import Tuto2 from "../components/tuto/tuto2";
import Joueurs from "../components/joueurs/joueurs";
import Voyageur from "../components/voyageur/voyageur";
import { useState } from "react";

export default function Intro() {

  const [currentPart, setCurrentPage] = useState(0);

  const nextPage = () => {
    if (currentPart === 3) {
      return;
    }
    setCurrentPage(currentPart + 1);
  }

  const previousPage = () => {
    if (currentPart === 0) {
      return;
    }
    setCurrentPage(currentPart - 1);
  }

  

  return (
    <main className={styles.main}>
      <p onClick={() => nextPage()}>next</p>
      <p onClick={() => previousPage()}>previous</p>
      {
        currentPart === 0 && <Tuto1 />
      }
      {
        currentPart === 1 && <Joueurs />
      }
      {
        currentPart === 2 && <Voyageur />
      }
      {
        currentPart === 3 && <Tuto2 />
      }
    </main>
  );
}
