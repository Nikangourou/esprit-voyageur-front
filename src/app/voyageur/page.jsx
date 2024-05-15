"use client";

import { useContext, useEffect, useRef, useState } from "react";
import styles from "./page.module.scss";
import Chat from "../components/chat/chat";
import { SocketContext } from "../context/socketContext";
import { useDispatch } from "react-redux";
import { setGameId } from "../store/reducers/playersReducer";
import { setDistanceCircle } from "../store/reducers/gameReducer";

export default function Voyageur() {
  const { socket } = useContext(SocketContext);
  const dispatch = useDispatch();
  const gameIdRef = useRef();

  useEffect(() => {
    dispatch(setDistanceCircle([0.4, 0.8]));
    const urlParams = new URLSearchParams(window.location.search);
    dispatch(setGameId(urlParams.get("gameId")));
    gameIdRef.current = urlParams.get("gameId");
    socket?.emit("connexionPhone", urlParams.get("gameId"));
  }, []);

  return (
    <main>
      <h1>Introduction PHONE</h1>
      <button
        onClick={() => {
          socket?.emit("sendActorAction", gameIdRef.current, "Launch");
        }}
      >
        C'est partiiii!
      </button>
    </main>
  );
}
