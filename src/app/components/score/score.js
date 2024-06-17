import styles from "./score.module.scss";
import Countdown from "../chrono/countdown";
import Button from "../button/button";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { useContext, useMemo, useRef, useState, useEffect } from "react";
import { SocketContext } from "../../context/socketContext";
import { newRound } from "../../store/reducers/playersReducer";
import Footer from "../footer/footer";
import { gsap } from "gsap";
import ScoreBoard from "./scoreBoard/scoreBoard";
import ImageShader from "../imageShader/ImageShader";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function Score({ gameId }) {
  const final = false; // for dev
  const { socket } = useContext(SocketContext);
  const [trueImageUrl, setTrueImageUrl] = useState();
  const [isBlurry, setIsBlurry] = useState(true);
  const trueImageId = useSelector((state) => state.players.trueImageId);
  const playersInGame = useSelector((state) => state.players.playersInGame);
  const players = useSelector((state) => state.players.players);
  const dispatch = useDispatch();

  if (typeof window === "undefined") {
    return <div></div>;
  }
  const width = window.innerWidth * 0.3;

  useEffect(() => {
    if (trueImageId != null && trueImageId != "") {
        fetch(`${apiUrl}/image/get/${trueImageId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            setTrueImageUrl(`${apiUrl}${data.url}`);

            const timer = setTimeout(() => {
              setIsBlurry(false);
            }, 1000);

          });
    }
  }, [trueImageId]);

 
  const currentBluffer = useSelector((state) => state.players.currentBluffer);
  const colorStyle =
    currentBluffer && currentBluffer != ""
      ? players[currentBluffer].color
      : "#373FEF";

  const sortedPlayersInGame = useMemo(() => {
    return [...playersInGame].sort(
      (a, b) => players[b].score - players[a].score
    );
  }, [playersInGame, players]);

  const winner = sortedPlayersInGame[0];

  function clickEvt(e) {
    dispatch(newRound());
    socket?.emit("sendActorAction", gameId, "Click End");
  }

  return (
    <div className={styles.main}>
      <div className={styles.content}>
        <div>
          {final ? (
            <h1>
              {" "}
              <span className={styles.reverse}>Fin</span> de la partie
            </h1>
          ) : (
            <h1>
              <span className={styles.reverse}>Fin</span> de la manche
            </h1>
          )}
        </div>
        <div className={styles.scoreBoardContainer}>
          {!final && (
            <ImageShader
              url={trueImageUrl}
              isBlurry={isBlurry}
              width={width}
              height={width}
            ></ImageShader>
          )}

          <ScoreBoard />
        </div>
      </div>
      {/* <div className={styles.footer}>
        <Footer>
          <div className={styles.footerContent}>
            <p>
              {final ? "Félicitaion " : "Le Bluffer était "}
              <span
                className={styles.currentBluffer}
                style={{ color: colorStyle }}
              >
                {final ? winner : currentBluffer}
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
      </div> */}
    </div>
  );
}
