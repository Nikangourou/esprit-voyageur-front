import ReactDOM from "react-dom";
import { QRCodeSVG } from "qrcode.react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;


export default function QrCode({ gameId, currentBluffer }) {
  if (typeof window === "undefined") {
    return <div></div>;
  }

  const domain = window.location.origin;
  const url = `${domain}/voyageur?gameId=${gameId}&bluffer=${currentBluffer}`;

  console.log(url);

  return (
    <div style={{ border: "5px solid white" }}>
      <QRCodeSVG value={url} bgColor="white" size={160} />
    </div>
  );
}
