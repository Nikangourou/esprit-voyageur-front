"use client";

import styles from "./page.module.scss";
import Chat from "../../components/chat/chat";
import Images from "../../components/chat/images/images";
import { useSelector } from "react-redux";

export default function Voyageur() {
  const loadingImages = useSelector((state) => state.game.loadingImages);

  return <main>{loadingImages ? <Images /> : <Chat />}</main>;
}
