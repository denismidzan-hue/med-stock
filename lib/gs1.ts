export function parseGS1(data: string) {
  const cleaned = data.replace(/\u001d/g, "");

  const gtin = cleaned.substring(2, 16);

  const expPos = cleaned.indexOf("17");
  const lotPos = cleaned.indexOf("10", 24);
  const serialPos = cleaned.indexOf("21", lotPos);

  let expiry = "";
  let lot = "";
  let serial = "";

  if (expPos !== -1) {
    expiry = cleaned.substring(expPos + 2, expPos + 8);
  }

  if (lotPos !== -1) {
    if (serialPos !== -1) {
      lot = cleaned.substring(lotPos + 2, serialPos);
      serial = cleaned.substring(serialPos + 2);
    } else {
      lot = cleaned.substring(lotPos + 2);
    }
  }

  return {
    gtin,
    expiry,
    lot,
    serial,
  };
}
