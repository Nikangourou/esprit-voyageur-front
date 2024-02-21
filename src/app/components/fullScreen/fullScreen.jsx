"use client";

import { useEffect, useState } from "react";
import styles from "./fullScreen.module.scss";

export default function FullScreen () {

    const setFullScreen = () => {
        document.documentElement.requestFullscreen();
    }


    return (
        <div>
            <p onClick={setFullScreen}>LOGO</p>
        </div>
    );
}