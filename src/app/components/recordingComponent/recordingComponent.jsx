import React, { useState, useEffect, useRef } from "react";
import styles from "./recording.module.scss";

const RecordingComponent = ({ onEnd }) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorder = useRef(null);

  const initMediaRecorder = async () => {

    console.log(navigator);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error("Media devices support is not available, (maybe you are not using https)");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      const newMediaRecorder = new MediaRecorder(stream);
      newMediaRecorder.ondataavailable = handleDataAvailable;
      newMediaRecorder.onstop = () => {
        setIsRecording(false);
        // stream.getTracks().forEach((track) => track.stop());
      };
      newMediaRecorder.onerror = (event) =>
        console.error("MediaRecorder error:", event.error);
      mediaRecorder.current = newMediaRecorder;
      startRecording();
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  const handleDataAvailable = (e) => {
    if (e.data.size > 0 && onEnd) {
      onEnd(e.data);
    }
  };

  const startRecording = () => {
    // Initialize the MediaRecorder if it hasn't been initialized yet
    if (!mediaRecorder.current) {
      initMediaRecorder(); 
      return; 
    }

    if (mediaRecorder.current && mediaRecorder.current.state === "inactive") {
      mediaRecorder.current.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
      mediaRecorder.current.stop();
    }
  };

  return (
    <div
      onClick={isRecording ? stopRecording : startRecording}
      className={`${styles.recording} ${
        isRecording ? styles.recordingActive : ""
      }`}
    />
  );
};

export default RecordingComponent;
