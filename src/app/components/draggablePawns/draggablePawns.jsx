import Button from "../button/button";
import { useDispatch, useSelector } from "react-redux";

export default function DraggablePawns({
  containerRef,
  imageRef1,
  imageRef2,
  images,
  setColorListTrue,
  colorListTrue,
}) {
  const currentBluffer = useSelector((state) => state.players.currentBluffer);
  const playersInGame = useSelector((state) => state.players.playersInGame);
  const players = useSelector((state) => state.players.players);

  function isPointWithinRadiusFromCenter(element, point) {
    // Récupérer les dimensions de l'élément
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculer la distance entre le centre de l'élément et le point donné
    const distance = Math.sqrt(
      Math.pow(point.x - centerX, 2) + Math.pow(point.y - centerY, 2),
    );

    // Vérifier si la distance est inférieure ou égale au rayon
    return distance <= rect.width / 2;
  }

  function removeItemOnce(arr, value) {
    const index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  }

  function eventDragEnd(point) {
    if (isPointWithinRadiusFromCenter(imageRef1.current, point)) {
      if (images && images[0].isTrue) {
        setColorListTrue((prev) => {
          const tmp = [...prev];
          return [
            ...removeItemOnce(tmp, point.target.getAttribute("data-color")),
            point.target.getAttribute("data-color"),
          ];
        });
        console.log(
          "AJOUT DANS LISTE TRUE",
          colorListTrue,
          point.target.getAttribute("data-color"),
        );
        //TODO GSAP ANIM FEEDBACK
      } else {
        setColorListTrue((prev) => {
          const tmp = [...prev];
          return [
            ...removeItemOnce(tmp, point.target.getAttribute("data-color")),
          ];
        });
      }
    } else if (isPointWithinRadiusFromCenter(imageRef2.current, point)) {
      if (images && images[1].isTrue) {
        setColorListTrue((prev) => {
          const tmp = [...prev];
          return [
            ...removeItemOnce(tmp, point.target.getAttribute("data-color")),
            point.target.getAttribute("data-color"),
          ];
        });
        console.log(
          "AJOUT DANS LISTE TRUE",
          colorListTrue,
          point.target.getAttribute("data-color"),
        );
        //TODO GSAP ANIM FEEDBACK
      } else {
        setColorListTrue((prev) => {
          const tmp = [...prev];
          return [
            ...removeItemOnce(tmp, point.target.getAttribute("data-color")),
          ];
        });
      }
    } else {
      setColorListTrue((prev) => {
        const tmp = [...prev];
        return [
          ...removeItemOnce(tmp, point.target.getAttribute("data-color")),
        ];
      });
    }
  }

  return playersInGame.map((color, i) => {
    // Exclu bluffeur
    console.log(color);
    if (color !== currentBluffer) {
      return (
        <Button
          dragEndEvent={eventDragEnd}
          dragContainer={containerRef.current}
          key={i + color}
          type={"player"}
          dataColor={color}
          color={players[color].color}
          colorActive={true}
        ></Button>
      );
    }
  });
}
