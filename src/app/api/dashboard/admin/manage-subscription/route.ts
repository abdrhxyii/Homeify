import { connectToDatabase } from "@/lib/database";
import Subscription from "@/models/Subscription";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const subscriptions = await Subscription.find()
    .populate("userId", "name email")
    .lean();

    const subscriptionData = subscriptions.map((sub) => {
        const user = sub.userId as { name?: string; email?: string };
        return {
            _id: sub._id,
            userName: user?.name || "N/A",
            userEmail: user?.email || "N/A",
            plan: sub.plan,
            status: sub.status,
            expiresAt: sub.expiresAt,
        };
    });


    return NextResponse.json({ subscriptions: subscriptionData }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error fetching subscriptions", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { message: "Subscription ID is required" },
        { status: 400 }
      );
    }

    const subscription = await Subscription.findByIdAndDelete(id);

    if (!subscription) {
      return NextResponse.json(
        { message: "Subscription not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Subscription deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error deleting subscription", error: error.message },
      { status: 500 }
    );
  }
}