import styles from "./score.module.scss";
import PageContainer from "../pageContainer/pageContainer";
import Countdown from "../chrono/countdown";
import Button from "../button/button";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { useContext } from "react";
import { SocketContext } from "../../context/socketContext";
import { newRound } from "../../store/reducers/playersReducer";

export default function Score({ gameId }) {
  const { socket } = useContext(SocketContext);
  const playersInGame = useSelector((state) => state.players.playersInGame);
  const players = useSelector((state) => state.players.players);
  const dispatch = useDispatch();

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

      <button
        onClick={() => {
          dispatch(newRound());
          socket?.emit("sendActorAction", gameId, "Click End");
        }}
      >
        C'est Finiiii!
      </button>
    </PageContainer>
  );
}
