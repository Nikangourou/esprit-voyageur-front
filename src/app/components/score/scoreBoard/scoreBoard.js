import styles from "./scoreBoard.module.scss";
import Countdown from "../../chrono/countdown";
import Button from "../../button/button";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { useContext, useMemo, useRef, useLayoutEffect } from "react";
import { SocketContext } from "../../../context/socketContext";
import { newRound } from "../../../store/reducers/playersReducer";
import Footer from "../../footer/footer";
import { gsap } from "gsap";

export default function ScoreBoard({ gameId }) {
  const { socket } = useContext(SocketContext);
  const playersInGame = useSelector((state) => state.players.playersInGame);
  const players = useSelector((state) => state.players.players);
  const dispatch = useDispatch();
  const column2Ref = useRef();
  const column1Ref = useRef();
  const column3Ref = useRef();
  const tlRef = useRef();

  useLayoutEffect(() => {
    if (
      !tlRef.current &&
      column1Ref.current &&
      column2Ref.current &&
      column3Ref.current
    ) {
      tlRef.current = gsap
        .timeline()
        .fromTo(
          column3Ref.current,
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(2)" }
        )
        .fromTo(
          column3Ref.current.children[0],
          { y: 0 },
          { y: -8, duration: 0.5, ease: "back.out(3)" },
          "+=0"
        )
        .fromTo(
          column2Ref.current,
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(2)" },
          "+=0.5"
        )
        .fromTo(
          column2Ref.current.children[0],
          { y: 0 },
          { y: -8, duration: 0.5, ease: "back.out(3)" },
          "+=0"
        )
        .fromTo(
          column1Ref.current,
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(2)" },
          "+=0.5"
        )
        .fromTo(
          column1Ref.current.children[0],
          { y: 0 },
          { y: -8, duration: 0.5, ease: "back.out(3)" },
          "+=0"
        );
    }
  }, []);

  const sortedPlayersInGame = useMemo(() => {
    return [...playersInGame].sort(
      (a, b) => players[b].score - players[a].score
    );
  }, [playersInGame, players]);

  const player1 = sortedPlayersInGame[0];
  const player2 = sortedPlayersInGame[1];
  const player3 = sortedPlayersInGame[2];

  return (
      <div className={styles.contentBoard}>
        <div className={styles.scoreList}>
          {/* Podium for top 3 players */}
          <div className={styles.podium}>
            <div
              ref={column2Ref}
              className={`${styles.column} ${styles.column2}`}
            >
              <div className={styles.columnMain}>
                <div>
                  <p
                    className={styles.rank}
                    style={{
                      filter: ` drop-shadow(1px 1px 0px ${players[player2].color})`,
                    }}
                  >
                    2
                  </p>
                  <p
                    className={styles.name}
                    style={{ color: players[player2].color }}
                  >
                    {player2}
                  </p>
                </div>
                <p className={styles.score}>{players[player2].score} <span className={styles.pts}>pts</span></p>
              </div>
              <div className={styles.sub}></div>
            </div>
            <div
              ref={column1Ref}
              className={`${styles.column} ${styles.column1}`}
            >
              <div className={styles.columnMain}>
                <div>
                  <p
                    className={styles.rank}
                    style={{
                      filter: ` drop-shadow(2px 2px 0px ${players[player1].color})`,
                    }}
                  >
                    1
                  </p>
                  <p
                    className={styles.name}
                    style={{ color: players[player1].color }}
                  >
                    {player1}
                  </p>
                </div>
                <p className={styles.score}>{players[player1].score} <span className={styles.pts}>pts</span></p>
              </div>
              <div className={styles.sub}></div>
            </div>
            <div
              ref={column3Ref}
              className={`${styles.column} ${styles.column3}`}
            >
              <div className={styles.columnMain}>
                <div>
                  <p
                    className={styles.rank}
                    style={{
                      filter: ` drop-shadow(2px 2px 0px ${players[player3].color})`,
                    }}
                  >
                    3
                  </p>
                  <p
                    className={styles.name}
                    style={{ color: players[player3].color }}
                  >
                    {player3}
                  </p>
                </div>
                <p className={styles.score}>{players[player3].score} <span className={styles.pts}>pts</span></p>
              </div>
              <div className={styles.sub}></div>
            </div>
          </div>

          {/* Display the rest of the players */}
          {sortedPlayersInGame.slice(3).map((playerId, i) => {
            const player = players[playerId];
            return (
              <div className={styles.row} key={playerId}>
                <div className={styles.flex}>
                  <p
                    className={styles.rank}
                    style={{
                      filter: ` drop-shadow(2px 2px 0px ${player.color})`,
                    }}
                  >
                    {i + 4}
                  </p>
                  <p className={styles.name} style={{ color: player.color }}>
                    {playerId}
                  </p>
                </div>
                <p className={styles.score}>{player.score} <span className={styles.pts}>pts</span> </p>
              </div>
            );
          })}
        </div>
      </div>
  );
}
