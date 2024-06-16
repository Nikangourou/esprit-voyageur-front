import styles from "./playersList.module.scss";
import { useSelector } from "react-redux";
import { useState } from "react";
import Button from "../../button/button";
export default function PlayersList({ setIsAddingPlayers }) {
  const players = useSelector((state) => state.players.players);

  return (
    <section className={styles.playersList}>
      <div className={styles.textContent}>
        <h4>
          Bienvenue dans <b>VRAI MENT ?</b>
        </h4>
        <p>
          Ajoutez jusqu’à 7 joueurs ou 7 équipes, choissiez un avatar parmis
          ceux proposés. <b>Un joueur</b> parmi vous sera{" "}
          <b>désigné aléatoirement Voyageur.</b>
        </p>
      </div>
      <div className={styles.container}>
        {players.map((player, i) => (
          <h1 key={i}>player.name</h1>
        ))}
      </div>
      {players.length < 7 && (
        <Button
          color={"#1c1c1e"}
          event={() => {
            setIsAddingPlayers(true);
          }}
        >
          <span>+</span>
        </Button>
      )}
    </section>
  );
}
