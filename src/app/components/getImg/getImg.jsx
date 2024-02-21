"use client";

import { useEffect, useState } from "react";
import styles from "./getImg.module.scss";

export default function GetImg({ prompt, gameId }) {

    const [img64, setImg64] = useState(null);

    useEffect(() => {
        if (gameId) {
            console.log('Prompt:', prompt);
            fetch('http://localhost:5001/image/post/create', {
            // fetch('https://espritvoyageur-production.up.railway.app/image/post/create', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: prompt,
                    game_id: gameId
                })
            })
                .then(response => response.json())
                .then(data => {
                    setImg64(data.base64);
                });
        }
    }, [prompt])

    return (
        <main>
            <h3>GetImg</h3>
            <img className={styles.img} src={`data:image/png;base64,${img64}`} style={{width:"350px"}} />
        </main>
    );
}
