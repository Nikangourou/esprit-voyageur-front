"use client";

import styles from "./page.module.scss";
import Countdown from "../../components/chrono/countdown";
import { useState, useRef, useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import Button from "../../components/button/button";
import Footer from "../../components/footer/footer";
import Title from "../../components/title/title";
import { setGameId } from "../../store/reducers/playersReducer";
import { SocketContext } from "../../context/socketContext";
import {
  setDistanceCircle,
  setShaderPosition,
} from "../../store/reducers/gameReducer";
import Card from "../../components/card/card";
import { gsap } from "gsap";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function Cartes() {
  const players = useSelector((state) => state.players.players);
  const playersInGame = useSelector((state) => state.players.playersInGame);
  const gameIdRef = useRef();
  const card1Ref = useRef();
  const card2Ref = useRef();
  const card3Ref = useRef();
  const { socket } = useContext(SocketContext);
  const dispatch = useDispatch();

  if (typeof window === "undefined") {
    return <div></div>;
  }
  
  const [isMobile, setIsMobile] = useState(window.innerHeight <= 768);

  const cards = [
    "/images/card_1.svg",
    "/images/card_2.svg",
    "/images/card_3.svg",
  ];

  const playersInGameObj = playersInGame.reduce((acc, color) => {
    acc[color] = players[color];
    return acc;
  }, {});

  const [chronoStart, setChronoStart] = useState(120);

  function clickEvt(e, tl) {
    if (socket) {
      dispatch(setDistanceCircle([0.65, 0.65]));
      tl.call(
        () => {
          dispatch(setShaderPosition(0));
        },
        null,
        ">1",
      )
        .to(".footerBg", { opacity: 0, duration: 1, ease: "power2.out" }, "<")
        .call(
          () => {
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
                dispatch(
                  setGameId({
                    gameId: data.game_id,
                  }),
                );
                gameIdRef.current = data.game_id;
                localStorage.setItem("gameId", data.game_id);

                socket.emit("connexionPrimary", data.game_id, {
                  Players: players,
                  PlayersInArray: playersInGame,
                });
              });
          },
          null,
          ">2",
        )
        .call(
          () => {
            dispatch(setShaderPosition(1));
            dispatch(setDistanceCircle([0.1, 0.1]));
          },
          null,
          ">3",
        )
        .to(".footerBg", { opacity: 1, duration: 1, ease: "power2.out" }, "<");
    }
  }

  useEffect(() => {
    anim1();
    anim2();
    anim3();
  }, []);

  function anim1() {
    const tl = gsap
      .timeline()
      .fromTo(
        card1Ref.current,
        { scale: 1.25, boxShadow: "2px 6px 10px rgba(44,44,44,0.15)" },
        {
          scale: isMobile ? 0.85 : 1,
          duration: 0.5,
          delay: 1.5,
          boxShadow: "2px 6px 10px rgba(44,44,44,.25)",
          ease: "power2.out",
        },
      )
      .fromTo(
        card1Ref.current,
        { top: "170%", left: "50%" },
        {
          top: "10%",
          left: "15%",
          duration: 1.5,
          ease: "power2.out",
        },
        "<",
      )
      .fromTo(
        card1Ref.current,
        { rotationZ: -20 },
        {
          rotationZ: 70,
          duration: 0.25,
          ease: "power2.out",
        },
        "<",
      );
  }

  function anim2() {
    const tl = gsap
      .timeline()
      .fromTo(
        card2Ref.current,
        { scale: 1.25, boxShadow: "2px 6px 10px rgba(44,44,44,0.15)" },
        {
          scale: isMobile ? 0.85 : 1,
          duration: 0.5,
          delay: 1,
          boxShadow: "2px 6px 10px rgba(44,44,44,.25)",
          ease: "power2.out",
        },
      )
      .fromTo(
        card2Ref.current,
        { top: "170%", left: "70%" },
        {
          top: "40%",
          left: isMobile ? "95%" : "90%",
          duration: 1.5,
          ease: "power2.out",
        },
        "<",
      )
      .fromTo(
        card2Ref.current,
        { rotationZ: 70 },
        {
          rotationZ: -15,
          duration: 0.25,
          ease: "power2.out",
        },
        "<",
      );
  }

  function anim3() {
    const tl = gsap
      .timeline()
      .fromTo(
        card3Ref.current,
        { scale: 1.25, boxShadow: "2px 6px 10px rgba(44,44,44,0.15)" },
        {
          scale: isMobile ? 0.85 : 1,
          duration: 0.5,
          delay: 2,
          boxShadow: "2px 6px 10px rgba(44,44,44,.25)",
          ease: "power2.out",
        },
      )
      .fromTo(
        card3Ref.current,
        { top: "170%", left: "50%" },
        {
          top: "55%",
          left: isMobile ? "0%" : "5%",
          duration: 1.5,
          ease: "power2.out",
        },
        "<",
      )
      .fromTo(
        card3Ref.current,
        { rotationZ: 40 },
        {
          rotationZ: -15,
          duration: 0.25,
          ease: "power2.out",
        },
        "<",
      );
  }

  return (
    <main className={styles.main}>
      {/* <AddPlayer></AddPlayer> */}
      <section className={styles.content}>
        <div className={styles.cardAnim}>
          <Card ref={card1Ref} srcFront={"/images/card_1.svg"}></Card>
          <Card ref={card2Ref} srcFront={"/images/card_2.svg"}></Card>
          <Card ref={card3Ref} srcFront={"/images/card_3.svg"}></Card>
        </div>
        <div className={styles.countdown}>
          <Countdown
            start={chronoStart}
            onEnd={() => {
              const tl = gsap.timeline();
              clickEvt(null, tl);
            }}
          ></Countdown>
        </div>
        <div className={styles.text}>
          <Title
            text={"Chacun pioche \n"}
            important={"3 "}
            text2={"cartes "}
          ></Title>
          <p>Aidez-vous de celles-ci pour vous remémorer un souvenir...</p>
        </div>
      </section>

      <Footer>
        <div>
          <p>
            <b>Tous</b> les joueurs doivent piocher
          </p>
          <div className={styles.playerColors}>
            {Object.keys(playersInGameObj).map((player) => (
              <div
                key={player}
                style={{ backgroundColor: players[player].color }}
                className={styles.playerColor}
              />
            ))}
          </div>
        </div>
        <div>
          <Button color={"#373FEF"} type="link" events={{ onClick: clickEvt }}>
            Continuer
          </Button>
        </div>
      </Footer>
    </main>
  );
}
