import styles from "./messages.module.scss";
import Message from "../message/message";
import { useState } from "react";

export default function messages({ messages, nbSendMessages }) {
  const [listMessages] = useState([0, 1, 2, 3, 4, 5]);

  return (
    <div className={styles.messagesList}>
      {listMessages.map((num) => (
        <Message
          message={messages && messages[num] ? messages[num] : null}
          idx={num}
          nbSendMessages={nbSendMessages}
        ></Message>
      ))}
    </div>
  );
}
