// @ts-nocheck

import QRCode from "qrcode";
import { PDFDocument, StandardFonts } from "pdf-lib";
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

  const font = await pdf.embedFont(StandardFonts.HelveticaBold);
  page.drawText("SELLSMART STORE QR", {
    x: 150,
    y: 780,
    size: 26,
    font,
  });

  const qr = await QRCode.toDataURL(url);
  const qrImage = await pdf.embedPng(qr);

  page.drawImage(qrImage, {
    x: 170,
    y: 420,
    width: 260,
    height: 260,
  });

  const pdfBytes = await pdf.save();

  return new Response(pdfBytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline; filename=qr.pdf",
    },
  });
}
