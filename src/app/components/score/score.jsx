import styles from "./score.module.scss";
import Countdown from "../chrono/countdown";
import Button from "../button/button";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { useContext, useMemo } from "react";
import { SocketContext } from "../../context/socketContext";
import { newRound } from "../../store/reducers/playersReducer";
import Footer from "../footer/footer";

export default function Score({ gameId }) {
  const { socket } = useContext(SocketContext);
  const playersInGame = useSelector((state) => state.players.playersInGame);
  const players = useSelector((state) => state.players.players);
  const dispatch = useDispatch();

  const sortedPlayersInGame = useMemo(() => {
    return [...playersInGame].sort(
      (a, b) => players[b].score - players[a].score
    );
  }, [playersInGame, players]);

  function clickEvt(e) {
    dispatch(newRound());
    socket?.emit("sendActorAction", gameId, "Click End");
  }

  return (
    <div className={styles.main}>
      <div className={styles.content}>
        <div className={styles.scoreList}>
          {/* Podium for top 3 players */}
          <div className={styles.podium}>
            {sortedPlayersInGame.slice(0, 3).map((playerId, i) => {
              const player = players[playerId];
              return (
                <div
                  className={`${styles.rank} ${styles[`rank${i + 1}`]}`}
                  key={playerId}
                >
                  <Button
                    type="player"
                    color={player.color}
                    colorActive={true}
                  />
                  <p>: {player.score}</p>
                </div>
              );
            })}
          </div>

          {/* Display the rest of the players */}
          {sortedPlayersInGame.slice(3).map((playerId, i) => {
            const player = players[playerId];
            return (
              <div className={styles.row} key={playerId}>
                <Button type="player" color={player.color} colorActive={true} />
                <p>: {player.score}</p>
              </div>
            );
          })}
        </div>
      </div>

      <Footer>
        <p>Félicitations Bleu !</p>
        <Button color={"#373FEF"} type="link" events={{ onClick: clickEvt }}>
          Terminer
        </Button>
      </Footer>
    </div>
  );
}
