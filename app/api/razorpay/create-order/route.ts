
import Razorpay from 'razorpay';

export async function GET(req) {
  const url = new URL(req.url);

  const items = JSON.parse(url.searchParams.get('items') || '[]');
  const amount = Math.round(items.reduce((s,i)=>s+(Number(i.price)||0),0) * 100);

  const razor = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });

  const order = await razor.orders.create({
    amount,
    currency:'INR',
    receipt:"order-"+Date.now()
  });

  return new Response(JSON.stringify({ order }), {
    headers:{ "Content-Type":"application/json" }
  });
}
