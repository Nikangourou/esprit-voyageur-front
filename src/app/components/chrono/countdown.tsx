import React, { useState, useEffect } from 'react';
import styles from "./countdown.module.scss";

interface CountdownProps {
  start: number;
  onEnd?: () => void;
}

export default function Countdown({ start, onEnd }: CountdownProps) {
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

  // Fonction pour formater le temps restant
  const formatTimeLeft = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft - minutes * 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={styles.countdown}>
      <p>{formatTimeLeft()}</p>
    </div>
  );
}