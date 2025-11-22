import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export async function GET(
  req: NextRequest, 
  { params }: { params: { store: string } }
) {
  try {
    const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;
    const storeUrl = `${origin}/@${params.store}`;
    const storeName = params.store;

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const { width, height } = page.getSize();

    page.drawText(`Store: ${storeName}`, {
      x: 50,
      y: height - 100,
      size: 30,
      font,
      color: rgb(0, 0, 0),
    });

    page.drawText(storeUrl, {
      x: 50,
      y: height - 150,
      size: 18,
      font,
      color: rgb(0, 0, 1),
    });

    const pdfBytes = await pdfDoc.save();

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: { 
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${storeName}-card.pdf"`
      },
    });

  } catch (error) {
    console.error("PDF Generation Error:", error);
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
}