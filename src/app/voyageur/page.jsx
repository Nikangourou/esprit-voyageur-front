"use client";

import { useContext, useEffect, useRef, useState } from "react";
import styles from "./page.module.scss";
import Chat from "../components/chat/chat";
import { SocketContext } from "../context/socketContext";
import { useDispatch } from "react-redux";
import { setGameId, setCurrentBluffer } from "../store/reducers/playersReducer";
import Button from "../components/button/button";
import { useSelector } from "react-redux";
import {
  setDistanceCircle,
  setShaderPosition,
} from "../store/reducers/gameReducer";
import { gsap } from "gsap";
import FullScreen from "../components/header/fullScreen/fullScreen";

export default function Voyageur() {
  const { socket } = useContext(SocketContext);
  const dispatch = useDispatch();
  const gameIdRef = useRef();
  const currentBlufferRef = useRef();
  const tlRef = useRef();
  const buttonRef = useRef();

  const players = useSelector((state) => state.players.players);
  const [colorStyle, setColorStyle] = useState("#373FEF");

  if (typeof window === "undefined") {
    return <div></div>;
  }

  useEffect(() => {
    tlRef.current = gsap
      .timeline()
      .call(
        () => {
          dispatch(setShaderPosition(1));
        },
        null,
        1.5
      )
      .to(".pageContainer", {
        opacity: 1,
        duration: 3,
        delay: 2,
        ease: "power2.out",
      })
      .fromTo(
        buttonRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.75, ease: "back.out(2)" },
        ">-2.5"
      )
      .fromTo(
        buttonRef.current.children[0],
        { y: 0 },
        { y: -8, duration: 0.5, ease: "back.out(3)" },
        "<.15"
      );
    dispatch(setDistanceCircle([0.4, 0.7]));
    const urlParams = new URLSearchParams(window.location.search);
    gameIdRef.current = urlParams.get("gameId");
    dispatch(setGameId(urlParams.get("gameId")));
    currentBlufferRef.current = urlParams.get("bluffer");
    let color =
      currentBlufferRef.current != ""
        ? players[currentBlufferRef.current]?.color
        : "#373FEF";

    setColorStyle(color);
    dispatch(setCurrentBluffer({ CurrentBluffer: currentBlufferRef.current }));
    socket?.emit("connexionPhone", urlParams.get("gameId"));
  }, []);

  function clickEvt(e) {
    socket?.emit("sendActorAction", gameIdRef.current, "Launch");
  }

  return (
    <>
      {/* <FullScreen /> */}
      <main className={styles.main}>
        <div className={styles.container}>
          <img src="/images/logo.gif" alt="Logo" />
          <div className={styles.buttonContainer}>
            <Button
              type="link"
              color={colorStyle}
              ref={buttonRef}
              events={{ onClick: clickEvt }}
            >
              Jouer
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
