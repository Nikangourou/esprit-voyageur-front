import styles from "./card.module.scss";
export default function Card() {
  return (
    <div className={styles.card}>
      <div
        className={styles.cardFront}
        style={{ backgroundImage: 'url("/images/card_1.svg")' }}
      ></div>
      <div
        className={styles.cardBack}
        style={{ backgroundImage: 'url("/images/card_back.svg")' }}
      ></div>
    </div>
  );
}
