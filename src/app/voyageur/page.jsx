"use client" // This directive is unusual and typically not standard JavaScript or React. Make sure it is necessary for your project.

import RecordingComponent from "../components/recordingComponent/recordingComponent";
import * as utils from "../utils/micro";

export default function Voyageur() {
  const onSpeechEnd = (audio) => {
    const wavBuffer = utils.encodeWAV(audio);
    const base64 = utils.arrayBufferToBase64(wavBuffer);
    // const audioUrlAsData = `${base64}`;

    function base64Reformat(base64){
      console.log(base64);
      const to_remove = "data:audio/webm;codecs=opus;base64,";
      return base64.replace(to_remove,"");
    }

    // First fetch request to set up the game
    fetch('http://localhost:5001/game/post/create', {
      method: 'POST',
    })
      .then(response => response.json())
      .then(data => {
        console.log('Game setup:', data);
        let threadKey = data.thread_id.key
        return fetch("http://localhost:5001/game/update/audio", {
          method: "PUT",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            threadId: threadKey,
            audioData: base64Reformat(base64),
            field: "context"
          })
        });
      })
      .then(response => response.json())
      .then(data => {
        console.log('Audio Update:', data);
      })
      .catch(error => {
        console.error('Fetch error:', error);
      });
  }

  return (
    <main>
      <h1>voyageur</h1>
      <RecordingComponent onEnd={onSpeechEnd} />
    </main>
  );
}