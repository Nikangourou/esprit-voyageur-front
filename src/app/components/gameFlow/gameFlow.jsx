import styles from "./gameFlow.module.scss";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useRef, useState, useContext } from "react";
import ImageShader from "../imageShader/ImageShader";
import Countdown from "../chrono/countdown";
import { SocketContext } from "../../context/socketContext";
import Score from "../score/score";
import DraggablePawns from "../draggablePawns/draggablePawns";
import Footer from "../footer/footer";
import Button from "../button/button";
import {
  setAdvancementManche,
  setDistanceCircle,
  setShaderPosition,
} from "../../store/reducers/gameReducer";
import { setShowFooter } from "../../store/reducers/footerReducer";
import { gsap } from "gsap";
import { current } from "@reduxjs/toolkit";
import Blob from "../blob/blob";

export default function GameFlow({ images, gameId }) {
  const { socket } = useContext(SocketContext);
  const [currentPhase, setCurrentPhase] = useState("Conversation");
  const [contentSentence, setContentSentence] = useState();
  const [chronoStart, setChronoStart] = useState(120);
  const [colorListTrue, setColorListTrue] = useState([]);
  const [colorListFalse, setColorListFalse] = useState([]);
  const [isBlurry, setIsBlurry] = useState(true);
  const [render, setRender] = useState(null);
  const containerRef = useRef();
  const imageRef1 = useRef();
  const imageRef2 = useRef();
  const dispatch = useDispatch();

  if (typeof window === "undefined") {
    return <div></div>;
  }
  const width = window.innerWidth * 0.4;
  const blobParams = {
    width: 50,
    height: 50,
    numPoints: 12,
    minRadius: 10,
    maxRadius: 15,
    minDuration: 1,
    maxDuration: 2,
  };

  const players = useSelector((state) => state.players.players);
  const currentBluffer = useSelector((state) => state.players.currentBluffer);
  const playersInGame = useSelector((state) => state.players.playersInGame);

  console.log(currentBluffer);

  const colorStyle =
    currentBluffer && currentBluffer != "" ? players[currentBluffer].color : "";

  console.log(colorStyle);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const stateParams = urlParams.get("state");
    socket.on("stateChanged", phaseManagement);
    if (stateParams) {
      phaseManagement(stateParams, gameId);
    }
    return () => {
      socket.off("stateChanged", phaseManagement);
    };
  }, []);

  useEffect(() => {
    setRender(renderContent());
  }, [currentPhase]);

  useEffect(() => {
    console.log(colorListTrue);
  }, [colorListTrue]);

  function phaseManagement(state, gameId) {
    console.log(state);
    switch (state) {
      case "Conversation":
        dispatch(setShowFooter(false));
        dispatch(setAdvancementManche(2));
        setChronoStart(120);
        setCurrentPhase("Conversation");
        break;
      case "RevealImage":
        dispatch(setShowFooter(true));
        dispatch(setDistanceCircle([0.1, 0.1]));
        dispatch(setAdvancementManche(3));
        dispatch(setShaderPosition(1));
        gsap
          .timeline()
          .to(".pageContainer", {
            opacity: 0,
            duration: 1.5,
            ease: "power2.out",
          })
          .to(
            ".header",
            {
              opacity: 0,
              duration: 1.5,
              ease: "power2.out",
              onComplete: () => {
                setCurrentPhase("RevealImage");
                setChronoStart(118.5);
              },
            },
            "<",
          )
          .to(".pageContainer", {
            opacity: 1,
            duration: 1.5,
            ease: "power2.out",
          })
          .to(".footerBg", {
            opacity: 1,
            duration: 1.5,
            ease: "power2.out",
          })
          .to(".header", {
            opacity: 1,
            pointerEvents: "auto",
            duration: 1.5,
            ease: "power2.out",
          });

        break;
      case "QuestionsPhase":
        setCurrentPhase("QuestionsPhase");
        dispatch(setAdvancementManche(4));
        setIsBlurry(false);
        setChronoStart(300);
        setContentSentence(
          <p>
            Attention !<br />
            <i>Ne vous laissez pas berner...</i>
          </p>,
        );
        break;
      case "VotePhase":
        setCurrentPhase("VotePhase");
        dispatch(setAdvancementManche(5));
        setChronoStart(120);
        setContentSentence(
          <p>
            Vite, c’est l’heure de voter !<br />
            <i>Déplace ton pion Joueur sur le véritable souvenir.</i>
          </p>,
        );
        break;
      case "ScorePhase":
        dispatch(setAdvancementManche(6));
        gsap
          .timeline()
          .to(".pageContainer", {
            opacity: 0,
            duration: 1.5,
            ease: "power2.out",
            onComplete: () => {
              setCurrentPhase("ScorePhase");
              setContentSentence(<p>Voici un récapitulatif des scores</p>);
            },
          })
          .to(".pageContainer", {
            opacity: 1,
            duration: 1.5,
            ease: "power2.out",
          });
        break;
    }
  }

  function renderContent() {
    console.log(currentPhase, contentSentence, chronoStart);
    if (currentPhase == "Conversation") {
      return (
        <div className={styles.conversation}>
          <h3>Astuce</h3>
          <p>
            Il est plus facile de discerner la vérité avec 2-3 coups dans le
            nez.
          </p>
          {/* {currentPhase != "RevealPhase" && (
            <Countdown start={chronoStart} onEnd={eventEndClock}></Countdown>
          )}
          <h1>La conversation est en cours</h1> */}
        </div>
      );
    } else if (
      currentPhase == "RevealImage" ||
      currentPhase == "QuestionsPhase" ||
      currentPhase == "VotePhase"
    ) {
      return (
        <>
          <div className={styles.containerChrono}>
            <Countdown start={chronoStart} onEnd={eventEndClock}></Countdown>
          </div>
          {currentPhase == "VotePhase" && (
            <DraggablePawns
              colorListTrue={colorListTrue}
              colorListFalse={colorListFalse}
              containerRef={containerRef}
              imageRef1={imageRef1}
              imageRef2={imageRef2}
              images={images}
              setColorListTrue={setColorListTrue}
              setColorListFalse={setColorListFalse}
            ></DraggablePawns>
          )}
        </>
      );
    } else if (currentPhase == "ScorePhase") {
      return <Score gameId={gameId}></Score>;
    } else {
      return <></>;
    }
  }

  function eventEndClock() {
    // console.log(colorListTrue);
    // socket?.emit(
    //   "sendActorAction",
    //   gameId,
    //   "EndPhase",
    //   currentPhase == "VotePhase" ? { ImageTrueVotes: colorListTrue } : {},
    // );
  }

  function clickNextPhase() {
    console.log(colorListTrue);
    let nextPhase = "EndPhase";
    if (currentPhase === "ScorePhase") {
      nextPhase = "Click End";
    } else if (nextPhase === "RevealImage") {
      nextPhase = "EndChrono";
    }
    socket?.emit(
      "sendActorAction",
      gameId,
      nextPhase,
      currentPhase == "VotePhase" ? { ImageTrueVotes: colorListTrue } : {},
    );
  }

  function getVote(type = true) {
    return playersInGame.map((color, index) => {
      const checkTrue = colorListTrue.includes(color) && type;
      const checkFalse = colorListFalse.includes(color) && !type;
      if ((checkTrue || checkFalse) && color !== currentBluffer) {
        return (
          <svg
            className={styles.indicatorPoint}
            id="svg"
            viewBox={`0 0 ${blobParams.width} ${blobParams.height}`}
            width={blobParams.width}
            height={blobParams.height}
          >
            <Blob
              {...blobParams}
              color={players[color].color}
              dataColor={color}
              colorActive={true}
            />
          </svg>
        );
      }
      return <></>;
    });
  }

  return (
    <main className={styles.main}>
      <section className={styles.content} ref={containerRef}>
        {render}
        {/* <button onClick={clickNextPhase}>NextPhase</button> */}
        <div className={styles.imgShaders}>
          {currentPhase != "ScorePhase" &&
            images.length > 0 &&
            images.map((image, i) => (
              <div className={styles.singleImage}>
                <ImageShader
                  key={image.id}
                  url={image.url}
                  ref={i == 0 ? imageRef1 : imageRef2}
                  isBlurry={isBlurry}
                  width={width}
                  height={width}
                ></ImageShader>
                <div className={styles.votesIndicators}>
                  {getVote(image.isTrue)}
                </div>
              </div>
            ))}
        </div>
      </section>
      {currentPhase != "Conversation" ? (
        <Footer>
          <div>{contentSentence ? contentSentence : null}</div>
          <div>
            {currentPhase !== "RevealImage" ? (
              <Button
                color={"#373FEF"}
                type="link"
                events={{ onClick: clickNextPhase }}
              >
                Continuer
              </Button>
            ) : null}
          </div>
        </Footer>
      ) : null}
    </main>
  );
}
