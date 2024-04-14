"use client";

import { useEffect, useRef } from "react";
import styles from "./page.module.scss";
import { gsap, Sine } from "gsap";
import Blob from "./components/blob/blob"; 

export default function Home() {
  const blobRef = useRef();
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
    const hoverElem = hoverItemRef.current;
    hoverElem.addEventListener("mouseenter", enterAnimation);
    hoverElem.addEventListener("mouseleave", leaveAnimation);

    // Cleanup the event listeners on component unmount
    return () => {
      hoverElem.removeEventListener("mouseenter", enterAnimation);
      hoverElem.removeEventListener("mouseleave", leaveAnimation);
    };
  }, []);

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <img src="/Logo.svg" alt="Logo" />
        <div className={styles.btn}>
          <svg ref={blobRef} id="svg" viewBox="0 0 1000 1000">
            <Blob
              numPoints={8}
              centerX={500}
              centerY={500}
              minRadius={400}
              maxRadius={425}
              minDuration={1}
              maxDuration={2}
            />
          </svg>
          <p ref={hoverItemRef}>Jouer</p>
        </div>
      </div>
    </main>
  );
}
