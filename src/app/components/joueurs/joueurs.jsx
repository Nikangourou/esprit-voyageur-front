import styles from "./joueurs.module.scss";
import PageContainer from "../pageContainer/pageContainer";
import AddPlayer from "./addPlayer/addPlayer";

export default function Joueurs({ nextPage }) {
  return (
    <PageContainer pageCategory={"player"}>
      <AddPlayer nextPage={nextPage}></AddPlayer>
    </PageContainer>
  );
}
