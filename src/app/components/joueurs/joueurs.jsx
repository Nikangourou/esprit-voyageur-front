import styles from "./joueurs.module.scss";
import PageContainer from "../pageContainer/pageContainer";
import AddPlayer from "./addPlayer/addPlayer";
import Countdown from "../chrono/countdown";
import { SocketContext } from "../../context/socketContext";
import {setGameId } from "../../store/reducers/playersReducer";
import {useContext} from "react";
import {useSelector, useDispatch } from "react-redux";
import Button from "../button/button";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function Joueurs() {

  const { socket } = useContext(SocketContext);
  const dispatch = useDispatch();
  const players = useSelector((state) => state.players.players);
  const playersInGame = useSelector((state) => state.players.playersInGame);
  const gameId = useSelector((state) => state.players.players);

  const onRedirectEvent = () => {
    if (socket) {
      fetch(`${apiUrl}/game/post/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          v2: true,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Create Game");
          dispatch(
            setGameId({
              gameId: data.game_id,
            })
          );
          localStorage.setItem("gameId", data.game_id);

          socket.emit("connexionPrimary", data.game_id, {
            Players: players,
            PlayersInArray: playersInGame,
          });
        });
    }
  };

  return (
    <>
      <AddPlayer></AddPlayer>
      <PageContainer pageCategory={"player"}>
        <Button
          type={"link"}
          // disabled={playersInGame.length < 3}
          events={{ onClick: onRedirectEvent }}
        >
          Valider
        </Button>
      </PageContainer>
    </>
  );
}
