"use client";

import { useEffect, useState } from "react";
import styles from "./chat.module.scss";
import Message from "./message/message";
import RecordingComponent from "../recordingComponent/recordingComponent";
import * as utils from "../../utils/micro";

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

    const [input, setInput] = useState("");
    const [base64, setBase64] = useState(null)

    // get threadKey from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const threadKey = urlParams.get('threadKey');

    useEffect(() => {
        if (base64) {
            fetch("http://localhost:5001/gamev2/update/send_answer", {
                // fetch("https://espritvoyageur-production.up.railway.app/gamev2/update/send_answer", {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    threadKey: threadKey,
                    audioData: base64,
                })
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Send Audio');
                    console.log(data);
                    setInput(data.transcription)
                }).catch(error => {
                    console.error('Error:', error);
                });
        }
    }, [base64])

    function base64Reformat(base64) {
        const to_remove = "data:audio/webm;codecs=opus;base64,";
        return utils.arrayBufferToBase64(base64).replace(to_remove, "");
    }

    const onSpeechEnd = (audio) => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(audio);
        reader.onload = () => {
            const buffer = base64Reformat(reader.result);
            setBase64(buffer)
        };
    }

    return (
        <div className={styles.chat}>
            <div className={styles.containerMessages}>
                {
                    messages.map((message) => {
                        return <Message key={message.id} message={message} />
                    })
                }
            </div>
            <div className={styles.containerInput}>
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ecrivez votre message" />
                <RecordingComponent onEnd={onSpeechEnd} />
                <button>Envoyer</button>
            </div>
        </div>
    );
}