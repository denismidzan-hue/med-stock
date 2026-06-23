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
    let scanned = false;

    scanner
      .start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: 250,
        },
        async (decodedText) => {
          if (scanned) return;

          scanned = true;

          try {
            await scanner.stop();
          } catch {}

          onScan(decodedText);
        },
        () => {}
      )
      .catch(console.error);

    return () => {
      if (!scanned) {
        scanner.stop().catch(() => {});
      }
    };
  }, [onScan]);

  return <div id="reader" />;
}
