"use client";

import { useContext, useEffect, useRef, useState } from "react";
import styles from "./menu.module.scss";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import Galerie from "../galerie/galerie";
import { SocketContext } from "../../../context/socketContext";
import { gsap } from "gsap";

export default function Menu({ openMenu, setOpenMenu }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const tlRef = useRef();
  const [showGalerie, setShowGalerie] = useState(false);
  const { setShouldResetGame: setShouldResetGame } = useContext(SocketContext);

  const restartGame = () => {
    setShouldResetGame(true);
  };

  useEffect(() => {
    tlRef.current?.kill();
    tlRef.current = gsap
      .timeline()
      .fromTo(
        `.${styles.menu}`,
        {
          backdropFilter: "blur(0px)",
          backgroundColor: "rgba(239, 235, 226, 0)",
        },
        {
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(239, 235, 226, 0.54)",
          duration: 0.5,
          ease: "power2.out",
        },
      )
      .fromTo(
        `.${styles.card}`,
        { x: "100svw", y: "15svh", rotateZ: 25 },
        {
          x: 0,
          y: 0,
          rotateZ: 0,
          duration: 0.75,
          ease: "power2.out",
          stagger: 0.25,
        },
        "<+.25",
      )
      .fromTo(
        `.${styles.card} + p`,
        { opacity: 0, y: "0.5rem", scale: 0.975 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.75,
          ease: "power4.out",
          delay: 0.5,
          stagger: 0.4,
        },
        "<",
      );
  }, []);

  function animOut(onComplete = null, onStart = null) {
    tlRef.current?.kill();
    tlRef.current = gsap
      .timeline({ onComplete: onComplete, onStart: onStart })
      .to(`.${styles.card} + p`, {
        opacity: 0,
        duration: 0.75,
        ease: "power4.out",
      })
      .to(
        `.${styles.card}`,
        {
          x: "15svw",
          y: "100svh",
          rotateZ: 15,
          duration: 1,
          ease: "power2.out",
          stagger: 0.25,
        },
        "<0.25",
      )
      .to(
        `.${styles.menu}`,
        {
          backdropFilter: "blur(0px)",
          backgroundColor: "rgba(239, 235, 226, 0)",
          duration: 0.5,
          ease: "power2.out",
        },
        "<+.5",
      );
  }

  return (
    <div className={styles.menu}>
      {showGalerie && <Galerie setShowGalerie={setShowGalerie} />}
      <div>
        <div
          onClick={() => {
            animOut(() => {
              setOpenMenu(false);
            });
          }}
          className={`${styles.card} ${styles.continuer}`}
        >
          <div className={styles.containerImg}>
            <img src="/images/resume.svg" alt="logo" />
          </div>
        </div>
        <p>Reprendre</p>
      </div>
      <div>
        <div
          className={`${styles.card} ${styles.recommencer}`}
          onClick={() => {
            animOut(null, restartGame);
          }}
        >
          <div className={styles.containerImg}>
            <img src="/images/quitter.svg" alt="logo" />
          </div>
        </div>
        <p>Quitter</p>
      </div>
      <div>
        <div
          className={`${styles.card} ${styles.galerie}`}
          onClick={() => {
            setShowGalerie(true);
          }}
        >
          <div className={styles.containerImg}>
            <img src="/images/galerie.svg" alt="logo" />
          </div>
        </div>
        <p>Galerie</p>
      </div>
    </div>
  );
}
