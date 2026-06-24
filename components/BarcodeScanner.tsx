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

    const config = {
      fps: 10,
      qrbox: isMobile ? { width: 250, height: 250 } : 250,
    };

    scanner
      .start(
        { facingMode: "environment" },
        config,
        async (decodedText) => {
          if (scanned) return;

          scanned = true;

          try {
            await scanner.stop();
          } catch {}

          onScan(decodedText);
        },
        (errorMessage) => {
          console.log("Scanner error:", errorMessage);
        }
      )
      .catch((error) => {
        console.error("Scanner start error:", error);
      });

    return () => {
      if (!scanned) {
        scanner.stop().catch(() => {});
      }
    };
  }, [onScan]);

  return <div id="reader" className="w-full h-64 md:h-80" />;
}
