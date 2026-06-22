"use client";

import { Html5Qrcode } from "html5-qrcode";
import { useEffect } from "react";

export default function BarcodeScanner({
  onScan,
}: {
  onScan: (ean: string) => void;
}) {
  useEffect(() => {
    const scanner = new Html5Qrcode("reader");

    scanner
      .start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: 250,
        },
        (decodedText) => {
          scanner.stop();
          onScan(decodedText);
        },
        () => {}
      )
      .catch(console.error);

    return () => {
      scanner.stop().catch(() => {});
    };
  }, [onScan]);

  return <div id="reader" />;
}
