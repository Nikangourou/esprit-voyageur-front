import styles from "../addPlayer.module.scss";
import Button from "../../../button/button";
import { useContext, useEffect, useRef } from "react";
import { gsap } from "gsap";
import {
  addPlayer,
  removePlayer,
} from "../../../../store/reducers/playersReducer";
import { useDispatch, useSelector } from "react-redux";
import { SocketContext } from "../../../../context/socketContext";

export default function addBtn({ colorName, value }) {
  const { soundManager } = useContext(SocketContext);
  const players = useSelector((state) => state.players.players);
  const playersInGame = useSelector((state) => state.players.playersInGame);
  const dispatch = useDispatch();

  const blobRef = useRef();
  const tlXRef = useRef(null);
  const tlYRef = useRef(null);
  const tlAngleRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    gsap.set(blobRef.current, {
      x: randomY(-1),
      y: randomX(1),
      rotation: randomAngle(-1),
    });

    tlXRef.current = gsap.timeline();
    tlYRef.current = gsap.timeline();
    tlAngleRef.current = gsap.timeline();

    moveX(blobRef.current, 1);
    moveY(blobRef.current, -1);
    rotate(blobRef.current, -1);
  }, []);

  const handleTouchStart = (e) => {
    tlXRef.current?.pause();
    tlYRef.current?.pause();
    tlAngleRef.current?.pause();
    timerRef.current = setTimeout(() => {
      const colorName = e.target.getAttribute("data-color");
      let playerAlreadyAdded = playersInGame.includes(colorName);
      if (playerAlreadyAdded) {
        dispatch(removePlayer({ color: colorName }));
        gsap.to(e.target, {
          fill: "#1c1c1e",
        });
      } else {
        dispatch(addPlayer({ color: colorName }));
        gsap.to(e.target, {
          fill: players[colorName].color,
        });
      }
      soundManager.playSingleSound("pawn");
      tlXRef.current?.play();
      tlYRef.current?.play();
      tlAngleRef.current?.play();
    }, 1000);
  };

  const handleTouchEnd = () => {
    clearTimeout(timerRef.current);
  };

  function rotate(target, direction) {
    tlXRef.current.to(target, {
      duration: randomTime2(),
      rotation: randomAngle(direction),
      ease: "sine.inOut",
      onComplete: rotate,
      onCompleteParams: [target, direction * -1],
    });
  }

  function moveX(target, direction) {
    tlYRef.current.to(target, {
      duration: randomTime(),
      x: randomX(direction),
      ease: "sine.inOut",
      onComplete: moveX,
      onCompleteParams: [target, direction * -1],
    });
  }

  function moveY(target, direction) {
    tlAngleRef.current.to(target, {
      duration: randomTime(),
      y: randomY(direction),
      ease: "sine.inOut",
      onComplete: moveY,
      onCompleteParams: [target, direction * -1],
    });
  }

  function random(min, max) {
    const delta = max - min;
    return (direction = 1) => (min + delta * Math.random()) * direction;
  }

  function randomTime() {
    return random(2.5, 5)();
  }

  function randomTime2() {
    return random(2.5, 5)();
  }

  function randomAngle(direction) {
    return random(-180, 180)(direction);
  }

  function randomX(direction) {
    return random(0, 30)(direction);
  }

  function randomY(direction) {
    return random(0, 30)(direction);
  }

  const eventsFunctions = {
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
    onTouchCancel: handleTouchEnd,
    onMouseDown: handleTouchStart,
    onMouseUp: handleTouchEnd,
    onMouseLeave: handleTouchEnd,
  };

  return (
    <div className={styles.blob} key={colorName} ref={blobRef}>
      <Button
        type={"blob"}
        color={value.color}
        dataColor={colorName}
        events={eventsFunctions}
      ></Button>
    </div>
  );
}
