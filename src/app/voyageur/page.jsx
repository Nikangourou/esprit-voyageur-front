"use client" // This directive is unusual and typically not standard JavaScript or React. Make sure it is necessary for your project.

import { useEffect, useState } from "react";
import RecordingComponent from "../components/recordingComponent/recordingComponent";
import GetImg from "../components/getImg/getImg";
import styles from "./page.module.scss";
import Chat from "../components/chat/chat";

export default function Voyageur() {
  const [prompt, setPrompt] = useState("")
  const [transcription, setTranscription] = useState([])
  const [ready, setReady] = useState(false)
  const [generateImages, setGenerateImages] = useState(false)
  const [prompts, setPrompts] = useState([])
  
  // get threadKey from the URL
  if (typeof window === 'undefined') {
    return <h1>Server side rendering</h1>
  }
  const urlParams = new URLSearchParams(window.location.search);
  const threadKey = urlParams.get('threadKey');

  useEffect(() => {
    if (threadKey) {
      fetch("http://localhost:5001/gamev2/update/conversation", {
        // fetch("https://espritvoyageur-production.up.railway.app/gamev2/update/conversation", {
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
              // fetch(`https://espritvoyageur-production.up.railway.app/run/get/${data.id}/${threadKey}`, {
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
  }, [])

  // useEffect(() => {
  //   if (ready && threadKey) {
  //     console.log("plop")
  //     getAnswer()
  //   }
  // }, [ready])

  const updateConversation = () => {
    fetch("http://localhost:5001/gamev2/update/conversation", {
      // fetch("https://espritvoyageur-production.up.railway.app/gamev2/update/conversation", {
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
            // fetch(`https://espritvoyageur-production.up.railway.app/run/get/${data.id}/${threadKey}`, {
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
      // fetch(`https://espritvoyageur-production.up.railway.app/run/answers/${threadKey}`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log('Get:', data, data[0][0].text.value);
        setTranscription(transcription => [...transcription, data[0][0].text.value])
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

  const sendTextTranscription = () => {

    fetch("http://localhost:5001/gamev2/post/send_transcription", {
      // fetch("https://espritvoyageur-production.up.railway.app:5001/gamev2/post/send_transcription", {
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
            // fetch(`https://espritvoyageur-production.up.railway.app/run/get/${data.id}/${threadKey}`, {
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

  const generate_prompt_simple = () => {
    fetch("http://localhost:5001/gamev2/post/generate_prompt_simple", {
      // fetch("https://espritvoyageur-production.up.railway.app/gamev2/post/generate_prompt_simple", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        threadKey: threadKey,
        prompt: prompt
      })
    })
      .then(response => response.json())
      .then(data => {
        console.log('Generate prompt');
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
                setGenerateImages(true)
                clearInterval(interval);
              }
            });
        }, 1000);
      })
  }

  const generate_prompt_alt = () => {
    fetch("http://localhost:5001/gamev2/post/generate_prompt_alt", {
      // fetch("https://espritvoyageur-production.up.railway.app/gamev2/post/generate_prompt_alt", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        threadKey: threadKey,
        prompt: prompt

      })
    })
      .then(response => response.json())
      .then(data => {
        console.log('Generate prompt');
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
              console.log("pending...")
              if (data2.status === "completed") {
                console.log('Completed');
                dataTmp = data2;
                setReady(true)
                setGenerateImages(true)
                clearInterval(interval);
              }
            });
        }, 1000);
      })
  }

  function extractTextBetweenQuotes(text) {
    const regex = /"([^"]*)"/;
    const match = text.match(regex);

    if (match && match.length > 1) {
      return match[1];
    } else {
      return null;
    }
  }

  // generate prompt
  // get 3 prompts
  // generate image for each prompt

  return (
    <main>
      <h1>Voyageur</h1>
      <ul>
        <li>
          <button onClick={updateConversation}>Update Conversation</button>
        </li>
        {/*<li>*/}
        {/*  <button disabled={!ready} onClick={getAnswer}>Get Answer</button>*/}
        {/*</li>*/}
        <li>
          <button onClick={generate_prompt_simple}>Generate Prompt Simple</button>
        </li>
        <li>
          <button onClick={generate_prompt_alt}>Generate Prompt alternate</button>
        </li>
        <li>
          <button onClick={sendTextTranscription}>Send Text Transcription </button>
        </li>
      </ul>
      <Chat messages={transcription} />
      {/* {prompts.map((promptSorted) =>
        <GetImg prompt={promptSorted} gameId={gameId} />
      )} */}
    </main>
  );
}