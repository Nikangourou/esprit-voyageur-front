"use client";

import Image from "next/image";
import styles from "./page.module.scss";
import Tuto1 from "../components/tuto/tuto1";
import Joueurs from "../components/joueurs/joueurs";
import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import Remember from "../components/remember/remember";
import PageContainer from "../components/pageContainer/pageContainer";
import { useDispatch } from "react-redux";
import { selectBlufferPlayer } from "../store/reducers/playersReducer";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function Intro() {
  const [currentPart, setCurrentPage] = useState(0);
  const [gameId, setGameId] = useState();
  const launched = useRef(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!launched.current) {
      launched.current = true;

      const socket = io("localhost:5001");
      fetch(`${apiUrl}/game/post/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          v2: true,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Create Game");
          console.log(data);
          setGameId(data.game_id);
        });
    }
  }, []);

  const nextPage = () => {
    if (currentPart === 3) {
      return;
    }
    setCurrentPage(currentPart + 1);
  };

  const previousPage = () => {
    if (currentPart === 0) {
      return;
    }
    setCurrentPage(currentPart - 1);
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {currentPart === 0 && <Tuto1 />}
        {currentPart === 1 && <Joueurs nextPage={nextPage} />}
        {currentPart === 2 && (
          <Remember
            event={() => {
              dispatch(selectBlufferPlayer());
              nextPage();
            }}
          />
        )}
        <div className={styles.containerBtn}>
          <p onClick={() => previousPage()}>&lt;=</p>
          <p onClick={() => nextPage()}>=&gt;</p>
        </div>

        {currentPart === 3 && (
          <PageContainer pageCategory={"bluffer"}>
            <QrCode gameId={gameId} />
            <a className={styles.btnPlay} href={`/game?gameId=${gameId}`}>
              {" "}
              Play
            </a>
          </PageContainer>
        )}
      </div>
    </main>
  );
}
