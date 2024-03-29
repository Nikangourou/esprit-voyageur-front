"use client";

import { useEffect, useState } from "react";
import styles from "./getImg.module.scss";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function GetImg({ prompt, gameId }) {

    const [url, setUrl] = useState(null);

    useEffect(() => {
        if (gameId) {
            fetch(`${apiUrl}/image/post/create`, {
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
                    setUrl(data.url);
                });
        }
    }, [prompt])

    return (
            <img className={styles.img} src={url} alt="image" />
    );
}
