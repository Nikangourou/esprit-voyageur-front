"use client";

import QrCodeHandler from "../../components/qrCode/qrCodeHandler";

import {Suspense} from "react";

export default function Code() {
 
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QrCodeHandler />
    </Suspense>
  );
}
