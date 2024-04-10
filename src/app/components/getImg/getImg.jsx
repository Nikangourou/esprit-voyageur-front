"use client";

import { useEffect, useState,useRef } from "react";
import styles from "./getImg.module.scss";
import { io } from "socket.io-client";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function GetImg({ prompt, gameId }) {
  const [url, setUrl] = useState(null);
  const isLaunched = useRef(false);

  useEffect(() => {
      if (gameId && !isLaunched.current) {
          isLaunched.current = true;
          fetch(`${apiUrl}/image/post/create`, {
              method: "POST",
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  prompt: prompt,
                  game_id: gameId
              })
          })
              .then(response => response.json())
              .then(data => {
                  setUrl(data.url);
                  const socket = io("localhost:5001")
                  console.log("Image created : ", data.url);
                  socket.emit("imagesAllGenerated", gameId, data.url);
              });
      }
  }, [prompt])

  return <img className={styles.img} src={url} alt="image" />;
}
