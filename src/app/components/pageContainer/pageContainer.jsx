import styles from "./pageContainer.module.scss";
import { useSelector } from "react-redux";

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
          subTitle: "Sélectionner votre pion",
          textureShader: "/images/players.png",
          content: (
            <p>
              Pour lever le voile sur le passé de ceux que vous pensiez
              connaître,
              <br />
              il vous faudra <b>entre 3 et 7</b> valeureux joueurs ou équipes.
              <br />
              Cliquez vite sur l’une des balles sombres et découvrez votre
              couleur Joueur.
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
          content: <p></p>,
        };
    }
  };

  return (
    <main className={styles.container}>
      <section className={styles.content}>
        <div className={styles.titleContent}>
          <h3>{pageContent().subTitle}</h3>
          <img src={pageContent().textureShader} alt="" />
        </div>
        {pageContent().content}
      </section>
      {children}
    </main>
  );
}
