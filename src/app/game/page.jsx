'use client';

import styles from "./page.module.scss";
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client"

export default function Intro() {

  const [images, setImages] = useState([]); // Si vous voulez stocker l'image reçue
  const gameId = useRef(null);
  const isReadyRef = useRef(false);
  const socket = useRef(null);


  useEffect(() => {
    if(!isReadyRef.current){
      isReadyRef.current = true;
      const urlParams = new URLSearchParams(window.location.search);
      gameId.current = urlParams.get('gameId');
  
      socket.current = io("localhost:5001")
      socket.current.emit("connexionPrimary", gameId.current);
  
      // Écoute de l'événement 'imageGenerated'
      socket.on("imagesAllGenerated", (receivedImage) => {
        setImages(receivedImage);
        console.log("Images reçues : ", receivedImage);
      });
    }


    return () => {

  }
  }, []);

  return (
    <main className={styles.main}>
      <h1>Game</h1>
      {images.map((image, index) => (
        <img key={index} src={image} alt="image" />
      ))}
    </main>
  );
}
