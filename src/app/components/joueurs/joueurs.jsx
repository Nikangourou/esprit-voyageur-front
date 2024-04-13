import styles from "./joueurs.module.scss";
import PageContainer from "../pageContainer/pageContainer";
import AddPlayer from "./addPlayer/addPlayer";
import Countdown from "../chrono/countdown";

export default function Joueurs({ nextPage }) {
  return (
    <PageContainer pageCategory={"player"}>
      <AddPlayer nextPage={nextPage}></AddPlayer>
    </PageContainer>
  );
}
