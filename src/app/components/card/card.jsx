import styles from "./card.module.scss";
import React, { forwardRef } from "react";

const Card = forwardRef(function Card(
  { srcFront, frontChild, backChild },
  ref,
) {
  return (
    <div className={styles.card} ref={ref}>
      <div
        className={styles.cardFront}
        style={{ backgroundImage: srcFront ? `url("${srcFront}")` : "" }}
      >
        {frontChild}
      </div>
      <div
        className={styles.cardBack}
        style={{ backgroundImage: 'url("/images/card_back.svg")' }}
      >
        {backChild}
      </div>
    </div>
  );
});

export default Card;
