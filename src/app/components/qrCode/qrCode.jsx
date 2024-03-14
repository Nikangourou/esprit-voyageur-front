import ReactDOM from 'react-dom';
import { QRCodeSVG } from 'qrcode.react';

export default function QrCode({ threadKey }) {

    console.log(threadKey);
    
    return (
        <main>
            <QRCodeSVG value={`http://localhost:3000/voyageur?threadKey=${threadKey}`} />
        </main>
    );
}
