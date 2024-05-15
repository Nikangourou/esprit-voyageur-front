"use client";

import { useEffect, useRef } from "react";
import styles from "./page.module.scss";
import { gsap, Sine } from "gsap";
import Button from "./components/button/button";
import Link from "next/link";
import FullScreen from "./components/fullScreen/fullScreen";
import { useDispatch } from "react-redux";
import { setDistanceCircle } from "./store/reducers/gameReducer";

export default function Home() {
  const tlRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    // Function to handle mouse enter
    const enterAnimation = () => {
      gsap.to(tlRef.current, {
        duration: 2,
        timeScale: 1,
        onStart: () => tlRef.current.play(),
      });
    };

    // Function to handle mouse leave
    const leaveAnimation = () => {
      gsap.to(tlRef.current, {
        duration: 2,
        timeScale: 0,
        onComplete: () => tlRef.current.pause(),
      });
    };
  }, []);

  return (
    <>
      <FullScreen />

    <main className={styles.main}>
      <div className={styles.container}>
        <img src="/Logo.svg" alt="Logo" />
        <div>
          <Link
            className={styles.btn}
            href="/intro"
            onClick={() => {
              dispatch(setDistanceCircle([0.1, 0.1]));
            }}
          >
            <Button type="link"> Jouer </Button>
          </Link>
        </div>
        </div>
      </main>
    </>
  );
}
