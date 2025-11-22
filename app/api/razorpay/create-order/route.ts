import Razorpay from "razorpay";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { amount, receipt } = await req.json();

  const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });

  const options = {
    amount: amount * 100,
    currency: "INR",
    receipt,
  };

  const order = await instance.orders.create(options);

  return NextResponse.json(order);
}
