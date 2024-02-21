"use client";

import { useEffect, useState } from "react";

export default function CreateGame({ setThreadKey, setGameId }) {

    const createGame = () => {
        fetch('http://10.137.102.132:5001/gamev2/post/create', {
            method: 'POST',
        })
            .then(response => response.json())
            .then(data => {
                console.log('Create Game');
                console.log(data);
                setThreadKey(data.thread_id.key)
                setGameId(data._id)
            });
    }

    return (
        <main>
            <button onClick={createGame}>Create Game</button>
        </main>
    );
}
