import { getCurrentColor } from "../../utils/color";

export default function Title({ title }) {

  const color = getCurrentColor();

  const style = {
    fontSize: "56px",
    fontFamily: "Nighty",
    color: color,
  };

  return <h1 style={style}>{title}</h1>;
}
