import styles from "./pageContainer.module.scss";
import { useSelector } from "react-redux";
import Title from "../title/title";

export default function PageContainer({
  children,
  pageCategory,
  color = null,
}) {
  const players = useSelector((state) => state.players.players);
  const currentBluffeur = useSelector((state) => state.players.currentBluffeur);

  const colorStyle =
    currentBluffeur != "" ? players[currentBluffeur].color : "";

  const pageContent = () => {
    switch (pageCategory) {
      case "player":
        return {
          subTitle: "Selection des joueurs",
          content: (
            <p>
              Toucher un pion pour vous enregistrer en tant que joueur.

              <br />
              Il faut <b>entre 3 et 7</b> joueurs/équipes par partie.
            </p>
          ),
        };
      case "remember":
        return {
          subTitle: "À présent,",
          textureShader: "/images/remember.png",
          content: (
            <p>
              Vite, vite !<br />
              Vous n’avez que <b>1 min</b> pour piocher{" "}
              <b
                style={{
                  color: "#373FEF",
                }}
              >
                entre 1 et 3 cartes
              </b>{" "}
              !
              <br />
              Servez-vous de l’une d’entre elles pour vous remémorer le souvenir
              que vous souhaitez partager.
            </p>
          ),
        };
      case "bluffer":
        return {
          subTitle: "Découvrez le",
          textureShader: "/images/bluff.png",
          content: (
            <p>
              Oh, c’est toi{" "}
              <b style={{ color: colorStyle, textTransform: "capitalize" }}>
                {currentBluffeur}
              </b>{" "}
              ! Te voilà désigné comme le bluffer.
              <br />
              Scanne vite le QR code avec ton portable et isole toi...
              <br />
              le temps t’es compté !
            </p>
          ),
        };
      case "score":
        return {
          subTitle: "Voici le",
          textureShader: "/images/score.png",
          content: <p>Voici un petit résumé des scores !</p>,
        };
    }
  };

  return (
    <main className={styles.container}>
      <section className={styles.content}>
        <div className={styles.titleContent}>
          <Title title={pageContent().subTitle}></Title>
          {pageContent().textureShader && (
            <img src={pageContent().textureShader} alt="" />
          )}
        </div>
        {pageContent().content}
      </section>
      {children}
    </main>
  );
}
