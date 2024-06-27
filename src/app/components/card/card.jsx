import styles from "./card.module.scss";
import React, { forwardRef, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const Card = forwardRef(function Card(
  { srcFront, frontChild, stylesCard, backChild, blockRotation = false },
  ref
) {
  const tlRef = useRef();
  const cardRef = useRef();
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
  }, [isTurned]);

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
      </div>
      <div className={styles.cardBack}>{backChild}</div>
    </div>
  );
});

export default Card;
