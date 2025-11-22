import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export async function GET(
  req: NextRequest,
  { params }: { params: { store: string } }
) {
  try {
    const origin =
      process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;

    const storeUsername = params.store;
    const url = `${origin}/@${storeUsername}`;

    // Create a new PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([400, 600]);

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 16;

    page.drawText('Store QR Code', {
      x: 140,
      y: 560,
      size: 18,
      font,
      color: rgb(0, 0, 0),
    });

    // Draw URL text
    page.drawText(`Store: @${storeUsername}`, {
      x: 50,
      y: 520,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });

    page.drawText(`URL: ${url}`, {
      x: 50,
      y: 490,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });

    // TODO: (OPTIONAL) You can embed QR image here if needed

    const pdfBytes = await pdfDoc.save();

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${storeUsername}-qr-card.pdf"`,
      },
    });

  } catch (error) {
    console.error('PDF Generation Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate QR PDF' },
      { status: 500 }
    );
  }
}
