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
          router.push("/game");
        }
        break;
      case "WinnerScreen":
        router.push(`/intro`);
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    value.socket.on("stateChanged", routeManagement);
    return () => {
      value.socket.off("stateChanged", routeManagement);
    };
  }, []);

  // État du thème
  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export { SocketContext, SocketProvider };
