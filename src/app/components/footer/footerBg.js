"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./footer.module.scss";
import { gsap } from "gsap";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";

export default function FooterSvg() {
  const pathRef = useRef(null);
  const showFooter = useSelector((state) => state.footer.showFooter);
  const pathname = usePathname();
  const [path, setPath] = useState();

  useEffect(() => {
    gsap
      .timeline({
        yoyo: true, // Permet de revenir à l'état initial après
        repeat: -1, // Répète l'animation indéfiniment
      })
      .fromTo(
        pathRef.current,
        {
          attr: {
            d: "M798 41.5C441.5 41.4982 336 0 0 0V179.928L1366.5 179.927V8C1134.5 8 990.5 41.501 798 41.5Z",
          },
        },
        {
          attr: {
            d: "M558.5 0C202 0.00207045 336 40.5 0 40.5V171.931L1366.5 171.931V40.5C1134.5 40.5 777.5 -0.00127182 558.5 0Z",
          },
          duration: 3,
          ease: "sine.inOut",
        },
      )
      .to(pathRef.current, {
        attr: {
          d: "M1104 0C735.5 20.5 499 77 0 39.5V170.931L1366.5 170.931V39.5C1147.5 33 1230 3.07118e-08 1104 0Z",
        },
        duration: 3,
        ease: "sine.inOut",
      });
  }, [showFooter]);

  useEffect(() => {
    setPath(pathname);
  }, [pathname]);

  return (
    <div
      className={`${styles.bg} ${!showFooter ? styles.hidden : ""} ${
        path == "/voyageur/chat" ? styles.voyageur : ""
      } footerBg`}
    >
      <svg
        width={"100%"}
        height={200}
        viewBox="0 0 1366 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio={"none"}
      >
        <path
          ref={pathRef}
          d="M558.5 0C202 0.00207045 336 40.5 0 40.5V171.931L1366.5 171.931V40.5C1134.5 40.5 777.5 -0.00127182 558.5 0Z"
          fill="#E8E3D8"
        />
      </svg>
    </div>
  );
}
