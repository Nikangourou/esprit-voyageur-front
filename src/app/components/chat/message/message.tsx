"use client";

import styles from "./message.module.scss";
import GetImg from "../../getImg/getImg";

export default function Message({ message, gameId }) {

    return (


        <p className={`${styles.message} ${message.send && styles.send}`}>
            {
                message.isImg && <GetImg prompt={message.content} gameId={gameId} />
            }
            {message.content}
        </p >

    );
}