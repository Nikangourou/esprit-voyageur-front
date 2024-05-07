"use client";

import { useEffect, useState, useRef, useContext } from "react";
import styles from "./getImg.module.scss";
import { SocketContext } from "../../context/socketContext";
import { useDispatch, useSelector } from "react-redux";
import {
  setFalseImageId,
  setTrueImageId,
} from "../../store/reducers/playersReducer";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function GetImg({ prompt, gameId, type }) {
  const { socket } = useContext(SocketContext);
  const [base64, setBase64] = useState(null);
  const isLaunched = useRef(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (gameId && !isLaunched.current && socket) {
      isLaunched.current = true;
      fetch(`${apiUrl}/image/post/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt,
          game_id: gameId,
          isTrue: type === "simple",
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setBase64(`${apiUrl}${data.url}`);
          socket.emit("imagesAllGenerated", gameId, data._id);
          if (data.isTrue) {
            dispatch(setTrueImageId({ id: data._id }));
          } else {
            dispatch(setFalseImageId({ id: data._id }));
          }
        });
    }
  }, [prompt, socket]);

  return <img className={styles.img} src={base64} alt="Generated image" />;
}
