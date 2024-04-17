import React, { useState, useEffect, useRef } from "react";
import styles from "./countdown.module.scss";
import { useSelector } from "react-redux";

export default function Countdown({ start, onEnd, paused = false }) {
  const players = useSelector((state) => state.players.players);
  const currentBluffeur = useSelector((state) => state.players.currentBluffeur);
  const startTimeRef = useRef(null); // Stocker le temps de départ

  const colorStyle =
    currentBluffeur != "" ? players[currentBluffeur].color : "#373FEF";
  const [timeLeft, setTimeLeft] = useState(start);

  useEffect(() => {
    startTimeRef.current = performance.now();
    let requestAnimationId;
    function update() {
      if (!paused) {
        const time = Math.floor(
          start - (performance.now() - startTimeRef.current) / 1000,
        );

        setTimeLeft(time);
        if (time <= 0) {
          if (onEnd) onEnd();
        }
      }

      requestAnimationId = requestAnimationFrame(update);
    }
    update();
    return () => {
      cancelAnimationFrame(requestAnimationId);
    };
  }, [start, paused, onEnd]);

  // Fonction pour formater le temps restant
  const formatTimeLeft = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft - minutes * 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className={styles.countdown}>
      <p>
        {formatTimeLeft()[0]}
        <span>{formatTimeLeft()[0]}</span>
      </p>
      <p>
        {formatTimeLeft()[1]}
        <span>{formatTimeLeft()[1]}</span>
      </p>
      <p style={{ color: colorStyle }}>
        {formatTimeLeft()[2]}
        <span>{formatTimeLeft()[2]}</span>
      </p>
      <p>
        {formatTimeLeft()[3]}
        <span>{formatTimeLeft()[3]}</span>
      </p>
      <p>
        {formatTimeLeft()[4]}
        <span>{formatTimeLeft()[4]}</span>
      </p>
    </div>
  );
}
