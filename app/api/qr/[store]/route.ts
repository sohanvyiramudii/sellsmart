
import QRCode from 'qrcode';

export async function GET(req, { params }) {
  const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;
  const url = `${origin}/@${params.store}`;

  const dataUrl = await QRCode.toDataURL(url, { margin:1, width:420 });
  const base64 = dataUrl.split(',')[1];

  return new Response(Buffer.from(base64,'base64'), {
    headers: { "Content-Type":"image/png" }
  });
}
