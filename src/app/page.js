"use client";

import { useEffect, useRef } from "react";
import styles from "./page.module.scss";
import { gsap, Sine } from "gsap";

export default function Home() {

  const buttonRef = useRef(null);
  const svgRef = useRef(null);
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    if (!svgRef.current) return;
    const wibble = svgRef.current.getElementById("wibble");
    if (!wibble) return;

    const pointz = 30; // Number of points
    const width = 100; // Width of the line
    const spacing = width / pointz; // Space between points

    const pointzArray = Array.from({ length: pointz }).map((_, i) => {
      let point = wibble.points.appendItem(svgRef.current.createSVGPoint());
      point.x = i * spacing;
      point.y = 25;
      return point;
    });

    buttonRef.current.addEventListener("mouseenter", () => {
      if (isAnimatingRef.current) {
        return;
      }

      isAnimatingRef.current = true;

      pointzArray.forEach((point, index) => {
        const mapper = gsap.utils.mapRange(0, pointz, 0, 0.4);

        gsap
          .to(point, {
            keyframes: [
              { y: "+=6", ease: Sine.easeInOut },
              { y: "-=12", ease: Sine.easeInOut },
              { y: "+=6", ease: Sine.easeInOut },
            ],
            yoyo: true,
            duration: 0.6,
            onComplete: () => {
              if (index === 0) {
                isAnimatingRef.current = false;
              }
            },
          })
          .progress(mapper(index));
      });
    });
  }, []);

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <img src="/Logo.svg" alt="Logo" />
        <div>
          <button ref={buttonRef} href="/intro">
            <a href="/intro">Jouer</a>
            <svg viewBox="0 0 100 50" preserveAspectRatio="none" ref={svgRef}>
              <polyline
                stroke="#1C1C1E"
                id="wibble"
                fill="none"
                strokeWidth="45"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </main>
  );
}
