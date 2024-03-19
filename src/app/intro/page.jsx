'use client';

import Image from "next/image";
import styles from "./page.module.scss";
import Tuto1 from "../components/tuto/tuto1";
import QrCode from "../components/qrCode/qrCode";
import Joueurs from "../components/joueurs/joueurs";
import { useState, useEffect,useRef } from "react";
import {io} from "socket.io-client"

export default function Intro() {

  const [currentPart, setCurrentPage] = useState(0);
  const [threadKey, setThreadKey] = useState(null)
  const [gameId, setGameId] = useState()
  const launched = useRef(false)

  useEffect(() => {
    if (!launched.current) {
      launched.current = true

      const socket = io("localhost:5001")
      // setReady(false)
      // fetch('https://espritvoyageur-production.up.railway.app/gamev2/post/create', {
      fetch('http://localhost:5001/gamev2/post/create', {
        method: 'POST',
      })
        .then(response => response.json())
        .then(data => {
          console.log('Create Game');
          console.log(data);
          socket.emit("connexionPrimary", data.thread_id.key)
          setThreadKey(data.thread_id.key)
          setGameId(data._id)
        });
    };

  }, [])

  const nextPage = () => {
    if (currentPart === 2) {
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
      <div className={styles.container}>
        {
          currentPart === 0 && <Tuto1 />
        }
        {
          currentPart === 1 && <Joueurs />
        }
        {
          currentPart === 2 && <QrCode threadKey={threadKey} gameId={gameId} />
        }
        <div className={styles.containerBtn}>
          <p onClick={() => previousPage()}>&lt;=</p>
          <p onClick={() => nextPage()}>=&gt;</p>
        </div>
        {
          currentPart === 2 && <a className={styles.btnPlay} href="/game">Play</a>
        }
      </div>
    </main>
  );
}
