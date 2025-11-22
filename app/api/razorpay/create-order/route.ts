import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export async function GET(
  req: NextRequest, 
  { params }: { params: { store: string } }
) {
  try {
    // 1. Get the store URL
    const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;
    const storeUrl = `${origin}/@${params.store}`;
    const storeName = params.store;

    // 2. Create a new PDF Document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]); // Card size
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // 3. Draw Text (Store Name)
    page.drawText(`Store: ${storeName}`, {
      x: 50,
      y: height - 100,
      size: 30,
      font: font,
      color: rgb(0, 0, 0),
    });

    // 4. Draw Text (URL)
    page.drawText(storeUrl, {
      x: 50,
      y: height - 150,
      size: 18,
      font: font,
      color: rgb(0, 0, 1), // Blue color for link
    });

    // 5. Save the PDF
    const pdfBytes = await pdfDoc.save();

    // 6. Return the PDF
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