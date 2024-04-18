"use client";

import QrCodeHandler from "../../components/qrCode/qrHandler";

import {Suspense} from "react";

export default function Code() {
 
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QrCodeHandler />
    </Suspense>
  );
}
