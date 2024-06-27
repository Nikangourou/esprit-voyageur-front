"use client";

import { useContext, useState, useEffect, useRef } from "react";
import styles from "./header.module.scss";
import FullScreen from "./fullScreen/fullScreen";
import Menu from "./menu/menu";
import { SocketContext } from "../../context/socketContext";
import { setCountDownPause } from "../../store/reducers/gameReducer";
import { useDispatch } from "react-redux";
import ProgressBar from "./progressBar/progressBar";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";

export default function Header({}) {
  const { soundManager } = useContext(SocketContext);
  const [isMuted, setIsMuted] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [isProgressBar, setIsProgressBar] = useState(false);
  const [inVoyageur, setInVoyageur] = useState(false);
  const dispatch = useDispatch();
  const pathname = usePathname();
  const headerRef = useRef();

  useEffect(() => {
    if (openMenu) {
      dispatch(setCountDownPause(true));
    } else {
      dispatch(setCountDownPause(false));
    }
  }, [openMenu]);

  useEffect(() => {
    if (pathname.includes("/game")) {
      gsap.to(`.${styles.containerLeft}`, {
        opacity: 1,
        duration: 1,
        ease: "power2.out",
        onComplete: () => {
          setIsProgressBar(true);
        },
      });
    } else {
      gsap.to(`.${styles.containerLeft}`, {
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        onComplete: () => {
          setIsProgressBar(false);
        },
      });
    }

    if (pathname.includes("voyageur") || pathname == "/") {
      setInVoyageur(true);
    } else {
      setInVoyageur(false);
    }
  }, [pathname]);

  useEffect(() => {
    if (!inVoyageur) {
      gsap.to(headerRef.current, {
        opacity: 1,
        pointerEvents: "auto",
        duration: 1,
        ease: "power2.out",
      });
    }
  }, [inVoyageur]);

  const toggleMute = () => {
    if (soundManager) {
      soundManager.toggleSound(
        () => setIsMuted(true),
        () => setIsMuted(false),
      );
    }
  };

  return inVoyageur ? (
    <></>
  ) : (
    <>
      {openMenu && <Menu openMenu={openMenu} setOpenMenu={setOpenMenu} />}
      <div className={`header`} ref={headerRef}>
        <div className={styles.containerLeft}>
          {isProgressBar && <ProgressBar />}
        </div>
        <div className={styles.containerRight}>
          <div onClick={() => setOpenMenu(true)}>
            <img src="/images/Pause.svg" alt="logo" />
          </div>
          <div onClick={toggleMute} className={styles.imgSoundContainer}>
            <img
              src={isMuted ? "/images/soundMute.svg" : "/images/sound.svg"}
              alt="logo"
            />
          </div>
          <FullScreen />
        </div>
      </div>
    </>
  );
}
