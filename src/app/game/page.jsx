"use client";

import styles from "./page.module.scss";
import { useEffect, useState, useRef, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import GameFlow from "../components/gameFlow/gameFlow";
import { useDispatch } from "react-redux";
import { SocketContext } from "../context/socketContext";
import Score from "../components/score/score";
import {
  setTrueImageId,
} from "../store/reducers/playersReducer";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function Intro() {
  const { socket } = useContext(SocketContext);
  const [images, setImages] = useState([]);
  const [gameId, setGameId] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleImagesAllGenerated = (trueImageId, falseImageId) => {
      const arrayTmp = [trueImageId, falseImageId];
      console.log("page.js" + trueImageId);
      dispatch(setTrueImageId({id:trueImageId}));
      arrayTmp.forEach((imageId) => {
        fetch(`${apiUrl}/image/get/${imageId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            setImages((currentImages) => [
              ...currentImages,
              {
                id: uuidv4(),
                url: `${apiUrl}${data.url}`,
                isTrue: data.isTrue,
              },
            ]);
          });
      });
    };

    // Initialiser la connexion une seule fois
    if (socket) {
      const urlParams = new URLSearchParams(window.location.search);
      setGameId(urlParams.get("gameId"));

      // Séparer écoute d'événement de l'initialisation de la connexion
      socket.on("imagesGenerated", handleImagesAllGenerated);
    }

    // Nettoyage : Désinscrire et fermer la connexion lors du démontage du composant
    return () => {
      socket?.off("imagesGenerated", handleImagesAllGenerated);
    };

    // Aucune dépendance donnée à useEffect, donc il agit comme componentDidMount
  }, [socket]);

  return (
    <main className={styles.main}>
      <GameFlow images={images} gameId={gameId}></GameFlow>
    </main>
  );
}
