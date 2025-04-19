import { connectToDatabase } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import Subscription from "@/models/Subscription";
import Payment from "@/models/Payment";

function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  const hmac = crypto.createHmac("sha256", secret);
  const computedSignature = hmac.update(payload).digest("hex");
  return computedSignature === signature;
}

export async function POST(req: NextRequest) {
  await connectToDatabase();

  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-signature");

    const webhookSecret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET || "";
    if (!signature || !verifyWebhookSignature(rawBody, signature, webhookSecret)) {
      return NextResponse.json(
        { message: "Invalid webhook signature" },
        { status: 401 }
      );
    }
    const event = JSON.parse(rawBody);
    console.log(event, "event line 28")

    const eventType = event.meta.event_name;
    const data = event.data;

    switch (eventType) {
      case "order_created":
        const userId = event.meta.custom_data?.user_id;
        const variantName = data.attributes.first_order_item?.variant_name;
        const amount = data.attributes.total / 100;
        const orderId = data.id;

        if (!userId || !variantName) {
          return NextResponse.json(
            { message: "Missing required data in webhook payload" },
            { status: 400 }
          );
        }

        await Subscription.findOneAndUpdate(
          { userId },
          {
            userId,
            plan: variantName,
            status: "active",
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
          { upsert: true, new: true }
        );

        await Payment.create({
          userId,
          paymentStatus: "completed",
          paymentMethod: "card",
          subscriptionId: orderId,
          amount,
        });

        break;

      default:
    }

    return NextResponse.json({ message: "Webhook received" }, { status: 200 });
  } catch (e: any) {
    console.log(e, "ERROR FOR WEBHOOK")
    return NextResponse.json(
      { message: "Error processing webhook", error: e.message },
      { status: 500 }
    );
  }
}