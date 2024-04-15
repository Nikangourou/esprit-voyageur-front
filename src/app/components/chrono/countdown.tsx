import React, { useState, useEffect } from "react";
import styles from "./countdown.module.scss";
import { useSelector } from "react-redux";

interface CountdownProps {
  start: number;
  onEnd?: () => void;
}

export default function Countdown({ start, onEnd }) {
  const players = useSelector((state) => state.players.players);
  const currentBluffeur = useSelector((state) => state.players.currentBluffeur);

  const colorStyle =
    currentBluffeur != "" ? players[currentBluffeur].color : "#373FEF";
  const [timeLeft, setTimeLeft] = useState(start);

  useEffect(() => {
    // Si le temps est écoulé et la fonction onEnd est définie, l'exécuter
    if (timeLeft === 0) {
      if (onEnd) onEnd();
      return;
    }

    // Définir l'intervalle pour décrémenter le temps
    const timerId = setInterval(() => {
      setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
    }, 1000);

    // Nettoyer l'intervalle
    return () => clearInterval(timerId);
  }, [timeLeft, onEnd]); // Ajout de onEnd dans le tableau de dépendances

  useEffect(() => {
    setTimeLeft(start);
  }, [start]);

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
