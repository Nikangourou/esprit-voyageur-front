"use client" // This directive is unusual and typically not standard JavaScript or React. Make sure it is necessary for your project.

import { useEffect, useState } from "react";
import RecordingComponent from "../components/recordingComponent/recordingComponent";
import GetImg from "../components/getImg/getImg";
import FullScreen from "../components/fullScreen/fullScreen";
import CreateGame from "../components/createGame/createGame";
import * as utils from "../utils/micro";
import styles from "./page.module.scss";

export default function Voyageur() {
  const [threadKey, setThreadKey] = useState(null)
  const [base64, setBase64] = useState(null)
  const [prompt, setPrompt] = useState("")
  const [gameId, setGameId] = useState(null)
  const [transcription, setTranscription] = useState([])
  const [ready, setReady] = useState(false)

  // useEffect(() => {
  //   if (base64) {
  //     fetch("http://localhost:5001/game/update/audio", {
  //       method: "PUT",
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         threadKey: threadKey,
  //         audioData: base64,
  //         field: "context"
  //       })
  //     })
  //       .then(response => response.json())
  //       .then(data => {
  //         setPrompt(data.context)
  //       })
  //   }
  // }, [base64])

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

  const updateConversation = () => {
    fetch("http://localhost:5001/gamev2/update/conversation", {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        threadKey: threadKey,
      })
    })
      .then(response => response.json())
      .then(data => {
        console.log('Update');
        console.log(data);

        let dataTmp = data;

        const interval = setInterval(() => {
          fetch(`http://localhost:5001/run/get/${data.id}/${threadKey}`, {
            method: "GET",
            headers: {
              'Content-Type': 'application/json',
            }
          })
            .then(response => response.json())
            .then(data2 => {
              console.log("pending...")
              if (data2.status === "completed") {
                console.log('Completed');
                dataTmp = data2;
                setReady(true)
                clearInterval(interval);
              }
            });
        }, 1000);
      })
  }

  const getAnswer = () => {
    fetch(`http://localhost:5001/run/answers/${threadKey}`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log('Get:', data);
        setTranscription(transcription => [...transcription, data[0][0].text.value])
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }



  const sendAnswer = () => {
    fetch("http://localhost:5001/gamev2/update/send_answer", {
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
        console.log('Send Answer');
        console.log(data);
        setTranscription(transcription => [...transcription, data.transcription])
        setPrompt(data.transcription)
      })
  }

  const sendTextTranscription = () => {

    fetch("http://localhost:5001/gamev2/post/send_transcription", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        threadKey: threadKey,
        transcription: prompt,
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
            method: "GET",
            headers: {
              'Content-Type': 'application/json',
            }
          })
            .then(response => response.json())
            .then(data2 => {
              console.log("pending...")
              if (data2.status === "completed") {
                console.log('Completed');
                dataTmp = data2;
                setReady(true)
                clearInterval(interval);
              }
            });
        }, 1000);
      })
  }

  const generate_prompt = () => {
    fetch("http://localhost:5001/gamev2/post/generate_prompt", {
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
        console.log('Generate prompt');
        console.log(data);
      })
  }

  // generate prompt 
  // get 3 prompts
  // generate image for each prompt

  return (
    <main>
      <FullScreen />
      <h1>Voyageur</h1>
      <ul>
        <li>
          <CreateGame setThreadKey={setThreadKey} setGameId={setGameId} />
        </li>
        <li>
          <button onClick={updateConversation}>Update Conversation</button>
        </li>
        <li>
          <button disabled={!ready} onClick={getAnswer}>Get Answer</button>
        </li>
        <li>
          <button onClick={sendAnswer}>Send Answer</button>
        </li>
        <li>
          <button onClick={sendTextTranscription}>Send Text Transcription </button>
        </li>
        <li>
          <button onClick={generate_prompt}>Generate Prompt</button>
        </li>
        <li>
          <h3>Record</h3>
          <RecordingComponent onEnd={onSpeechEnd} />
        </li>
      </ul>
      <ul className={styles.transcription}>
        {
          transcription.map((item, index) => (
            <li key={index}>{item}</li>
          ))
        }
      </ul>
      {/* <GetImg prompt={prompt} gameId={gameId} /> */}
    </main>
  );
}