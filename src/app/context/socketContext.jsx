"use client";

import React, { createContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { gsap } from "gsap";
import {
  newGame,
  setCurrentBluffer,
  setScore,
} from "../store/reducers/playersReducer";
import {
  setDistanceCircle,
  setOffset,
  setShaderPosition,
  incrementManche,
  resetAllGame,
} from "../store/reducers/gameReducer";
import SoundManager from "../soundManager";
import { setShowFooter } from "../store/reducers/footerReducer";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// Créez le contexte
const value = {
  socket: io(apiUrl),
  soundManager: new SoundManager(),
};
const SocketContext = createContext(value);

// Créez le fournisseur de contexte
const SocketProvider = ({ children }) => {
  const [shouldResetGame, setShouldResetGame] = useState(false);
  const gameIdStored = useSelector((state) => state.players.gameId);
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const path = useRef();
  const materialLoaderRef = useRef();
  const tlLoading = useRef();

  useEffect(() => {
    window.addEventListener("popstate", () => {
      console.log("Retour à la page précédente");
      setShouldResetGame(true);

      // Effectuer l'action souhaitée
    });
  }, []);

  useEffect(() => {
    if (shouldResetGame) {
      router.push(`/`);
      setShouldResetGame(false);
      dispatch(resetAllGame());
      dispatch(newGame());
      dispatch(setShowFooter(false));
      gsap.to(".footerBg", { opacity: 0 });
    }
  }, [shouldResetGame]);

  useEffect(() => {
    path.current = pathname;
    if (
      pathname != "/" &&
      pathname != `/game/qrcode` &&
      pathname != "/voyageur" &&
      pathname != "/voyageur/chat/images"
    ) {
      console.log(pathname);
      gsap.fromTo(
        ".pageContainer",
        {
          opacity: 0,
        },
        {
          opacity: 1,
          delay: 1.5,
          duration: 2,
          pointerEvents: "auto",
          ease: "power1.out",
        },
      );
    }
  }, [pathname]);

  function routeManagement(state, gameId) {
    console.log(gameId);
    switch (state) {
      case "SetBluffer":
        incrementStep();
        router.push(`/game/qrcode?gameId=${gameId}`);
        break;
      case "Conversation":
        if (path.current == "/voyageur") {
          router.push(`/voyageur/chat?gameId=${gameId}`);
          dispatch(setDistanceCircle([0.1, 0.1]));
          // dispatch(setOffset(0.115));
        } else {
          router.push(`/game?gameId=${gameId}`);
          const tl = gsap
            .timeline()
            .to(".pageContainer", {
              opacity: 0,
              duration: 1.5,
              ease: "power2.out",
              onComplete: () => {
                dispatch(setDistanceCircle([0.45, 0.45]));
                dispatch(setShaderPosition(0.09));
              },
            })
            .to(
              ".footerBg",
              {
                opacity: 0,
                duration: 1.5,
                ease: "power2.out",
              },
              "<",
            )
            .to(
              ".header",
              {
                pointerEvents: "none",
                opacity: 0,
                duration: 1.5,
                ease: "power2.out",
              },
              "<",
            )
            .to(".pageContainer", {
              opacity: 1,
              duration: 1.5,
              delay: 2,
              ease: "power2.out",
              onComplete: () => {
                tlLoading.current = gsap
                  .timeline()
                  .to(materialLoaderRef.current.uniforms.uProgress, {
                    value: 0.25,
                    duration: 300,
                    ease: "linear",
                  });
              },
            });
        }
        break;
      case "RevealImage":
        if (path.current == `/game?gameId=${gameId}`) {
          tlLoading.current?.kill();
        }
        break;
      case "scorePhase":
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
        if (!isMobile && path.current != "/voyageur") {
          router.push(`/game?gameId=${gameId}`);
          dispatch(setDistanceCircle([0.1, 0.1]));
        } else {
          router.push(`/voyageur?gameId=${gameId}`);
          dispatch(setDistanceCircle([0.1, 0.65]));
        }

        break;
      case "Conversation":
        if (path.current == "/voyageur" && isMobile) {
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

  function incrementStep() {
    dispatch(incrementManche());
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
    <SocketContext.Provider
      value={{
        setShouldResetGame: setShouldResetGame,
        materialLoaderRef: materialLoaderRef,
        ...value,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { SocketContext, SocketProvider };
