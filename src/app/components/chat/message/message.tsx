"use client";

import styles from "./message.module.scss";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import cards from "../messages/cardsRotation.json";

export default function Message({ idx, nbSendMessages, message = null }) {
  const cardRef = useRef();
  const messageRef = useRef();
  const tlRef = useRef(null);

  useEffect(() => {
    if (!tlRef.current && idx == nbSendMessages) {
      console.log(cards, cards[idx]);
      tlRef.current = gsap
        .timeline()
        .fromTo(
          cardRef.current,
          {
            top: "50%",
            rotationZ: cards[idx][0],
          },
          { top: "40%", duration: 1 },
        )
        .to(cardRef.current, {
          top: "30%",
          rotationZ: cards[idx][1],
          duration: 1,
          delay: 0.25,
        })
        .to(cardRef.current, {
          top: "20%",
          rotationZ: cards[idx][2],
          duration: 1,
          delay: 0.5,
        })
        .to(cardRef.current, {
          top: "0%",
          rotationZ: cards[idx][3],
          duration: 0.5,
          delay: 0.5,
        });
    }
  }, [nbSendMessages, idx]);

  useEffect(() => {
    if (message) {
      tlRef.current?.kill();
      tlRef.current = gsap
        .timeline()
        .to(cardRef.current, {
          top: "0%",
          rotationZ: cards[idx][3],
          duration: 1,
          ease: "back.out(1.2)",
        })
        .to(
          messageRef.current,
          { opacity: 1, duration: 1, ease: "power2.out" },
          "<",
        );
    }
  }, [message]);

  return (
    <div className={styles.card} ref={cardRef}>
      <p
        ref={messageRef}
        className={`${styles.message} ${message?.send && styles.send}`}
      >
        {message?.content}
      </p>
    </div>
  );
}
