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

    // ------------------------------
    // 1. Generate QR code (PNG buffer)
    // ------------------------------
    const qrPngBuffer = await QRCode.toBuffer(url, {
      margin: 1,
      width: 300,
      color: { dark: "#000000", light: "#FFFFFF" },
    });

    // ------------------------------
    // 2. Create PDF
    // ------------------------------
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([500, 700]);

    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Text title
    page.drawText("Store QR Code", {
      x: 160,
      y: 640,
      size: 22,
      font,
      color: rgb(0, 0, 0),
    });

    page.drawText(`@${storeUsername}`, {
      x: 200,
      y: 610,
      size: 16,
      font,
      color: rgb(0, 0, 0),
    });

    // ------------------------------
    // 3. Embed QR code into PDF
    // ------------------------------
    const qrImage = await pdfDoc.embedPng(qrPngBuffer);

    const qrSize = 300;
    page.drawImage(qrImage, {
      x: 100,
      y: 260,
      width: qrSize,
      height: qrSize,
    });

    // URL under QR
    page.drawText(url, {
      x: 80,
      y: 230,
      size: 14,
      font,
      color: rgb(0.1, 0.1, 0.1),
    });

    const pdfBytes = await pdfDoc.save();

    // ------------------------------
    // 4. Return PDF as Blob (for Vercel)
    // ------------------------------
    return new NextResponse(
      new Blob([pdfBytes], { type: "application/pdf" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${storeUsername}-qr-card.pdf"`,
        },
      }
    );
  } catch (error: any) {
    console.error("PDF Generation Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate QR PDF" },
      { status: 500 }
    );
  }
}
