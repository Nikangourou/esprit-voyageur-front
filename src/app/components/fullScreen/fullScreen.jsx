"use client";

import { useEffect, useState } from "react";
import styles from "./fullScreen.module.scss";

export default function FullScreen () {

    const setFullScreen = () => {
        document.documentElement.requestFullscreen();
    }


    return (
        <div>
           <img src="/full-screen.png" onClick={setFullScreen} alt="full screen icon" />
        </div>
    );
}