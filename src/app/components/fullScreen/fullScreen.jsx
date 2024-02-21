"use client";

import { useEffect, useState } from "react";
import styles from "./fullScreen.module.scss";

export default function FullScreen () {

    const handleFullScreen = () => {
        const elem = document.documentElement;
        if (!document.fullscreenElement) {
            elem.requestFullscreen().catch(err => {
                alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        } else {
            document.exitFullscreen();
        }
    }
    
    return (
        <div className={styles.btn} onClick={handleFullScreen}>
           <img src="/full-screen.png"  alt="full screen icon" />
        </div>
    );
}