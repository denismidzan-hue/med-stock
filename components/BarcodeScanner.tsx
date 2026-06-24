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

    // Check if mobile device
    const isMobile = window.innerWidth < 768;

    scanner
      .start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: isMobile ? { width: 300, height: 300 } : 250,
        },
        async (decodedText) => {
          if (scanned) return;

          scanned = true;

          alert("Skenirano: " + decodedText);

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

  return <div id="reader" className="w-full h-64 md:h-80" />;
}
