"use client";

import { useContext, useState, useEffect } from "react";
import styles from "./header.module.scss";
import FullScreen from "./fullScreen/fullScreen";
import Menu from "./menu/menu";
import { SocketContext } from "../../context/socketContext";
import { setCountDownPause } from "../../store/reducers/gameReducer";
import { useDispatch } from "react-redux";
import ProgressBar from "./progressBar/progressBar";

export default function Header({ isProgressBar = false }) {
  const { soundManager } = useContext(SocketContext);
  const [isMuted, setIsMuted] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (openMenu) {
      dispatch(setCountDownPause(true));
    } else {
      dispatch(setCountDownPause(false));
    }
  }, [openMenu]);

  const toggleMute = () => {
    if (soundManager) {
      soundManager.toggleSound(
        () => setIsMuted(true),
        () => setIsMuted(false)
      );
    }
  };

  return (
    <>
      {openMenu && <Menu openMenu={openMenu} setOpenMenu={setOpenMenu} />}
      <div className={styles.header}>
        <div className={styles.containerLeft}>
          {isProgressBar && <ProgressBar/>}
        </div>
        <div className={styles.containerRight}>
          <div onClick={() => setOpenMenu(true)}>
            <img src="/images/Pause.svg" alt="logo" />
          </div>
          <div onClick={toggleMute} className={styles.imgSoundContainer} >
            <img  src={isMuted ? "/images/soundMute.svg" : "/images/sound.svg"} alt="logo" />
          </div>
          <FullScreen />
        </div>
      </div>
    </>
  );
}
