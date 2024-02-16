"use client"

import React, { useState, useEffect } from 'react';

const RecordingComponent = ({ onEnd }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  const enableRecording = () => {
    // Demander l'autorisation de l'utilisateur pour utiliser le micro
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          const newMediaRecorder = new MediaRecorder(stream);
          setMediaRecorder(newMediaRecorder);
        });
  }

  const startRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.start();
      setIsRecording(true);
    } else {
      console.error('No media recorder available');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  useEffect(() => {
    if (mediaRecorder) {
      // Lorsque l'enregistrement est arrêté, créer un blob audio et le passer à onEnd
      const handleDataAvailable = e => {
        if (e.data.size > 0 && onEnd) {
          onEnd(e.data);
        }
      };

      mediaRecorder.ondataavailable = handleDataAvailable;
      mediaRecorder.onstop = stopRecording;

      return () => {
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
      };
    }
  }, [mediaRecorder, onEnd]);

  return (
    <div>
     <button onClick={enableRecording}>lancer</button>
      <button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
    </div>
  );
};

export default RecordingComponent;