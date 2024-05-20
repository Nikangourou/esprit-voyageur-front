"use client";

import { useContext, useEffect, useRef } from "react";
import styles from "./page.module.scss";
import { gsap, Sine } from "gsap";
import Button from "./components/button/button";
import Link from "next/link";
import FullScreen from "./components/fullScreen/fullScreen";
import { useDispatch } from "react-redux";
import {
  setDistanceCircle,
  setShaderPosition,
} from "./store/reducers/gameReducer";
import { SocketContext } from "./context/socketContext";
import { useRouter } from "next/navigation";

export default function Home() {
  const tlRef = useRef();
  const dispatch = useDispatch();
  const buttonRef = useRef();
  const router = useRouter();
  const { soundManager } = useContext(SocketContext);

  useEffect(() => {
    if (!tlRef.current && buttonRef.current) {
      console.log(buttonRef.current);
      tlRef.current = gsap
        .timeline()
        .call(
          () => {
            dispatch(setShaderPosition(1));
          },
          null,
          1.5,
        )
        .to(".pageContainer", {
          opacity: 1,
          duration: 3,
          delay: 0.25,
          ease: "power2.out",
        })
        .fromTo(
          buttonRef.current,
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(2)" },
          ">-2.5",
        )
        .fromTo(
          buttonRef.current.children[0],
          { y: 0 },
          { y: -8, duration: 0.5, ease: "back.out(3)" },
          "<.15",
        );
    }
  }, []);

  const events = {
    onClick: clickEvt,
  };

  function clickEvt(e) {
    router.push("/intro/joueurs");
    soundManager.startXp("global");
    dispatch(setDistanceCircle([0.1, 0.1]));
  }

  return (
    <>
      <FullScreen />
      <main className={styles.main}>
        <div className={styles.container}>
          <img src="/Logo.svg" alt="Logo" />
          <div>
            <Button
              color={"#373FEF"}
              type="link"
              ref={buttonRef}
              events={events}
            >
              Jouer
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
