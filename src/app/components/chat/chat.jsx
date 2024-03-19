"use client";

import { useEffect, useState } from "react";
import styles from "./chat.module.scss";
import Message from "./message/message";
import RecordingComponent from "../recordingComponent/recordingComponent";
import * as utils from "../../utils/micro";
import { v4 as uuidv4 } from 'uuid';
import { pending } from '../../utils/utils';

const firstMessage = {
    id: uuidv4(),
    content: "C'est parti pour une nouvelle aventure dans tes souvenirs. Pour commencer, peux-tu partager avec moi un souvenir qui te tient particulièrement à cœur ? Mentionne également à quel moment cela s'est passé et quel âge tu avais à ce moment-là.",
    send: false,
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function Chat() {

    const [input, setInput] = useState("");
    const [base64, setBase64] = useState(null)
    const [messages, setMessages] = useState([firstMessage])
    const [threadKey, setThreadKey] = useState(null);
    const [gameId, setGameId] = useState(null);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        setThreadKey(urlParams.get('threadKey'));
        setGameId(urlParams.get('gameId'));
    }, []);

    useEffect(() => {
        if (base64) {
            fetch(`${apiUrl}/gamev2/update/send_answer`, {
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

    const addMessage = (message) => {

        setMessages((prev) => {
            const tmp = [...prev];
            tmp.push(message);
            return tmp;
        })
    }



    const subMessage = () => {

        if (input === "") {
            return;
        }

        if (messages.length === 1) {
            updateConversation();
        } else {
            sendTextTranscription();
        }

        const msg = {
            id: uuidv4(),
            content: input,
            send: true,
            isImg: false,
        }
        addMessage(msg);
        setInput("");

    }

    const sendTextTranscription = () => {

        fetch(`${apiUrl}/gamev2/post/send_transcription`, {
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

                pending(apiUrl, `/run/get/${data.id}`, threadKey, (data) => {
                    getAnswer()
                });
            })
    }

    const updateConversation = () => {
        fetch(`${apiUrl}/gamev2/update/conversation`, {
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

                pending(apiUrl, `/run/get/${data.id}`, threadKey, (data) => {
                    getAnswer()
                });
            })
    }

    const getAnswer = (isImg = false) => {
        fetch(`${apiUrl}/run/answers/${threadKey}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => response.json())
            .then(data => {

                if (data && data[0] && data[0][0]) {

                    let content = data[0][0].text.value;

                    let msg = {
                        id: uuidv4(),
                        content: content,
                        send: false,
                        isImg: isImg
                    }

                    if (content.includes("FIN_CONVERSATION")) {
                        console.log("FIN_CONVERSATION")
                        content = content.replace("FIN_CONVERSATION", "")
                        msg.content = content;

                        addMessage(msg);

                        generatePrompt('simple'); 
                        generatePrompt('alt');    

                    } else {
                        addMessage(msg);
                    }
                }

            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    const generatePrompt = (type) => {
        let endpoint = "";
        switch (type) {
            case 'simple':
                endpoint = "/gamev2/post/generate_prompt_simple";
                break;
            case 'alt':
                endpoint = "/gamev2/post/generate_prompt_alt";
                break;
            default:
                throw new Error("Invalid prompt type");
        }

        fetch(`${apiUrl}${endpoint}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                threadKey: threadKey,
            })
        })
            .then(response => response.json())
            .then(data => {
                console.log('Generate prompt', data);
                pending(apiUrl, `/run/get/${data.id}`, threadKey, (data) => {
                    getAnswer(true);
                });
            })
            .catch(error => {
                console.error('Error during prompt generation:', error);
            });
    }



    return (
        <div className={styles.chat}>
            <div className={styles.containerMessages}>
                {
                    messages.map((message) => {
                        return <Message key={message.id} message={message} gameId={gameId} />
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