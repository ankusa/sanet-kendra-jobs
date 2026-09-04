import QRCode from 'qrcode';
import { writeFile } from 'node:fs/promises';

const svg = await QRCode.toString('https://ankusa.github.io/sanet-kendra-jobs/', {
  type: 'svg',
  errorCorrectionLevel: 'H',
  margin: 2,
  width: 600,
  color: { dark: '#12231b', light: '#ffffff' },
});
await writeFile('public/qr.svg', svg);
