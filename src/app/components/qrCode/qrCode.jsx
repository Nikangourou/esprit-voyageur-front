import ReactDOM from "react-dom";
import { QRCodeSVG } from "qrcode.react";

export default function QrCode({ gameId, currentBluffer }) {
  const url = `http://localhost:3000/voyageur?gameId=${gameId}&bluffer=${currentBluffer}`;
  console.log(url);

  return (
    <div>
      <QRCodeSVG value={url} bgColor="transparent" size={150} />
    </div>
  );
}
