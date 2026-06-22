"use client";

import { Html5Qrcode } from "html5-qrcode";
import { useEffect } from "react";

type Props = {
  onScanSuccess: (ean: string) => void;
};

export default function BarcodeScanner({
  onScanSuccess,
}: Props) {
  useEffect(() => {
    const html5QrCode = new Html5Qrcode("reader");

    Html5Qrcode.getCameras()
      .then((devices) => {
        console.log("CAMERAS:", devices);

        if (devices.length === 0) {
          alert("Ni najdenih kamer");
          return;
        }

        alert("Kamere najdene: " + devices.length);
        console.log(devices);

        return html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: 250,
          },
          (decodedText) => {
            onScanSuccess(decodedText);
            html5QrCode.stop();
          },
          () => {}
        );
      })
      .catch((err) => {
        console.error(err);
        alert("Napaka kamere: " + err);
      });

    return () => {
      html5QrCode.stop().catch(() => {});
    };
  }, [onScanSuccess]);

  return <div id="reader" />;
}
