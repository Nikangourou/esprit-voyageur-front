import styles from "./title.module.scss";
import { useSelector } from "react-redux";

export default function Title({ text, text2, important }) {
  const players = useSelector((state) => state.players.players);
  const currentBluffer = useSelector((state) => state.players.currentBluffer);
  const colorStyle =
    currentBluffer && currentBluffer != ""
      ? players[currentBluffer].color
      : "#373FEF";

  return (
    <h4 className={styles.title}>
      {`${text} `}
      <div className={styles.important}>
        <span>{important}</span>
        <span
          className={styles.outline}
          style={{ filter: `drop-shadow(2px 2px 0px ${colorStyle})` }}
        >
          {important}
        </span>
      </div>
      {text2}
    </h4>
  );
}
