import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import QRCode from "qrcode";

export async function GET(
  req: NextRequest,
  { params }: { params: { store: string } }
) {
  try {
    const origin =
      process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;

    const slug = params.store;
    const url = `${origin}/store/${slug}`;

    const qrPng = await QRCode.toBuffer(url, {
      margin: 1,
      width: 300,
    });

    const pdf = await PDFDocument.create();
    const page = pdf.addPage([500, 700]);
    const font = await pdf.embedFont(StandardFonts.HelveticaBold);

    page.drawText("Store QR Code", { x: 160, y: 640, size: 22, font });
    page.drawText(`@${slug}`, { x: 200, y: 610, size: 16, font });

    const qrImage = await pdf.embedPng(qrPng);
    page.drawImage(qrImage, { x: 100, y: 260, width: 300, height: 300 });

    page.drawText(url, { x: 100, y: 230, size: 12, font });

    const pdfBytes = await pdf.save();

    return new NextResponse(new Blob([pdfBytes], { type: "application/pdf" }), {
      status: 200,
      headers: {
        "Content-Disposition": `attachment; filename="${slug}-qr.pdf"`,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
