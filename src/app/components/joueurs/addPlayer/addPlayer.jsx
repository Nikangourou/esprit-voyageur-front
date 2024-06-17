import styles from "./addPlayer.module.scss";
import { useSelector, useDispatch } from "react-redux";
import { addPlayer } from "../../../store/reducers/playersReducer";
import { useContext, useEffect, useRef, useState } from "react";
import Button from "../../button/button";
import { gsap } from "gsap";
import Link from "next/link";
import Blob from "../../blob/blob";
import { SocketContext } from "../../../context/socketContext";

export default function AddPlayer() {
  const { soundManager } = useContext(SocketContext);
  const players = useSelector((state) => state.players.players);
  const timerRef = useRef(null);
  const containerRef = useRef(null);
  const dispatch = useDispatch();
  let anglesArr = [];
  const [blobs, setBlobs] = useState([]);

  const handleTouchStart = (e) => {
    timerRef.current = setTimeout(() => {
      const colorName = e.target.getAttribute("data-color");
      dispatch(addPlayer({ color: colorName }));
      gsap.to(e.target, {
        fill: players[colorName].color,
      });
      soundManager.playSingleSound("pawn");
    }, 1000);
  };

  const handleTouchEnd = () => {
    clearTimeout(timerRef.current);
  };

  const eventsFunctions = {
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
    onTouchCancel: handleTouchEnd,
    onMouseDown: handleTouchStart,
    onMouseUp: handleTouchEnd,
    onMouseLeave: handleTouchEnd,
  };

  const pawns = [
    {
      color: "#913DF3",
      value: [49.375, 62.628, 67.995],
      top: 0,
      left: 0,
    },
    {
      color: "#FC554F",
      value: [45.645, 55.992, 78.362],
      top: 0,
      left: 0,
    },
  ];

  const sort = (arr) => {
    let res = arr.sort((a, b) => a - b);
    return res;
  };

  const average = (arr) => {
    if (arr.length === 0) {
      return [0, 0, 0];
    }

    let sum = [0, 0, 0];

    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < 3; j++) {
        sum[j] += arr[i][j];
      }
    }

    for (let i = 0; i < 3; i++) {
      sum[i] = sum[i] / arr.length;
    }

    return sum;
  };

  const getPawn = (arr) => {
    let min = 50;
    let pawn = {};
    for (let i = 0; i < pawns.length; i++) {
      let diff = 0;
      for (let j = 0; j < 3; j++) {
        diff += Math.abs(arr[j] - pawns[i].value[j]);
      }
      if (diff < min) {
        min = diff;
        pawn = pawns[i];
      }
    }
    return pawn;
  };

  const onTouchMove = (e) => {
    let nbTouches = e.touches.length;
    let angle = [0, 0, 0];

    if (nbTouches === 3) {
      let touch1 = e.touches[0];
      let touch2 = e.touches[1];
      let touch3 = e.touches[2];
      let x1 = touch1.clientX;
      let y1 = touch1.clientY;
      let x2 = touch2.clientX;
      let y2 = touch2.clientY;
      let x3 = touch3.clientX;
      let y3 = touch3.clientY;
      let a = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
      let b = Math.sqrt(Math.pow(x3 - x2, 2) + Math.pow(y3 - y2, 2));
      let c = Math.sqrt(Math.pow(x3 - x1, 2) + Math.pow(y3 - y1, 2));
      let cosA =
        (Math.pow(b, 2) + Math.pow(c, 2) - Math.pow(a, 2)) / (2 * b * c);
      let cosB =
        (Math.pow(a, 2) + Math.pow(c, 2) - Math.pow(b, 2)) / (2 * a * c);
      let cosC =
        (Math.pow(a, 2) + Math.pow(b, 2) - Math.pow(c, 2)) / (2 * a * b);
      angle[0] = (Math.acos(cosA) * 180) / Math.PI;
      angle[1] = (Math.acos(cosB) * 180) / Math.PI;
      angle[2] = (Math.acos(cosC) * 180) / Math.PI;

      anglesArr.push(sort(angle));
      console.log(sort(angle));

      let av1 = average(anglesArr);
      let pawn = getPawn(av1);
      let lastPawn = null;
      if (pawn && pawn.color !== lastPawn?.color) {
        anglesArr = [];
        // get e.touche 0 1 2 center
        let pawnCenterX =
          e.touches[0].clientX + e.touches[1].clientX + e.touches[2].clientX;
        let pawnCenterY =
          e.touches[0].clientY + e.touches[1].clientY + e.touches[2].clientY;

        pawn.top = pawnCenterY / 3 - 100;
        pawn.left = pawnCenterX / 3 - 100;
        // add if pawn.color doesn't exist in blobs else update
        let blob = blobs.find((b) => b.color === pawn.color);
        if (blob) {
          blob.top = pawn.top;
          blob.left = pawn.left;
          setBlobs([...blobs]);
        } else {
          setBlobs([...blobs, pawn]);
        }
        lastPawn = pawn;
      }
    }
  };

  return (
    <section
      className={styles.addingPlayer}
      // style={{ height: "auto" }} // temporaire
      ref={containerRef}
      onTouchMove={onTouchMove}
    >
      {Object.entries(players).map(([colorName, value], index) => {
        return (
          <div
            className={styles.blob}
            key={colorName}
            // style={{ top: blob.top, left: blob.left }}
          >
            <Button
              type={"blob"}
              color={value.color}
              dataColor={colorName}
              events={eventsFunctions}
            ></Button>
          </div>
        );
      })}
    </section>
  );
}
