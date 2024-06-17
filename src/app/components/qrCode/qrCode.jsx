import ReactDOM from "react-dom";
import { QRCodeSVG } from "qrcode.react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function QrCode({ gameId, currentBluffer }) {
  const url = `${"http://localhost:3000/"}/voyageur?gameId=${gameId}&bluffer=${currentBluffer}`;
  // const url = `${"http://10.137.97.208:3000/"}/voyageur?gameId=${gameId}&bluffer=${currentBluffer}`;

  console.log(url);

  return (
    <div>
      <QRCodeSVG value={url} bgColor="transparent" size={200} />
    </div>
  );
}
