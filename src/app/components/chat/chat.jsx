"use client";

import { useEffect, useState } from "react";
import styles from "./chat.module.scss";
import Message from "./message/message";
import RecordingComponent from "../recordingComponent/recordingComponent";
import * as utils from "../../utils/micro";
import { v4 as uuidv4 } from 'uuid';

const firstMessage = {
    id: uuidv4(),
    content: "C'est parti pour une nouvelle aventure dans tes souvenirs. Pour commencer, peux-tu partager avec moi un souvenir qui te tient particulièrement à cœur ? Mentionne également à quel moment cela s'est passé et quel âge tu avais à ce moment-là.",
    send: false,
};

export default function Chat() {

    const [input, setInput] = useState("");
    const [base64, setBase64] = useState(null)
    const [messages, setMessages] = useState([firstMessage])
    const [ready, setReady] = useState(false)
    const [generateImages, setGenerateImages] = useState(false)
 

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

    const subMessage = () => {

        if (input === "") {
            return;
        }

        console.log(messages.length)

        if (messages.length === 1) {
            updateConversation();
        } else {
            sendTextTranscription();
        }

        setMessages([...messages, { id: uuidv4(), content: input, send: true }]);
        setInput("");

    }

    const sendTextTranscription = () => {

        fetch("http://localhost:5001/gamev2/post/send_transcription", {
            // fetch("https://espritvoyageur-production.up.railway.app:5001/gamev2/post/send_transcription", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                threadKey: threadKey,
                transcription: input,
            })
        })
            .then(response => response.json())
            .then(data => {
                console.log('Send text transcription');
                console.log(data);

                let dataTmp = data;

                setReady(false)
                const interval = setInterval(() => {
                    fetch(`http://localhost:5001/run/get/${data.id}/${threadKey}`, {
                        // fetch(`https://espritvoyageur-production.up.railway.app/run/get/${data.id}/${threadKey}`, {
                        method: "GET",
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    })
                        .then(response => response.json())
                        .then(data2 => {
                            console.log("pending send text transcription...")
                            if (data2.status === "completed") {
                                console.log('Completed');
                                dataTmp = data2;
                                setReady(true)
                                getAnswer()
                                clearInterval(interval);
                            }
                        });
                }, 1000);
            })
    }

    const updateConversation = () => {
        fetch("http://localhost:5001/gamev2/update/conversation", {
            // fetch("https://espritvoyageur-production.up.railway.app/gamev2/update/conversation", {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                threadKey: threadKey,
                extract: input,
            })
        })
            .then(response => response.json())
            .then(data => {
                console.log('Update conversation');
                console.log(data);

                let dataTmp = data;

                const interval = setInterval(() => {
                    fetch(`http://localhost:5001/run/get/${data.id}/${threadKey}`, {
                        // fetch(`https://espritvoyageur-production.up.railway.app/run/get/${data.id}/${threadKey}`, {
                        method: "GET",
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    })
                        .then(response => response.json())
                        .then(data2 => {
                            console.log("pending update conversation...")
                            if (data2.status === "completed") {
                                console.log('Completed');
                                dataTmp = data2;
                                setReady(true)
                                getAnswer()
                                clearInterval(interval);
                            }
                        });
                }, 1000);
            })
    }

    const getAnswer = () => {
        fetch(`http://localhost:5001/run/answers/${threadKey}`, {
            // fetch(`https://espritvoyageur-production.up.railway.app/run/answers/${threadKey}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => response.json())
            .then(data => {
                // console.log('Get:', data, data[0][0].text.value);
                let msg = {
                    id: uuidv4(),
                    content: data[0][0].text.value,
                    send: false,
                }
                setMessages((prev) => {
                    const tmp = [...prev];
                    tmp.push(msg);
                    console.log(tmp)
                    return tmp;
                })

                if (generateImages) {
                    const promptsTmp = [...prompts, data[0][0].text.value]
                    setPrompts(promptsTmp)
                    console.log(data[0][0].text.value)
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
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
                <textarea type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ecrivez votre message" />
                <RecordingComponent onEnd={onSpeechEnd} />
                <button onClick={subMessage}>Envoyer</button>
            </div>
        </div>
    );
}