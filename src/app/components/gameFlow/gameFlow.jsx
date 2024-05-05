import styles from "./gameFlow.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import ImageShader from "../imageShader/ImageShader";
import Countdown from "../chrono/countdown";
import Button from "../button/button";

import PageContainer from "../pageContainer/pageContainer";

export default function GameFlow({ images, nextPage }) {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [contentSentence, setContentSentence] = useState();
  const [chronoStart, setChronoStart] = useState(20);
  const [colorListTrue, setColorListTrue] = useState([]);
  const [isBlurry, setIsBlurry] = useState(true);
  const containerRef = useRef();
  const imageRef1 = useRef();
  const imageRef2 = useRef();

  const playersInGame = useSelector((state) => state.players.playersInGame);
  const players = useSelector((state) => state.players.players);
  const currentBluffer = useSelector((state) => state.players.currentBluffer);
  const dispatch = useDispatch();

  const colorStyle = currentBluffer != "" ? players[currentBluffer].color : "";

  function isPointWithinRadiusFromCenter(element, point) {
    // Récupérer les dimensions de l'élément
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculer la distance entre le centre de l'élément et le point donné
    const distance = Math.sqrt(
      Math.pow(point.x - centerX, 2) + Math.pow(point.y - centerY, 2),
    );

    // Vérifier si la distance est inférieure ou égale au rayon
    return distance <= rect.width / 2;
  }

  function eventDragEnd(point) {
    if (isPointWithinRadiusFromCenter(imageRef1.current, point)) {
      if (images && images[0].isTrue) {
        setColorListTrue((prev) => [
          ...prev,
          point.target.getAttribute("data-color"),
        ]);
        //TODO GSAP ANIM FEEDBACK
      }
    } else if (isPointWithinRadiusFromCenter(imageRef2.current, point)) {
      if (images && images[1].isTrue) {
        setColorListTrue((prev) => [
          ...prev,
          point.target.getAttribute("data-color"),
        ]);
        console.log("AJOUT DANS LISTE TRUE");
        //TODO GSAP ANIM FEEDBACK
      }
    } else {
      console.log("out images");
    }
  }

  function eventEndClock() {
    switch (currentPhase) {
      case 0: // Passage images flou à non flou
        //TODO rendre fluide la transition avec GSAP
        setIsBlurry(false);
        setContentSentence(
          <p>
            Attention !<br />
            <i>Ne vous laissez pas berner...</i>
          </p>,
        );
        setChronoStart(10);
        setCurrentPhase(1);
        break;
      case 1: // Passage phase réflexion à la phase vote
        //TODO rendre fluide la transition avec GSAP
        //TODO event rendant les pions visibles
        setContentSentence(
          <p>
            Vite, c’est l’heure de voter !<br />
            <i>Déplace ton pion Joueur sur le véritable souvenir.</i>
          </p>,
        );
        setChronoStart(20);
        setCurrentPhase(2);
        break;
      case 2: // Passage phase vote à la phase score
        //TODO rendre fluide la transition avec GSAP
        setCurrentPhase(3);
        //TODO Récupérer les votes et les enregistrer dans colorListTrue
        // dispatch(incrementScorePlayers({ imageTrue: colorListTrue }));
        // dispatch(incrementNbRound());
        nextPage();
        break;
    }
  }

  return (
    <section className={styles.containerGame} ref={containerRef}>
      <div className={styles.containerChrono}>
        <Countdown start={chronoStart} onEnd={eventEndClock}></Countdown>
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
        {currentPhase == 2 &&
          playersInGame.map((color, i) => {
            // Exclu bluffeur
            console.log(color);
            if (color !== currentBluffer) {
              return (
                <Button
                  dragEndEvent={eventDragEnd}
                  dragContainer={containerRef.current}
                  key={i + color}
                  type={"player"}
                  dataColor={color}
                  color={players[color].color}
                  colorActive={true}
                ></Button>
              );
            }
          })}
      </div>
    </section>
  );
}
