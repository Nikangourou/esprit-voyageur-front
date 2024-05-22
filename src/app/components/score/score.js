import styles from "./score.module.scss";
import Countdown from "../chrono/countdown";
import Button from "../button/button";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { useContext, useMemo, useRef, useLayoutEffect } from "react";
import { SocketContext } from "../../context/socketContext";
import { newRound } from "../../store/reducers/playersReducer";
import Footer from "../footer/footer";
import { gsap } from "gsap";
import ScoreBoard from "./scoreBoard";
import ProgressBar from "./progressBar/progressBar";

export default function Score({ gameId }) {
  const { socket } = useContext(SocketContext);
  const playersInGame = useSelector((state) => state.players.playersInGame);
  const players = useSelector((state) => state.players.players);
  const dispatch = useDispatch();

  const currentBluffer = useSelector((state) => state.players.currentBluffer);
  const colorStyle =
    currentBluffer && currentBluffer != ""
      ? players[currentBluffer].color
      : "#373FEF";

  function clickEvt(e) {
    dispatch(newRound());
    socket?.emit("sendActorAction", gameId, "Click End");
  }

  return (
    <div className={styles.main}>
      <ProgressBar value={6} max={7} />
      <ScoreBoard />
      <Footer>
        <div className={styles.footerContent}>
          <p>
            Le Bluffer était{" "}
            <span
              className={styles.currentBluffer}
              style={{ color: colorStyle }}
            >
              {currentBluffer}
            </span>
          </p>
          <div className={styles.playerColors}>
            <div
              key={currentBluffer}
              style={{ backgroundColor: colorStyle }}
              className={styles.playerColor}
            />
          </div>
        </div>
        <Button color={"#373FEF"} type="link" events={{ onClick: clickEvt }}>
          Terminer
        </Button>
      </Footer>
    </div>
  );
}
