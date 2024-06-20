import React, { useState, useEffect, useRef } from "react";
import styles from "./countdown.module.scss";
import { useSelector } from "react-redux";

const Chrono = React.memo(({ start, onEnd }) => {
  const players = useSelector((state) => state.players.players);
  const currentBluffer = useSelector((state) => state.players.currentBluffer);
  const countDownPause = useSelector((state) => state.game.countDownPause);

  const startTimeRef = useRef(null); // Stocker le temps de départ
  const pauseStartTimeRef = useRef(null);
  const accumulatedPauseTimeRef = useRef(0);
  const [timeLeft, setTimeLeft] = useState(start);
  const [endStyle, setEndStyle] = useState(false);

  const colorStyle =
    currentBluffer && currentBluffer != ""
      ? players[currentBluffer].color
      : "#373FEF";

  useEffect(() => {
    startTimeRef.current = performance.now(); // Met à jour le temps de départ lorsque `start` change
    accumulatedPauseTimeRef.current = 0;
    setTimeLeft(start); // Réinitialise le temps restant
  }, [start]);

  useEffect(() => {
    let requestAnimationId;
    const update = () => {
      if (!countDownPause) {
        if (pauseStartTimeRef.current !== null) {
          accumulatedPauseTimeRef.current +=
            performance.now() - pauseStartTimeRef.current;
          pauseStartTimeRef.current = null;
        }

        const elapsedTime =
          (performance.now() -
            startTimeRef.current -
            accumulatedPauseTimeRef.current) /
          1000;
        const time = Math.floor(start - elapsedTime);

        setTimeLeft(time);

        if (time <= 0) {
          if (onEnd) {
            onEnd();
          }
          setEndStyle(true);
        } else {
          if (endStyle) {
            setEndStyle(false);
          }
          requestAnimationId = requestAnimationFrame(update);
        }
      } else {
        if (pauseStartTimeRef.current === null) {
          pauseStartTimeRef.current = performance.now();
        }
        requestAnimationId = requestAnimationFrame(update);
      }
    };

    update();

    return () => {
      cancelAnimationFrame(requestAnimationId);
    };
  }, [onEnd, countDownPause]);

  // Fonction pour formater le temps restant
  const formatTimeLeft = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft - minutes * 60;

    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className={`${styles.countdown} ${endStyle ? styles.end : ""}`}>
      <p>{formatTimeLeft()[0]}</p>
      <p>{formatTimeLeft()[1]}</p>
      <p className={styles.dot}>
        {formatTimeLeft()[2]}
        <span style={{ color: colorStyle }}>{formatTimeLeft()[2]}</span>
      </p>
      <p>{formatTimeLeft()[3]}</p>
      <p>{formatTimeLeft()[4]}</p>
    </div>
  );
});

export default Chrono;
