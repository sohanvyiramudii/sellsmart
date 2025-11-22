import Razorpay from 'razorpay';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);

  const items = JSON.parse(url.searchParams.get('items') || '[]');
  
  // Added types (s: number, i: any) to prevent build errors here as well
  const amount = Math.round(items.reduce((s: number, i: any) => s + (Number(i.price) || 0), 0) * 100);

  const razor = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!, // Added ! to ensure TS knows these exist
    key_secret: process.env.RAZORPAY_KEY_SECRET!
  });

  try {
    const order = await razor.orders.create({
      amount,
      currency: 'INR',
      receipt: "order-" + Date.now()
    });

    return NextResponse.json({ order });
    
  } catch (error) {
    console.error("Razorpay Error:", error);
    return NextResponse.json({ error: "Error creating order" }, { status: 500 });
  }
}