"use client";

import { useEffect, useState, useRef } from "react";
import styles from "./chat.module.scss";
import Message from "./message/message";
import RecordingComponent from "../recordingComponent/recordingComponent";
import * as utils from "../../utils/micro";
import { v4 as uuidv4 } from "uuid";
import { pending } from "../../utils/utils";
import { io } from "socket.io-client";
import { get } from "http";
import Countdown from "../chrono/countdown";

const firstMessage = {
  id: uuidv4(),
  content:
    "C'est parti pour une nouvelle aventure dans tes souvenirs. Pour commencer, peux-tu partager avec moi un souvenir qui te tient particulièrement à cœur ? Mentionne également à quel moment cela s'est passé et quel âge tu avais à ce moment-là.",
  send: false,
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function Chat() {
  const [input, setInput] = useState("");
  const [base64, setBase64] = useState(null);
  const [messages, setMessages] = useState([firstMessage]);

  const threadKey = useRef(null);
  const gameId = useRef(null);
  const isReadyRef = useRef(false);
  const socket = useRef(null);

  useEffect(() => {
    if (!isReadyRef.current) {
      const urlParams = new URLSearchParams(window.location.search);
      gameId.current = urlParams.get("gameId");
      isReadyRef.current = true;
      fetch(`${apiUrl}/thread/post/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          game_id: gameId.current,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Create Game");
          console.log(data);
          threadKey.current = data.key;

          socket.current = io("localhost:5001");
          socket.current.emit("connexionPhone", gameId.current);
        });
    }

    return () => {
      // if (socket.current) {
      //     socket.current.close();
      //     socket.current = null;
      // }
    };
  }, []);

  useEffect(() => {
    if (base64) {
      fetch(`${apiUrl}/thread/update/send_answer`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          threadKey: threadKey.current,
          audioData: base64,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Send Audio");
          console.log(data);
          setInput(data.transcription);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }, [base64]);

  const base64Reformat = (base64) => {
    const to_remove = "data:audio/webm;codecs=opus;base64,";
    return utils.arrayBufferToBase64(base64).replace(to_remove, "");
  };

  const onSpeechEnd = (audio) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(audio);
    reader.onload = () => {
      const buffer = base64Reformat(reader.result);
      setBase64(buffer);
    };
  };

  const addMessage = (message) => {
    setMessages((prev) => {
      const tmp = [...prev];
      tmp.push(message);
      return tmp;
    });
  };

  const subMessage = async () => {
    if (input === "") {
      return;
    }

    const msg = {
      id: uuidv4(),
      content: input,
      send: true,
      isImg: false,
    };

    if (messages.length === 1) {
      updateConversation();
    } else {
      sendTextTranscription();
    }

    addMessage(msg);
    setInput("");
  };

  const sendTextTranscription = () => {
    fetch(`${apiUrl}/thread/post/send_transcription`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        threadKey: threadKey.current,
        transcription: input,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Send text transcription");
        console.log(data);

        pending(apiUrl, `/run/get/${data.id}`, threadKey.current, (data) => {
          getAnswer();
        });
      });
  };

  const updateConversation = () => {
    fetch(`${apiUrl}/thread/update/conversation`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        threadKey: threadKey.current,
        extract: input,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Update conversation");
        console.log(data);

        pending(apiUrl, `/run/get/${data.id}`, threadKey.current, (data) => {
          getAnswer();
        });
      });
  };

  const getAnswer = (isImg = false, type) => {
    return fetch(`${apiUrl}/run/answers/${threadKey.current}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data[0] && data[0][0]) {
          let content = data[0][0].text.value;

          let msg = {
            id: uuidv4(),
            content: content,
            send: false,
            isImg: isImg,
            type: isImg ? type : null,
          };

          if (content.includes("FIN_CONVERSATION")) {
            console.log("FIN_CONVERSATION");
            content = content.replace("FIN_CONVERSATION", "");
            msg.content = content;

            addMessage(msg);

            generatePrompt("alt")
              .then(() => {
                return generatePrompt("simple");
              })
              .catch((error) => {
                console.error(error);
              });
          } else {
            addMessage(msg);
          }
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const generatePrompt = (type) => {
    console.log("Generate prompt", type);
    return new Promise((resolve, reject) => {
      let endpoint = "";
      switch (type) {
        case "simple":
          endpoint = "/thread/post/generate_prompt_simple";
          break;
        case "alt":
          endpoint = "/thread/post/generate_prompt_alt";
          break;
        default:
          reject("Invalid prompt type");
          return;
      }

      fetch(`${apiUrl}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          threadKey: threadKey.current,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Generate prompt", data);
          // Supposons que pending utilise également des promesses.
          pending(apiUrl, `/run/get/${data.id}`, threadKey.current, (data) => {
            getAnswer(true, type);
            resolve(data); // Résoudre la promesse avec les données reçues.
          });
        })
        .catch((error) => {
          console.error("Error during prompt generation:", error);
          reject(error); // Rejeter la promesse en cas d'erreur.
        });
    });
  };

  const onEndCountdown = () => {
    console.log("End countdown");
  };

  return (
    <div className={styles.chat}>
      <Countdown start={120} onEnd={onEndCountdown} />
      <div className={styles.containerMessages}>
        {messages.map((message) => {
          return (
            <Message
              key={message.id}
              message={message}
              gameId={gameId.current}
            />
          );
        })}
      </div>
      <div className={styles.containerInput}>
        <textarea
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ecrivez votre message"
        />
        <RecordingComponent onEnd={onSpeechEnd} />
        <button onClick={subMessage}>Envoyer</button>
      </div>
    </div>
  );
}
