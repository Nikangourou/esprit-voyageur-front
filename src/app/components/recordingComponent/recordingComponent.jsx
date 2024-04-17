import React, { useState, useEffect, useRef } from "react";
import styles from "./recording.module.scss";

const RecordingComponent = ({ onEnd }) => {
  const [isRecording, setIsRecording] = useState(false);
  // const [mediaRecorder, setMediaRecorder] = useState(null);

  const mediaRecorder = useRef(null);

  const initMediaRecorder = async () => {
    if (
      !mediaRecorder.current &&
      navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia
    ) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const newMediaRecorder = new MediaRecorder(stream);
        newMediaRecorder.ondataavailable = handleDataAvailable;
        newMediaRecorder.onstop = () => setIsRecording(false);
        newMediaRecorder.onerror = (event) =>
          console.error("MediaRecorder error:", event.error);

        // setMediaRecorder(newMediaRecorder);
        mediaRecorder.current = newMediaRecorder;
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    }
  };

  useEffect(() => {
    initMediaRecorder();
  }, []);

  const handleDataAvailable = (e) => {
    if (e.data.size > 0 && onEnd) {
      onEnd(e.data);
    }
  };

  const startRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === "inactive") {
      mediaRecorder.current.start();
      setIsRecording(true);
    } else {
      console.error("MediaRecorder not initialized or already recording");
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
