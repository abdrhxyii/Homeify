import { connectToDatabase } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";
import Subscription from "@/models/Subscription";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    
    if (!userId) {
      return NextResponse.json(
        { message: "Missing userId parameter" },
        { status: 400 }
      );
    }

    const subscription = await Subscription.findOne({
      userId,
      status: "active",
      expiresAt: { $gt: new Date() } 
    });

    return NextResponse.json({
      hasActiveSubscription: !!subscription,
      subscription: subscription ? {
        plan: subscription.plan,
        status: subscription.status,
        expiresAt: subscription.expiresAt
      } : null
    }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { message: "Error checking subscription", error: e.message },
      { status: 500 }
    );
  }
}