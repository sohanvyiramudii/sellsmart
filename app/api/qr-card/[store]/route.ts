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

    const storeUsername = params.store;
    const url = `${origin}/@${storeUsername}`;

    const qrBuffer = await QRCode.toBuffer(url, {
      margin: 1,
      width: 300,
      color: { dark: "#000", light: "#fff" },
    });

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([500, 700]);

    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const qrImage = await pdfDoc.embedPng(qrBuffer);

    page.drawText("Store QR Code", { x: 160, y: 640, size: 22, font });
    page.drawImage(qrImage, { x: 100, y: 260, width: 300, height: 300 });

    const pdfBytes = await pdfDoc.save();

    return new NextResponse(
      new Blob([pdfBytes], { type: "application/pdf" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${storeUsername}-qr.pdf"`,
        },
      }
    );
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
