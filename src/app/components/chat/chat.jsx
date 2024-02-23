"use client";

import { useEffect, useState } from "react";
import styles from "./chat.module.scss";
import Message from "./message/message";

const messagesD = [
    {
        id: 1,
        content: "Imagine qu'on puisse remonter le temps. Quel jeu ou activité de ton enfance aimerais-tu revivre pour une journée ?",
        send: true
    },
    {
        id: 2,
        content: "Salut, je suis partant pour un jeu de société",
        send: false
    },
    {
        id: 3,
        content: "Salut, je suis partant pour un jeu de société",
        send: true
    },
    {
        id: 4,
        content: "Salut, je suis partant pour un jeu de société",
        send: false
    },
    {
        id: 5,
        content: "Salut, je suis partant pour un jeu de société",
        send: true
    },
    {
        id: 6,
        content: "Salut, je suis partant pour un jeu de société",
        send: false
    },
    {
        id: 7,
        content: "Salut, je suis partant pour un jeu de société",
        send: true
    },
    {
        id: 8,
        content: "Salut, je suis partant pour un jeu de société",
        send: false
    },
    {
        id: 9,
        content: "Salut, je suis partant pour un jeu de société",
        send: true
    },
    {
        id: 10,
        content: "Salut, je suis partant pour un jeu de société",
        send: false
    },
    {
        id: 11,
        content: "Salut, je suis partant pour un jeu de société",
        send: true
    },
    {
        id: 12,
        content: "Salut, je suis partant pour un jeu de société",
        send: false
    }
]

export default function Chat({ messages }) {

    return (
        <div className={styles.chat}>
            {
                messagesD.map((message) => {
                    return <Message key={message.id} message={message} />
                })
            }
            {/* Champ text */}
            <div className={styles.input}>
                <input type="text" placeholder="Ecrivez un message" />
                <button>Envoyer</button>
            </div>
        </div>
    );
}