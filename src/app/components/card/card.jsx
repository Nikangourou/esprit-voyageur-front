import styles from "./card.module.scss";
import React, { forwardRef, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const Card = forwardRef(function Card(
  {
    srcFront,
    frontChild,
    stylesCard,
    backChild,
    blockRotation = false,
    showInfo = false,
  },
  ref
) {
  const tlRef = useRef();
  const cardRef = useRef();
  const infoFrontRef = useRef();
  const infoBackRef = useRef();
  const [isTurned, setIsTurned] = useState(false);

  function onClickEvt() {
    if (blockRotation) return;
    setIsTurned(!isTurned);
  }

  useEffect(() => {
    if (cardRef.current) {
      tlRef.current?.kill();
      tlRef.current = gsap.timeline().to(cardRef.current, {
        rotateY: isTurned ? 180 : 0,
        duration: 0.15,
        ease: "power2.inOut",
      });
    }

    if (infoBackRef.current && infoFrontRef.current) {
      if (isTurned) {
        if (showInfo) {
          gsap.to(infoBackRef.current, {
            opacity: 1,
            duration: 0.5,
            delay: 0.5,
          });
          gsap.to(infoFrontRef.current, { opacity: 0, duration: 0.5 });
        } else {
          gsap.to(infoBackRef.current, { opacity: 0, duration: 0.5 });
          gsap.to(infoFrontRef.current, { opacity: 0, duration: 0.5 });
        }
      } else {
        if (showInfo) {
          gsap.to(infoFrontRef.current, {
            opacity: 1,
            duration: 0.5,
            delay: 0.5,
          });
          gsap.to(infoBackRef.current, { opacity: 0, duration: 0.5 });
        } else {
          gsap.to(infoFrontRef.current, { opacity: 0, duration: 0.5 });
          gsap.to(infoBackRef.current, { opacity: 0, duration: 0.5 });
        }
      }
    }
  }, [isTurned, showInfo]);

  return (
    <div
      className={styles.card}
      ref={(element) => {
        cardRef.current = element;
        if (ref) {
          if (typeof ref === "function") {
            ref(element);
          } else {
            ref.current = element;
          }
        }
      }}
      style={stylesCard}
      onClick={onClickEvt}
    >
      <div
        className={styles.cardFront}
        style={{ backgroundImage: srcFront ? `url("${srcFront}")` : "" }}
      >
        {frontChild}
        {showInfo && (
          <p ref={infoFrontRef} className={styles.info}>
            Vérité
          </p>
        )}
      </div>
      <div className={styles.cardBack}>
        {backChild}
        {showInfo && (
          <p ref={infoBackRef} className={`${styles.info} ${styles.infoBack}`}>
            Mensonge
          </p>
        )}
      </div>
    </div>
  );
});

export default Card;
