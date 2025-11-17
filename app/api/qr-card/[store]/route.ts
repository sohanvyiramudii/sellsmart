import QRCode from "qrcode";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { store: string } }
) {
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;

  const url = `${origin}/@${params.store}`;

  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]);

  page.drawText("SELLSMART STORE QR", {
    x: 180,
    y: 790,
    size: 24,
    font: await pdf.embedFont(StandardFonts.HelveticaBold),
  });

  const qrData = await QRCode.toDataURL(url);
  const qrImage = await pdf.embedPng(qrData);

  page.drawImage(qrImage, {
    x: 170,
    y: 440,
    width: 250,
    height: 250,
  });

  const pdfBytes = await pdf.save();

  return new Response(pdfBytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline; filename=qr.pdf",
    },
  });
}
