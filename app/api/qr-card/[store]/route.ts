
import QRCode from 'qrcode';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export async function GET(req, { params }) {
  const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;
  const url = `${origin}/@${params.store}`;

  const dataUrl = await QRCode.toDataURL(url, { margin:1, width:700 });

  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]); // A4

  const font = await pdf.embedFont(StandardFonts.HelveticaBold);
  const pngBytes = Buffer.from(dataUrl.split(',')[1],'base64');
  const img = await pdf.embedPng(pngBytes);

  page.drawText("SellSmart", { x:60, y:780, size:28, font, color:rgb(0.54,0.40,0.93) });
  page.drawImage(img, { x:60, y:300, width:475, height:475 });

  const bytes = await pdf.save();

  return new Response(bytes, { headers: { "Content-Type":"application/pdf" } });
}
