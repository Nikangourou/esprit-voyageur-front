"use client" // This directive is unusual and typically not standard JavaScript or React. Make sure it is necessary for your project.

import {useEffect,useState} from "react";
import RecordingComponent from "../components/recordingComponent/recordingComponent";
import * as utils from "../utils/micro";

export default function Voyageur() {
  const [threadKey, setThreadKey] = useState(null)
  const [base64,setBase64] = useState(null)

  useEffect(() => {
    if(!threadKey){
      fetch('http://localhost:5000/game/post/create', {
        method: 'POST',
      })
          .then(response => response.json())
          .then(data => {
            console.log('Game setup:', data.thread_id.key);
            setThreadKey(data.thread_id.key)
          });
    }
  },[])

  useEffect(() => {
    if(base64){
      fetch("http://localhost:5000/game/update/audio", {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          threadId: threadKey,
          audioData: base64,
          field: "context"
        })
      })
          .then(response => response.json())
          .then(data => {
            console.log('Audio Update:', data);
          })
    }
  },[base64])

  function base64Reformat(base64){
    console.log(utils.arrayBufferToBase64(base64));

    const to_remove = "data:audio/webm;codecs=opus;base64,";
    return utils.arrayBufferToBase64(base64).replace(to_remove,"");
  }

  const onSpeechEnd = (audio) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(audio);
    reader.onload = () => {
      const buffer = base64Reformat(reader.result);
      setBase64(buffer)
      console.log('Fichier converti en base64 :', buffer);
    };
  }

  return (
    <main>
      <h1>voyageur</h1>
      <RecordingComponent onEnd={onSpeechEnd} />
    </main>
  );
}