import ReactDOM from 'react-dom';
import { QRCodeSVG } from 'qrcode.react';

export default function QrCode({ threadKey, gameId }) {

    const url = `http://localhost:3000/voyageur?threadKey=${threadKey}&gameId=${gameId}`
    console.log(url)

    return (
        <main>
            <QRCodeSVG value={url}/>
        </main>
    );
}
