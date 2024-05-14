import { useDispatch, useSelector } from "react-redux";
import {
  setFalseImageId,
  setTrueImageId,
} from "../store/reducers/playersReducer";

export const pending = (baseUrl, endpoint, threadKey, onCompletion) => {
  const interval = setInterval(() => {
    fetch(`${baseUrl}${endpoint}/${threadKey}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("pending...");
        if (data.status === "completed") {
          console.log("Completed");
          onCompletion(data);
          clearInterval(interval);
        } else if (data.status === "error") {
          // Gestion des erreurs si nécessaire
          console.error(
            "There was an error processing your request:",
            data.message
          );
          clearInterval(interval);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        clearInterval(interval);
      });
  }, 1000); // Fréquence d'actualisation, ajustez selon les besoins
};

export const generateImg = (apiUrl, prompt, gameId, type, socket) => {
  let isLaunched = false;
  const dispatch = useDispatch();

  let base64 = null;

  if (gameId && !isLaunched.current && socket) {
    isLaunched.current = true;
    fetch(`${apiUrl}/image/post/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt,
        game_id: gameId,
        isTrue: type === "simple",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        base64 = `${apiUrl}${data.url}`;
        socket.emit("imagesAllGenerated", gameId, data._id);
        if (data.isTrue) {
          dispatch(setTrueImageId({ id: data._id }));
        } else {
          dispatch(setFalseImageId({ id: data._id }));
        }
      });
  }

  return base64;
};
