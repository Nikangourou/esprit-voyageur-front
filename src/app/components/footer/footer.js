"use client";

import { useEffect, useRef } from "react";
import styles from "./footer.module.scss";
import { gsap } from "gsap";

export default function Footer({ children }) {
  const pathRef = useRef(null);

  useEffect(() => {
    gsap.to(pathRef.current, {
      attr: {
        d: "M802 0.5C445.5 0.49818 340 118 4 118V212.928L1370.5 212.927V101.5C1138.5 101.5 994.5 0.500983 802 0.5Z",
      },
      duration: 10,
      ease: "sine.inOut",
      yoyo: true, // Permet de revenir à l'état initial après
      repeat: -1, // Répète l'animation indéfiniment
    });
  }, []);

  return (
    <div className={styles.footer}>
      <div className={styles.content}>{children}</div>
      <div className={styles.bg}>
        <svg
          width="1366"
          height="180"
          viewBox="0 0 1366 180"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            ref={pathRef}
            d="M799 41.5C442.5 41.4982 337 0 1 0V179.928L1367.5 179.927V8C1135.5 8 991.5 41.501 799 41.5Z"
            fill="#E8E3D8"
          />
        </svg>
      </div>
    </div>
  );
}
