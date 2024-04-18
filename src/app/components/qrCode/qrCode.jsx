import ReactDOM from "react-dom";
import { QRCodeSVG } from "qrcode.react";

export default function QrCode({ gameId }) {
  const url = `http://localhost:3000/voyageur?gameId=${gameId}`;
  console.log(url);

  return (
    <div>
      <QRCodeSVG value={url} />
    </div>
  );
}
