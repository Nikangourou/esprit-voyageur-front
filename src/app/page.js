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

export default function Home() {
  const tlRef = useRef();
  const dispatch = useDispatch();
  const { soundManager } = useContext(SocketContext);

  useEffect(() => {
    if (!tlRef.current) {
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
        });
      // .fromTo(
      //   `.${styles.buttonBis}`,
      //   { scale: 0.8, opacity: 0 },
      //   { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(2)" },
      //   ">-2.25",
      // )
      // .to(
      //   `.${styles.principal}`,
      //   { y: -8, duration: 0.75, ease: "back.out(3)" },
      //   "<.15",
      // );
    }
  }, []);

  return (
    <>
      <FullScreen />
      <main className={styles.main}>
        <div className={styles.container}>
          <img src="/Logo.svg" alt="Logo" />
          <div>
            {/*<div className={styles.buttonBis}>*/}
            {/*  <div className={styles.principal}>*/}
            {/*    <p>Jouer</p>*/}
            {/*  </div>*/}
            {/*  <div className={styles.sub}></div>*/}
            {/*</div>*/}
            <Link
              className={styles.btn}
              href="/intro"
              onClick={() => {
                soundManager.startXp("global");
                dispatch(setDistanceCircle([0.1, 0.1]));
              }}
            >
              <Button color={"#373FEF"} type="link">
                Jouer
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
