import ReactDOM from "react-dom";
import { QRCodeSVG } from "qrcode.react";

export default function QrCode({ gameId }) {
  const url = `http://10.137.98.39:3000/voyageur?gameId=${gameId}`;
  console.log(url);

  return (
    <div>
      <QRCodeSVG value={url} />
    </div>
  );
}
