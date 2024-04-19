import styles from "./joueurs.module.scss";
import PageContainer from "../pageContainer/pageContainer";
import AddPlayer from "./addPlayer/addPlayer";
import Countdown from "../chrono/countdown";
import Blob from "../blob/blob";

export default function Joueurs({ gameId }) {
  return (
    <PageContainer pageCategory={"player"}>
      <AddPlayer gameId={gameId}></AddPlayer>
    </PageContainer>
  );
}
