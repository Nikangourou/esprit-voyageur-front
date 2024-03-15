"use client" // This directive is unusual and typically not standard JavaScript or React. Make sure it is necessary for your project.

import { useEffect, useState } from "react";
import styles from "./page.module.scss";
import Chat from "../components/chat/chat";



export default function Voyageur() {
  const [generateImages, setGenerateImages] = useState(false)

  function extractTextBetweenQuotes(text) {
    const regex = /"([^"]*)"/;
    const match = text.match(regex);

    if (match && match.length > 1) {
      return match[1];
    } else {
      return null;
    }
  }

  return (
    <main>
      <h1>Voyageur</h1>
      <Chat />
    </main>
  );
}