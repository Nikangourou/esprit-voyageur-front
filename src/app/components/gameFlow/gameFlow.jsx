import styles from "./gameFlow.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState, useContext } from "react";
import ImageShader from "../imageShader/ImageShader";
import Countdown from "../chrono/countdown";
import { SocketContext } from "../../context/socketContext";
import Score from "../score/score";
import DraggablePawns from "../draggablePawns/draggablePawns";

export default function GameFlow({ images, gameId }) {
  const { socket } = useContext(SocketContext);
  const [currentPhase, setCurrentPhase] = useState(null);
  const [contentSentence, setContentSentence] = useState();
  const [chronoStart, setChronoStart] = useState(20);
  const [colorListTrue, setColorListTrue] = useState([]);
  const [isBlurry, setIsBlurry] = useState(true);
  const containerRef = useRef();
  const imageRef1 = useRef();
  const imageRef2 = useRef();

  const players = useSelector((state) => state.players.players);
  const currentBluffer = useSelector((state) => state.players.currentBluffer);

  const colorStyle = currentBluffer != "" ? players[currentBluffer].color : "";

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const stateParams = urlParams.get("state");
    if (stateParams) {
      phaseManagement(stateParams, gameId);
    }
    socket.on("stateChanged", phaseManagement);
  }, []);

  function phaseManagement(state, gameId) {
    switch (state) {
      case "Conversation":
        setCurrentPhase("Conversation");
        break;
      case "RevealImage":
        setCurrentPhase("RevealImage");
        break;
      case "QuestionPhase":
        setCurrentPhase("QuestionPhase");
        setIsBlurry(false);
        setChronoStart(20);
        setContentSentence(
          <p>
            Attention !<br />
            <i>Ne vous laissez pas berner...</i>
          </p>,
        );
        break;
      case "VotePhase":
        setCurrentPhase("VotePhase");
        setChronoStart(20);
        setContentSentence(
          <p>
            Vite, c’est l’heure de voter !<br />
            <i>Déplace ton pion Joueur sur le véritable souvenir.</i>
          </p>,
        );
        break;
      case "RevealPhase":
        setCurrentPhase("RevealPhase");
        setContentSentence(
          <p>
            Le véritable souvenir se dévoile !<br />
            <i>Conteur, raconte ton souvenir...</i>
          </p>,
        );
        break;
      case "ScorePhase":
        setCurrentPhase("ScorePhase");
        setContentSentence(<p>Voici un récapitulatif des scores</p>);
        break;
    }
  }

  function renderContent() {
    switch (currentPhase) {
      case "Conversation":
        return <h1>La conversation est en cours</h1>;
        break;
      case "RevealPhase":
      case "QuestionPhase":
      case "VotePhase":
      case "RevealPhase":
        return (
          <>
            <div className={styles.containerChrono}>
              {(currentPhase == "QuestionPhase" ||
                currentPhase == "VotePhase") && (
                <Countdown
                  start={chronoStart}
                  onEnd={eventEndClock}
                ></Countdown>
              )}
            </div>
            <div className={styles.imgShaders}>
              {images.length > 0 &&
                images.map((image, i) => (
                  <ImageShader
                    key={image.id}
                    url={image.url}
                    ref={i == 0 ? imageRef1 : imageRef2}
                    isBlurry={isBlurry}
                  ></ImageShader>
                ))}
            </div>
            <div className={styles.contentSentence}>
              {contentSentence ? (
                contentSentence
              ) : (
                <p>
                  Nous avons dérobé les souvenirs de{" "}
                  <b style={{ color: colorStyle, textTransform: "capitalize" }}>
                    {currentBluffer}
                  </b>
                  mais ils sont encore flous...
                  <br /> <i>Chut, n’allez pas lui répéter !</i>
                </p>
              )}
            </div>
            {currentPhase == "VotePhase" && <DraggablePawns></DraggablePawns>}
          </>
        );
        break;
      case "ScorePhase":
        return <Score></Score>;
        break;
    }
  }

  function eventEndClock() {
    socket?.emit(
      "sendActorAction",
      gameId,
      "EndPhase",
      currentPhase == "VotePhase" ? { ImageTrueVotes: colorListTrue } : {},
    );
  }

  function clickNextPhase() {
    socket?.emit(
      "sendActorAction",
      gameId,
      "EndPhase",
      currentPhase == "VotePhase" ? { ImageTrueVotes: colorListTrue } : {},
    );
  }

  return (
    <section className={styles.containerGame} ref={containerRef}>
      <button onClick={clickNextPhase}>NextPhase</button>
      {renderContent()}
    </section>
  );
}
