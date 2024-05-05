"use client";

import React, {
  createContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { io } from "socket.io-client";
import { useRouter } from "next/navigation";

// Créez le contexte
const value = { socket: io("localhost:5001") };
const SocketContext = createContext(value);

// Créez le fournisseur de contexte
const SocketProvider = ({ children }) => {
  const router = useRouter();

  // function routeManagement(state) {
  //   switch (state){
  //     case "SetBluffer":
  //       router.pus
  //   }
  // }

  useEffect(() => {
    // value.on("stateChanged");
  }, []);

  // État du thème
  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export { SocketContext, SocketProvider };
