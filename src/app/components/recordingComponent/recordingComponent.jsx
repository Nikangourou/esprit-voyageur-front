import React, { useState, useEffect, useRef } from "react";
import styles from "./recording.module.scss";
import { div } from "three/nodes";
import ClipBlob from "../clipBlob/clipBlob";
import { useSelector } from "react-redux";
import { gsap } from "gsap";

const RecordingComponent = ({ onEnd, textAreaRef }) => {
  const players = useSelector((state) => state.players.players);
  const currentBluffer = useSelector((state) => state.players.currentBluffer);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorder = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]); 
  
  const colorStyle =
    currentBluffer && currentBluffer != ""
      ? players[currentBluffer].color
      : "#373FEF";

  useEffect(() => {
    // Initialize the media recorder when the component mounts
    initMediaRecorder();
  }, []);

  const initMediaRecorder = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error(
        "Media devices support is not available, (maybe you are not using https)"
      );
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      streamRef.current = stream;

      let newMediaRecorder;
      try {
        newMediaRecorder = new MediaRecorder(stream);
      } catch (error) {
        console.error("MediaRecorder initialization error:", error);
        return;
      }

      newMediaRecorder.ondataavailable = (e) => {
        console.log("Data available:", e.data);
        if (e.data.size > 0) {
          chunksRef.current.push(e.data); // Collect each chunk
        }
      };

      newMediaRecorder.onstart = () => {
        console.log("MediaRecorder started");
      };

      newMediaRecorder.onstop = () => {
        console.log("MediaRecorder stopped");
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        chunksRef.current = []; // Reset the chunks array for next record
        if (onEnd) {
          onEnd(blob);
        }
      };

      newMediaRecorder.onerror = (event) => {
        console.error("MediaRecorder error:", event.error);
      };

      mediaRecorder.current = newMediaRecorder;
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  const startRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === "inactive") {
      mediaRecorder.current.start(1000);
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    console.log("stopRecording");
    if (
      isRecording &&
      mediaRecorder.current &&
      mediaRecorder.current.state === "recording"
    ) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      textAreaRef.current.focus();
    }
  };

  const eventsFunctions = {
    onTouchStart: startRecording,
    onTouchEnd: stopRecording,
    onTouchCancel: stopRecording,
    onMouseDown: startRecording,
    onMouseUp: stopRecording,
    onMouseLeave: stopRecording,
  };

  return (
    <button className={styles.containerRecording} {...eventsFunctions}>
      <div className={`${styles.recording}`}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M39.9999 0C36.4637 0 33.0723 1.40476 30.5718 3.90524C28.0713 6.40573 26.6666 9.79711 26.6666 13.3333V40C26.6666 43.5362 28.0713 46.9276 30.5718 49.4281C33.0723 51.9286 36.4637 53.3333 39.9999 53.3333C43.5361 53.3333 46.9275 51.9286 49.428 49.4281C51.9285 46.9276 53.3333 43.5362 53.3333 40V13.3333C53.3333 9.79711 51.9285 6.40573 49.428 3.90524C46.9275 1.40476 43.5361 0 39.9999 0ZM35.2859 8.61929C36.5361 7.36905 38.2318 6.66667 39.9999 6.66667C41.768 6.66667 43.4637 7.36905 44.714 8.61929C45.9642 9.86953 46.6666 11.5652 46.6666 13.3333V40C46.6666 41.7681 45.9642 43.4638 44.714 44.714C43.4637 45.9643 41.768 46.6667 39.9999 46.6667C38.2318 46.6667 36.5361 45.9643 35.2859 44.714C34.0356 43.4638 33.3333 41.7681 33.3333 40V13.3333C33.3333 11.5652 34.0356 9.86953 35.2859 8.61929Z"
            fill={`${isRecording ? colorStyle : "#1c1c1e"}`}
            style={{ transition: "all 1s ease-out" }}
          />
          <path
            d="M19.9999 33.3333C19.9999 31.4924 18.5075 30 16.6666 30C14.8256 30 13.3333 31.4924 13.3333 33.3333V40C13.3333 47.0724 16.1428 53.8552 21.1437 58.8562C25.3525 63.0649 30.8233 65.7215 36.6666 66.4576V73.3333H26.6666C24.8256 73.3333 23.3333 74.8257 23.3333 76.6667C23.3333 78.5076 24.8256 80 26.6666 80H53.3333C55.1742 80 56.6666 78.5076 56.6666 76.6667C56.6666 74.8257 55.1742 73.3333 53.3333 73.3333H43.3333V66.4576C49.1766 65.7215 54.6473 63.0649 58.8561 58.8562C63.8571 53.8552 66.6666 47.0724 66.6666 40V33.3333C66.6666 31.4924 65.1742 30 63.3333 30C61.4923 30 59.9999 31.4924 59.9999 33.3333V40C59.9999 45.3043 57.8928 50.3914 54.1421 54.1421C50.3913 57.8929 45.3043 60 39.9999 60C34.6956 60 29.6085 57.8929 25.8578 54.1421C22.1071 50.3914 19.9999 45.3043 19.9999 40V33.3333Z"
            fill={`${isRecording ? colorStyle : "#1c1c1e"}`}
            style={{ transition: "all 1s ease-out" }}
          />
        </svg>
      </div>
      <div className={styles.clip}>
        <ClipBlob
          seed={10}
          numPoints={20}
          color={"#1c1c1e"}
          minDuration={0.5}
          maxDuration={1}
          width={150}
          height={150}
          maxRadius={50}
          minRadius={50}
          active={!isRecording}
          offset={10}
          // y={0.9}
        ></ClipBlob>
      </div>

      <div className={styles.clip}>
        <ClipBlob
          seed={32}
          numPoints={20}
          color={colorStyle}
          minDuration={0.5}
          maxDuration={1}
          width={150}
          height={150}
          maxRadius={50}
          minRadius={50}
          active={!isRecording}
          offset={10}
          // y={0.9}
        ></ClipBlob>
      </div>
    </button>
  );
};

export default RecordingComponent;
