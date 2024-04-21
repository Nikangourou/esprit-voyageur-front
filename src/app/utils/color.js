import { useSelector } from "react-redux";

export const getCurrentColor = () => {
  const players = useSelector((state) => state.players.players);
  const currentBluffeur = useSelector((state) => state.players.currentBluffeur);

  const colorStyle =
    currentBluffeur != "" ? players[currentBluffeur].color : "";

  return colorStyle ? colorStyle : "var(--color-primary)"
};