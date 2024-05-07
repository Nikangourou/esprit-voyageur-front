"use client";

import React, {
  createContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { io } from "socket.io-client";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";

// Créez le contexte
const value = { socket: io("localhost:5001") };
const SocketContext = createContext(value);

// Créez le fournisseur de contexte
const SocketProvider = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [hasBeenDisconnected, setHasBeenDisconnected] = useState(false);

  function routeManagement(state, gameId) {
    console.log(gameId);
    switch (state) {
      case "SetBluffer":
        router.push(`/game/qrcode?gameId=${gameId}`);
        break;
      case "IntroductionPhone":
        if (pathname == "/game/qrcode") {
          router.push(`/game?gameId=${gameId}`);
        }
        break;
      case "Conversation":
        if (pathname == "/voyageur") {
          router.push(`/voyageur/chat?gameId=${gameId}`);
        } else {
          router.push(`/game?gameId=${gameId}`);
        }
        break;
      case "WinnerScreen":
        router.push(`/intro`);
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
        break;
      case "IntroductionPhone":
        if (!isMobile && pathname != "/voyageur") {
          router.push(`/game?gameId=${gameId}`);
        } else {
          router.push(`/voyageur?gameId=${gameId}`);
        }

        break;
      case "Conversation":
        if (pathname == "/voyageur" && isMobile) {
          router.push(`/voyageur/chat?gameId=${gameId}`);
        } else {
          router.push(`/game?gameId=${gameId}`);
        }
        break;
      case "RevealImage":
        if (isMobile) {
        } else {
          router.push(`/game?gameId=${gameId}&state=RevealImage`);
        }
        break;
      case "QuestionPhase":
        router.push(`/game?gameId=${gameId}&state=QuestionPhase`);
        break;
      case "VotePhase":
        router.push(`/game?gameId=${gameId}&state=VotePhase`);
        break;
      case "RevealPhase":
        router.push(`/game?gameId=${gameId}&state=RevealPhase`);
        break;
      case "ScorePhase":
        router.push(`/game?gameId=${gameId}&state=ScorePhase`);
        break;
      case "WinnerScreen":
        router.push(`/game/winner`);
        break;
      default:
        break;
    }
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

    return () => {
      value.socket.off("stateChanged", routeManagement);
      value.socket.off("backToState", backToRoute);
    };
  }, []);

  // État du thème
  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export { SocketContext, SocketProvider };
