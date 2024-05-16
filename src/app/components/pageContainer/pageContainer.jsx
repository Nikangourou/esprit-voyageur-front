import styles from "./pageContainer.module.scss";
import { useSelector } from "react-redux";

export default function PageContainer({
  children,
  pageCategory,
  color = null,
}) {
  const players = useSelector((state) => state.players.players);
  const currentBluffer = useSelector((state) => state.players.currentBluffer);

  const colorStyle = currentBluffer != "" ? players[currentBluffer].color : "";

  const pageContent = () => {
    switch (pageCategory) {
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
          <h3>{pageContent().subTitle}</h3>
          <img src={pageContent().textureShader} alt="" />
        </div>
        {pageContent().content}
      </section>
      {children}
    </main>
  );
}
