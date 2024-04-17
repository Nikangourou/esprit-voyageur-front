import styles from "./score.module.scss";
import PageContainer from "../pageContainer/pageContainer";
import Countdown from "../chrono/countdown";
import Button from "../button/button";
import { useSelector } from "react-redux";
import Link from "next/link";

export default function Score({ gameId }) {
  const playersInGame = useSelector((state) => state.players.playersInGame);
  const players = useSelector((state) => state.players.players);
  return (
    <PageContainer pageCategory={"score"}>
      <div className={styles.scoreList}>
        {playersInGame.map((color, i) => {
          return (
            <div className="scoreRow">
              <Button
                key={i + color}
                type={"player"}
                color={players[color].color}
                colorActive={true}
              ></Button>
              <p>: {players[color].score}</p>
            </div>
          );
        })}
      </div>

      <Link href={`/game/qrcode?gameId=${gameId}`}>
        <Button type={"link"}>Valider</Button>
      </Link>
    </PageContainer>
  );
}
