import ReactDOM from "react-dom";
import { QRCodeSVG } from "qrcode.react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;


export default function QrCode({ gameId, currentBluffer }) {
  if (typeof window === "undefined") {
    return <div></div>;
  }

  const domain = window.location.origin;
  console.log(domain);
  const url = `${domain}/voyageur?gameId=${gameId}&bluffer=${currentBluffer}`;

  console.log(url);

  return (
    <div>
      <QRCodeSVG value={url} bgColor="transparent" size={200} />
    </div>
  );
}
