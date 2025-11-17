// @ts-nocheck

import QRCode from "qrcode";
import type { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { store: string } }
) {
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;

  const url = `${origin}/@${params.store}`;

  const qrPng = await QRCode.toBuffer(url);

  return new Response(qrPng, {
    headers: {
      "Content-Type": "image/png",
    },
  });
}
