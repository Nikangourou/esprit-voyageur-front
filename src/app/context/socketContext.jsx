"use client";

import React, { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  newGame,
  setCurrentBluffer,
  setScore,
} from "../store/reducers/playersReducer";
import {
  setDistanceCircle,
  setOffset,
  setShaderPosition,
} from "../store/reducers/gameReducer";

// Créez le contexte
const value = { socket: io("localhost:5001") };
const SocketContext = createContext(value);

// Créez le fournisseur de contexte
const SocketProvider = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const [hasBeenDisconnected, setHasBeenDisconnected] = useState(false);

  function routeManagement(state, gameId) {
    console.log(gameId);
    switch (state) {
      case "SetBluffer":
        router.push(`/game/qrcode?gameId=${gameId}`);
        dispatch(setDistanceCircle([0.1, 0.1]));
        break;
      case "IntroductionPhone":
        if (pathname == "/game/qrcode") {
          router.push(`/game?gameId=${gameId}`);
          dispatch(setDistanceCircle([0.1, 0.1]));
        }
        break;
      case "Conversation":
        if (pathname == "/voyageur") {
          router.push(`/voyageur/chat?gameId=${gameId}`);
          dispatch(setDistanceCircle([0.4, 0.65]));
          dispatch(setOffset(0.115));
        } else {
          router.push(`/game?gameId=${gameId}`);
          console.log("Conversation");
          dispatch(setDistanceCircle([0.65, 0.65]));
          dispatch(setShaderPosition(0));
          setTimeout(() => {
            dispatch(setShaderPosition(1));
          }, 2000);
        }
        break;
      case "WinnerScreen":
        router.push(`/game/qrcode?gameId=${gameId}`);
        dispatch(setDistanceCircle([0.1, 0.1]));
        break;
      default:
        break;
    }
  }

  function backToRoute(state) {
    let gameId = localStorage.getItem("gameId");
    let isMobile = localStorage.getItem("isMobile");
    switch (state) {
      case "SetBluffer":
        router.push(`/game/qrcode?gameId=${gameId}`);
        dispatch(setDistanceCircle([0.1, 0.1]));
        break;
      case "IntroductionPhone":
        if (!isMobile && pathname != "/voyageur") {
          router.push(`/game?gameId=${gameId}`);
          dispatch(setDistanceCircle([0.1, 0.1]));
        } else {
          router.push(`/voyageur?gameId=${gameId}`);
          dispatch(setDistanceCircle([0.1, 0.65]));
        }

        break;
      case "Conversation":
        if (pathname == "/voyageur" && isMobile) {
          router.push(`/voyageur/chat?gameId=${gameId}`);
          dispatch(setDistanceCircle([0.1, 0.1]));
        } else {
          router.push(`/game?gameId=${gameId}`);
          dispatch(setDistanceCircle([0.65, 0.65]));
        }
        break;
      case "RevealImage":
        if (isMobile) {
          router.push(`/game?gameId=${gameId}&state=RevealImage`);
          dispatch(setDistanceCircle([0.1, 0.65]));
        } else {
          router.push(`/game?gameId=${gameId}&state=RevealImage`);
        }
        break;
      case "QuestionPhase":
        router.push(`/game?gameId=${gameId}&state=QuestionPhase`);
        dispatch(setDistanceCircle([0.1, 0.1]));
        break;
      case "VotePhase":
        router.push(`/game?gameId=${gameId}&state=VotePhase`);
        dispatch(setDistanceCircle([0.1, 0.1]));
        break;
      case "RevealPhase":
        router.push(`/game?gameId=${gameId}&state=RevealPhase`);
        dispatch(setDistanceCircle([0.1, 0.1]));
        break;
      case "ScorePhase":
        router.push(`/game?gameId=${gameId}&state=ScorePhase`);
        dispatch(setDistanceCircle([0.1, 0.1]));
        break;
      case "WinnerScreen":
        router.push(`/game/winner`);
        dispatch(setDistanceCircle([0.1, 0.1]));
        break;
      default:
        break;
    }
  }

  function setBluffer(bluffer) {
    console.log("bluffer initialized: " + bluffer);
    dispatch(setCurrentBluffer({ CurrentBluffer: bluffer }));
  }

  function setPlayersScore(players) {
    dispatch(setScore({ Players: players }));
  }

  function resetGame() {
    dispatch(newGame());
  }

  useEffect(() => {
    let storageGameId = localStorage.getItem("gameId");
    let isMobile = localStorage.getItem("isMobile");

    // if (storageGameId) {
    //   console.log("reconnection", storageGameId);
    //   value.socket.emit("reconnection", storageGameId, isMobile);
    // }
    //
    // window.addEventListener("online", () => {
    //   if (hasBeenDisconnected) {
    //     console.log("reconnection");
    //     storageGameId = localStorage.getItem("gameId");
    //     isMobile = localStorage.getItem("isMobile");
    //     value.socket.emit("reconnection", storageGameId, isMobile);
    //   }
    // });
    //
    // window.addEventListener("offline", () => {
    //   setHasBeenDisconnected(true);
    // });

    value.socket.on("stateChanged", routeManagement);
    value.socket.on("backToState", backToRoute);

    value.socket.on("setCurrentBluffer", setBluffer);
    value.socket.on("setScore", setPlayersScore);
    value.socket.on("resetAll", resetGame);

    return () => {
      value.socket.off("stateChanged", routeManagement);
      value.socket.off("backToState", backToRoute);
      value.socket.off("setCurrentBluffer", setBluffer);
      value.socket.off("setScore", setPlayersScore);
      value.socket.off("resetAll", resetGame);
    };
  }, []);

  // État du thème
  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export { SocketContext, SocketProvider };
