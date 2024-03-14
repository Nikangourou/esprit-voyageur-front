"use client" // This directive is unusual and typically not standard JavaScript or React. Make sure it is necessary for your project.

import { useEffect, useState } from "react";
import RecordingComponent from "../components/recordingComponent/recordingComponent";
import GetImg from "../components/getImg/getImg";
import styles from "./page.module.scss";
import Chat from "../components/chat/chat";
import { v4 as uuidv4 } from 'uuid';



export default function Voyageur() {
  const [ready, setReady] = useState(false)
  const [generateImages, setGenerateImages] = useState(false)
  const [prompts, setPrompts] = useState([])

  // get threadKey from the URL
  if (typeof window === 'undefined') {
    return <h1>Server side rendering</h1>
  }
  const urlParams = new URLSearchParams(window.location.search);
  const threadKey = urlParams.get('threadKey');

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
          <button onClick={generate_prompt_simple}>Generate Prompt Simple</button>
        </li>
        <li>
          <button onClick={generate_prompt_alt}>Generate Prompt alternate</button>
        </li>
      </ul>
      <Chat />
      {/* {prompts.map((promptSorted) =>
        <GetImg prompt={promptSorted} gameId={gameId} />
      )} */}
    </main>
  );
}