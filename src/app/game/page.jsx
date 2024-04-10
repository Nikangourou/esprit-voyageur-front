"use client";

import styles from "./page.module.scss";
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

export default function Intro() {
  const [images, setImages] = useState([]);
  const gameId = useRef(null);
  const isReadyRef = useRef(false);
  const socket = useRef(null);

  useEffect(() => {
    // Initialiser la connexion une seule fois
    if (!socket.current) {
      const urlParams = new URLSearchParams(window.location.search);
      gameId.current = urlParams.get("gameId");

      socket.current = io("localhost:5001");
      socket.current.emit("connexionPrimary", gameId.current);
    }

    // Séparer écoute d'événement de l'initialisation de la connexion
    const handleImagesAllGenerated = (receivedImage) => {
      setImages((currentImages) => [
        ...currentImages,
        {
          id: uuidv4(),
          url: receivedImage,
        },
      ]);
    };

    socket.current.on("imageGenerated", handleImagesAllGenerated);

    // Nettoyage : Désinscrire et fermer la connexion lors du démontage du composant
    return () => {
      if (socket.current) {
        socket.current.off("imageGenerated", handleImagesAllGenerated);
        socket.current.close();
        socket.current = null;
      }
    };

    // Aucune dépendance donnée à useEffect, donc il agit comme componentDidMount
  }, []);

  return (
    <main className={styles.main}>
      <h1>Game</h1>
      {images.map((image) => (
        <img width={400} key={image.id} src={image.url} alt="image" />
      ))}
    </main>
  );
}
