"use client";

import { useEffect, useState, useRef, useContext } from "react";
import styles from "./chat.module.scss";
import Message from "./message/message";
import RecordingComponent from "../recordingComponent/recordingComponent";
import * as utils from "../../utils/micro";
import { v4 as uuidv4 } from "uuid";
import { pending } from "../../utils/utils";
import Countdown from "../chrono/countdown";
import { SocketContext } from "../../context/socketContext";
import { div } from "three/nodes";
import { useSelector } from "react-redux";

const firstMessage = [
  {
    id: uuidv4(),
    content:
      "Bravo, tu as été désigné comme le Bluffer. Je suis là pour t’aider à tromper les autres joueurs alors, vite, raconte-moi ton souvenir !",
    send: false,
  },
  {
    id: uuidv4(),
    content:
      "C'est parti pour une nouvelle aventure dans tes souvenirs. Pour commencer, peux-tu partager avec moi un souvenir qui te tient particulièrement à cœur ? Mentionne également à quel moment cela s'est passé et quel âge tu avais à ce moment-là.",
    send: false,
  },
];

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function Chat() {
  const trueImageId = useSelector((state) => state.players.trueImageId);
  const falseImageId = useSelector((state) => state.players.falseImageId);
  const { socket } = useContext(SocketContext);
  const [input, setInput] = useState("");
  const [base64, setBase64] = useState(null);
  const [messages, setMessages] = useState(firstMessage);
  const [isPaused, setIsPaused] = useState(true);
  const [isFinished, setIsFinished] = useState("not");

  const threadKey = useRef(null);
  const gameId = useRef(null);
  const isReadyRef = useRef(false);
  const containerMessagesRef = useRef(null);
  const imagesCountRef = useRef(0);

  useEffect(() => {
    if (isReadyRef.current) {
      return;
    }

    function startChrono() {
      setIsPaused(false);
      console.log("ploppy");
    }

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

        // socket.on("startChrono", () => {
        //   console.log("test");
        //   startChrono();
        // });
      });

    // return () => {
    //   socket?.off("startChrono", startChrono);
    // };
  }, [socket]);

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

  useEffect(() => {
    if (containerMessagesRef.current) {
      containerMessagesRef.current.scrollTop =
        containerMessagesRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (trueImageId && falseImageId) {
      console.log(trueImageId, falseImageId);
      socket.emit("sendActorAction", gameId.current, "ImagesGenerated", {
        TrueImageId: trueImageId,
        FalseImageId: falseImageId,
      });
      socket.emit("imagesAllGenerated", gameId.current);
    }
  }, [trueImageId, falseImageId]);

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

          const regex = /Remember:(.*)/;
          // Utilisation de la méthode match() pour récupérer le texte correspondant à l'expression régulière
          const resultat = content.match(regex);
          const promptRemember = resultat ? resultat[1].trim() : null;
          if (resultat) {
            content = promptRemember;
          }

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
            setIsFinished("processing");

            // Utilisation d'une expression régulière pour rechercher la partie du texte après "Remember:"

            addMessage(msg);
            imagesCountRef.current += 1;
            if (imagesCountRef.current == 1) {
              generatePrompt("alt")
                .then(() => {
                  console.log("altGenerated");
                  imagesCountRef.current += 1;
                  if (imagesCountRef.current == 2) {
                    return generatePrompt("simple").then(() => {
                      console.log("simpleGenerated");
                      setIsFinished("end");
                    });
                  }
                })
                .catch((error) => {
                  console.error(error);
                });
            }
          } else {
            addMessage(msg);
          }
        }
      })
      .catch((error) => {
        console.log("error1");
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

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      // Vérifiez si Enter est pressé sans la touche Shift
      event.preventDefault(); // Empêchez le retour à la ligne par défaut de <textarea>
      subMessage(); // Soumettez le message
    }
  };

  return (
    <div className={styles.chat}>
      <div className={styles.background} />
      <div className={styles.containerCountdown}>
        <Countdown start={120} onEnd={onEndCountdown} paused={isPaused} />
      </div>
      <div className={styles.containerMessages} ref={containerMessagesRef}>
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
      <div
        className={styles.containerInput}
        style={{ display: isFinished == "not" ? "auto" : "none" }}
      >
        <textarea
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ecrivez votre message"
        />
        <button onClick={subMessage}>
          <img src="/send.svg" alt="Send" />
        </button>
      </div>
      <div
        className={styles.containerRecording}
        style={{ display: isFinished == "not" ? "auto" : "none" }}
      >
        <RecordingComponent onEnd={onSpeechEnd} />
      </div>
      {isFinished != "not" && (
        <div>
          <p>
            {isFinished == "processing"
              ? "Génération des images"
              : "Veuillez fermé la page et retournez à la table"}
          </p>
          <button
            onClick={() => {
              socket?.emit(
                "sendActorAction",
                gameId.current,
                "ImagesGenerated",
              );
            }}
          >
            END CHRONO SOCKET
          </button>
        </div>
      )}
    </div>
  );
}
