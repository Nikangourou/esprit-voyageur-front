"use client";

import React, { useEffect, useState, useRef, useContext } from "react";
import styles from "./chat.module.scss";
import Messages from "./messages/messages";
import RecordingComponent from "../recordingComponent/recordingComponent";
import * as utils from "../../utils/micro";
import { v4 as uuidv4 } from "uuid";
import { pending, generateImg } from "../../utils/utils";
import Countdown from "../chrono/countdown";
import { SocketContext } from "../../context/socketContext";
import { div } from "three/nodes";
import { useDispatch, useSelector } from "react-redux";
import {
  setDistanceCircle,
  setShaderPosition,
} from "../../store/reducers/gameReducer";
import { get } from "http";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import ClipBlob from "../clipBlob/clipBlob";
import FooterBg from "../footer/footerBg";

const firstMessage = [
  {
    id: uuidv4(),
    content:
      " Pour commencer, peux-tu partager avec moi un souvenir qui te tient particulièrement à cœur ? Mentionne également à quel moment cela s'est passé et quel âge tu avais à ce moment-là.",
    send: false,
  },
];
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function Chat() {
  const players = useSelector((state) => state.players.players);
  const currentBluffer = useSelector((state) => state.players.currentBluffer);
  const { socket } = useContext(SocketContext);
  const router = useRouter();
  const [input, setInput] = useState("");
  const [base64, setBase64] = useState(null);
  const [messages, setMessages] = useState(firstMessage);
  const [nbSendMessages, setNbSendMessages] = useState(0);

  const [isFinished, setIsFinished] = useState("not");
  const dispatch = useDispatch();

  const threadKey = useRef(null);
  const gameId = useRef(null);
  const isReadyRef = useRef(false);
  const containerMessagesRef = useRef(null);
  const imagesCountRef = useRef(0);
  const textAreaRef = useRef(null);
  const tlStart = useRef(null);

  const colorStyle =
    currentBluffer && currentBluffer != ""
      ? players[currentBluffer].color
      : "#373FEF";

  if (typeof window === "undefined") {
    return <div></div>;
  }

  useEffect(() => {
    if (isReadyRef.current) {
      return;
    }

    if (!gameId.current) {
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
        });
    }
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

  const base64Reformat = (base64) => {
    const to_remove = "data:audio/webm;codecs=opus;base64,";
    return utils.arrayBufferToBase64(base64).replace(to_remove, "");
  };

  const onSpeechEnd = (audio) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(audio);
    reader.onload = () => {
      // check if the audio is not empty
      if (reader.result.byteLength === 0) {
        console.log("Audio is empty");
      } else {
        const buffer = base64Reformat(reader.result);
        console.log(buffer);
        setBase64(buffer);
      }
    };
  };

  const addMessages = (messageAdded) => {
    setMessages((prev) => [...prev, messageAdded]);
  };

  const subMessage = async () => {
    if (input === "") {
      return;
    }

    const msg = {
      id: uuidv4(),
      content: input,
      send: true,
    };

    // if (messages.length === 1) {
    //   updateConversation();
    // } else {
    sendTextTranscription();
    // }

    // addMessage(msg);
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

        pending(
          apiUrl,
          `/run/get/${data.id}`,
          threadKey.current,
          (data) => {
            getAnswer();
          },
          () => {
            setNbSendMessages((prev) => prev + 1);
          },
        );
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
        console.log(data);
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
          };

          if (isImg) {
            generateImg(apiUrl, content, gameId, type, socket, dispatch);
          }

          if (content.includes("FIN_CONVERSATION")) {
            console.log("FIN_CONVERSATION");
            setIsFinished("processing");
            const tl = gsap
              .timeline()
              .to(`.${styles.containerMessages}`, {
                yPercent: 300,
                opacity: 0,
                duration: 1,
                ease: "power2.out",
              })
              .to(".pageContainer", {
                opacity: 0,
                duration: 3,
                ease: "power2.out",
              })
              .to(
                ".footerBg",
                {
                  opacity: 0,
                  duration: 3,
                  ease: "power2.out",
                },
                "<",
              )
              .call(() => {
                dispatch(setDistanceCircle([0.65, 0.65]));
              })
              .call(
                () => {
                  dispatch(setShaderPosition(0));
                },
                null,
                ">1",
              );

            // Utilisation d'une expression régulière pour rechercher la partie du texte après "Remember:"

            addMessages(msg);
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
                      router.push("chat/images?gameId=" + gameId.current);
                    });
                  }
                })
                .catch((error) => {
                  console.error(error);
                });
            }
          } else {
            addMessages(msg);
          }
        }
      })
      .catch((error) => {
        console.log("error getAnswer");
        console.error("Error:", error);
      });
  };

  const altGenerateAllImages = () => {
    setIsFinished("processing");
    const tl = gsap
      .timeline()
      .to(`.${styles.containerMessages}`, {
        yPercent: 300,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
      })
      .to(".pageContainer", {
        opacity: 0,
        duration: 3,
        ease: "power2.out",
      })
      .to(
        ".footerBg",
        {
          opacity: 0,
          duration: 3,
          ease: "power2.out",
        },
        "<",
      )
      .call(() => {
        dispatch(setDistanceCircle([0.65, 0.65]));
      })
      .call(
        () => {
          dispatch(setShaderPosition(0));
        },
        null,
        ">1",
      )
      .call(async () => {
        const trueContent =
          "In 2021, on a serene spring day under a sky brushed with delicate pastels, you and your mother were sitting on a soft pink floral blanket spread beneath the overwhelmingly beautiful canopy of Cherry Blossoms in Kyoto, Japan. The air was vibrant with the sweet fragrance of the blossoms and the gentle hum of the bustling crowd around. As part of the Hanami festival, lanterns floated above altering their hues between soft pinks and deep reds, casting a warm glow. The festival celebrated the fleeting nature of life, mirrored by the brief bloom of the cherry blossoms. You indulged in tasting exquisite local dishes, surrounded by a setting sun that tinted everything golden, feeling a deep sense of joy and peace.";
        const falseContent =
          "In 2021, you and your mother traveled to Cambodia for her birthday, a significant trip since she hadn't returned since the 1970s. Your journey took you to the heart of Cambodia’s historic wonder, Angkor Wat. As you approached the majestic site, the excitement and anticipation were palpable. The air around Angkor Wat was thick with the aroma of tropical flora and the resonant sounds of ancient ceremonial music. It was a sunny day, the sky clear except for a few wispy clouds, creating a perfect backdrop for photography and exploration. During your visit, you encountered a spectacular performance depicting the coronation of the first king of Siam. The event was not only a feast for the eyes but also a poignant reminder of the rich tapestry of history and tradition that Cambodia preserves. Performers dressed in elaborate traditional attire danced and reenacted scenes from history with a grace that seemed to stop time itself. Emotions ran deep as your mother watched, tears gleaming in her eyes, moved by the profound connection to her past and the joy of sharing this moment with you.";
        await generateImg(
          apiUrl,
          trueContent,
          gameId,
          "simple",
          socket,
          dispatch,
        );
        await generateImg(
          apiUrl,
          falseContent,
          gameId,
          "false",
          socket,
          dispatch,
        );
        setIsFinished("end");
        router.push("chat/images?gameId=" + gameId.current);
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

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      // Vérifiez si Enter est pressé sans la touche Shift
      event.preventDefault(); // Empêchez le retour à la ligne par défaut de <textarea>
      subMessage(); // Soumettez le message
    }
  };

  return (
    <div className={styles.chat}>
      <div className={styles.containerMessages}>
        <Messages
          nbSendMessages={nbSendMessages}
          messages={messages}
        ></Messages>
        {/*<Message key={message.id} message={message} gameId={gameId.current} />*/}
      </div>
      <div className={styles.inputs}>
        <div
          className={styles.containerInput}
          style={{
            filter: `drop-shadow(4px 4px 0px ${colorStyle})`,
          }}
        >
          <textarea
            ref={textAreaRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ecrivez votre message"
          />
          <button
            onClick={subMessage}
            style={{
              filter: `drop-shadow(1px 2px 0px ${colorStyle})`,
            }}
          >
            <img src="/images/send.svg" alt="Send" />
          </button>
          <button
            className={styles.clearBtn}
            style={{
              filter: `drop-shadow(1px 2px 0px ${colorStyle})`,
            }}
            onClick={() => setInput("")}
          >
            <img src="/images/Trash.svg" alt="Send" />
          </button>
        </div>
        <RecordingComponent onEnd={onSpeechEnd} textAreaRef={textAreaRef} />
      </div>
      <FooterBg />
    </div>
  );
}
