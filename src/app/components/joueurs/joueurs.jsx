import styles from "./joueurs.module.scss";
import PageContainer from "../pageContainer/pageContainer";
import AddPlayer from "./addPlayer/addPlayer";
import Countdown from "../chrono/countdown";
import Blob from "../blob/blob";

export default function Joueurs() {
  return (
    <PageContainer pageCategory={"player"}>
      <AddPlayer></AddPlayer>
      {/* <Blob
        numPoints={7}
        minRadius={40}
        maxRadius={42}
        minDuration={1}
        maxDuration={2}
        color={"#FF00FF"}
      /> */}
    </PageContainer>
  );
}
