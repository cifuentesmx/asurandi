// import { createWriteStream } from "fs";
// import qr from "qr-image";
// import { cleanImage } from "../utils/cleanImage";

import { toDataURL } from 'qrcode';
import { updateQr } from '../../updateQr.js';

export const baileysGenerateQR = async (qrData: string, accountId: string) => {
  const base64 = await toDataURL(qrData)
  await updateQr(base64, accountId)
};
