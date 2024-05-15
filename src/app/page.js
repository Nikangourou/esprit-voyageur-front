"use client";

import { useEffect, useRef } from "react";
import styles from "./page.module.scss";
import { gsap, Sine } from "gsap";
import Button from "./components/button/button";
import Link from "next/link";
import FullScreen from "./components/fullScreen/fullScreen";

export default function Home() {
  const tlRef = useRef();
  const hoverItemRef = useRef();
  const blobPathRef = useRef();

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

    // Add event listeners
    // const hoverElem = hoverItemRef.current;
    // hoverElem.addEventListener("mouseenter", enterAnimation);
    // hoverElem.addEventListener("mouseleave", leaveAnimation);

    // // Cleanup the event listeners on component unmount
    // return () => {
    //   hoverElem.removeEventListener("mouseenter", enterAnimation);
    //   hoverElem.removeEventListener("mouseleave", leaveAnimation);
    // };
  }, []);

  return (
    <>
      <FullScreen />
      <main className={styles.main}>
        <div className={styles.container}>
          <img src="/Logo.svg" alt="Logo" />
          <div>
            <Link className={styles.btn} href="/intro">
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
