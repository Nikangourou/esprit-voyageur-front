import styles from "./card.module.scss";
import React, { forwardRef, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const Card = forwardRef(function Card(
  { srcFront, frontChild, stylesCard, backChild },
  ref,
) {
  const tlRef = useRef();
  const [isTurned, setIsTurned] = useState(false);

  function onClickEvt() {
    setIsTurned(!isTurned);
  }

  useEffect(() => {
    tlRef.current?.kill();
    tlRef.current = gsap.timeline().to(`.${styles.card}`, {
      rotateY: isTurned ? 180 : 0,
      duration: 0.15,
      ease: "power2.inOut",
    });
  }, [isTurned]);

  return (
    <div
      className={styles.card}
      ref={ref}
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
