import styles from "./remember.module.scss";
import PageContainer from "../pageContainer/pageContainer";
import Countdown from "../chrono/countdown";

export default function Remember({ event }) {
  return (
    <PageContainer pageCategory={"remember"}>
      <div className="container">
        <Countdown start={3} onEnd={event} />
      </div>
    </PageContainer>
  );
}
