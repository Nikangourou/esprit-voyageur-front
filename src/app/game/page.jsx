"use client";

import styles from "./page.module.scss";
import { useEffect, useState, useRef, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import Countdown from "../components/chrono/countdown";
import GameFlow from "../components/gameFlow/gameFlow";
import { useDispatch } from "react-redux";
import { SocketContext } from "../context/socketContext";
import Score from "../components/score/score";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function Intro() {
  const { socket } = useContext(SocketContext);
  const [currentPart, setCurrentPage] = useState(0);
  const [images, setImages] = useState([]);
  const gameId = useRef(null);
  const dispatch = useDispatch();

  const nextPage = () => {
    if (currentPart === 3) {
      return;
    }
    setCurrentPage(currentPart + 1);
  };

  useEffect(() => {
    const handleImagesAllGenerated = (_id) => {
      fetch(`${apiUrl}/image/get/${_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setCurrentPage(1);
          setImages((currentImages) => [
            ...currentImages,
            {
              id: uuidv4(),
              url: `${apiUrl}${data.url}`,
              isTrue: data.isTrue,
            },
          ]);
        });
    };

    // Initialiser la connexion une seule fois
    if (socket) {
      const urlParams = new URLSearchParams(window.location.search);
      gameId.current = urlParams.get("gameId");

      // Séparer écoute d'événement de l'initialisation de la connexion
      socket.on("imageGenerated", handleImagesAllGenerated);
    }

    // Nettoyage : Désinscrire et fermer la connexion lors du démontage du composant
    return () => {
      socket?.off("imageGenerated", handleImagesAllGenerated);
    };

    // Aucune dépendance donnée à useEffect, donc il agit comme componentDidMount
  }, [socket]);

  return (
    <main className={styles.main}>
      {currentPart == 0 && (
        <div className={styles.container}>
          <Countdown start={120} onEnd={nextPage} />
        </div>
      )}
      {currentPart == 1 && (
        <GameFlow images={images} nextPage={nextPage}></GameFlow>
      )}
      {currentPart == 2 && <Score gameId={gameId}></Score>}
    </main>
  );
}
