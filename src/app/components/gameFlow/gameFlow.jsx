import styles from "./gameFlow.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import ImageShader from "../imageShader/ImageShader";
import Countdown from "../chrono/countdown";
import Button from "../button/button";
import { incrementScorePlayers } from "../../store/reducers/playersReducer";
import PageContainer from "../pageContainer/pageContainer";

export default function GameFlow({ images }) {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [contentSentence, setContentSentence] = useState();
  const [chronoStart, setChronoStart] = useState(5);
  const [colorListTrue, setColorListTrue] = useState([]);
  const [isBlurry, setIsBlurry] = useState(true);

  const playersInGame = useSelector((state) => state.players.playersInGame);
  const players = useSelector((state) => state.players.players);
  const currentBluffeur = useSelector((state) => state.players.currentBluffeur);
  const dispatch = useDispatch();

  const colorStyle =
    currentBluffeur != "" ? players[currentBluffeur].color : "";

  console.log(playersInGame);

  function eventEndClock() {
    console.log(playersInGame);
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
        setTimeout(() => {
          setCurrentPhase(1);
        }, 1000);
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
        setChronoStart(5000);
        setTimeout(() => {
          setCurrentPhase(2);
        }, 1000);
        break;
      case 2: // Passage phase vote à la phase score
        //TODO rendre fluide la transition avec GSAP
        setCurrentPhase(3);
        //TODO Récupérer les votes et les enregistrer dans colorListTrue
        // dispatch(incrementScorePlayers(colorListTrue));
        break;
    }
  }

  return (
    <section className={styles.containerGame}>
      <Countdown start={chronoStart} onEnd={eventEndClock} />
      <h1>Game</h1>
      <div className={styles.imgShaders}>
        {images.length > 0 &&
          images.map((image, i) => (
            <ImageShader
              // key={image.id}
              // url={image.url}
              key={i}
              // url={image.url}
              isBlurry={isBlurry}
            ></ImageShader>
          ))}
      </div>

      {contentSentence ? (
        contentSentence
      ) : (
        <p>
          Nous avons dérobé les souvenirs de{" "}
          <b style={{ color: colorStyle, textTransform: "capitalize" }}>
            {currentBluffeur}
          </b>
          mais ils sont encore flous...
          <br /> <i>Chut, n’allez pas lui répéter !</i>
        </p>
      )}
      {currentPhase == 2 &&
        playersInGame.map((color) => {
          // Exclu bluffeur
          console.log(color);
          if (color !== currentBluffeur) {
            return (
              <Button
                key={id}
                type={"player"}
                color={players[color].color}
                colorActive={true}
              ></Button>
            );
          }
        })}
      {currentPhase == 3 && (
        <PageContainer pageCategory={"score"}></PageContainer>
      )}
    </section>
  );
}
