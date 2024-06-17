"use client"; // This directive is unusual and typically not standard JavaScript or React. Make sure it is necessary for your project.

import { useState } from "react";
import styles from "./prompt.module.scss";
import ImageShader from "../components/imageShader/ImageShader";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function Prompt() {
  const [input, setInput] = useState("");
  const [url, setUrl] = useState(null);

  function createImg() {
    fetch(`${apiUrl}/image/post/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: input,
        isTrue: true,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setUrl(data.url);
        console.log(data.url);
      });
  }

  return (
    <>
      <textarea
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ecrivez votre message"
      />
      <button onClick={createImg}>Envoyer</button>
      <ImageShader url={`${apiUrl}${url}`}></ImageShader>
      <img src={`${apiUrl}${url}`} alt="" />
    </>
  );
}
