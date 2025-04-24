import { connectToDatabase } from "@/lib/database";
import Property from "@/models/Property";
import Message from "@/models/Message";
import Subscription from "@/models/Subscription";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const url = new URL(req.url);
    const sellerId = url.searchParams.get("sellerId");

    if (!sellerId) {
      return NextResponse.json(
        { message: "Missing sellerId parameter" },
        { status: 400 }
      );
    }

    // Fetch subscription to determine plan
    const subscription = await Subscription.findOne({
      userId: sellerId,
      status: "active",
      expiresAt: { $gt: new Date() },
    });

    const plan = subscription?.plan || "Basic"; // Default to Basic if no active subscription

    // Fetch total properties listed
    const totalProperties = await Property.countDocuments({ sellerId });

    // Fetch total messaged users (distinct senderId where receiverId is sellerId)
    const messagedUsers = await Message.distinct("senderId", { receiverId: sellerId });
    const totalMessagedUsers = messagedUsers.length;

    // Initialize response data
    const analyticsData: any = {
      totalProperties,
      totalMessagedUsers,
    };

    // Add Pro/Premium-specific data
    if (plan === "Pro" || plan === "Premium") {
      // Fetch all properties to calculate total click count and popular listings
      const properties = await Property.find({ sellerId }).select("title clickCount");

      // Total click count
      const totalClickCount = properties.reduce((sum, prop) => sum + (prop.clickCount || 0), 0);

      // Popular listings (top 5 by clickCount)
      const popularListings = properties
        .sort((a, b) => b.clickCount - a.clickCount)
        .slice(0, 5)
        .map(prop => ({
          id: prop._id,
          title: prop.title,
          clickCount: prop.clickCount,
        }));

      analyticsData.totalClickCount = totalClickCount;
      analyticsData.popularListings = popularListings;
    }

    // Add Premium-specific data
    if (plan === "Premium") {
      // Count rental and sale properties
      const rentalProperties = await Property.countDocuments({ sellerId, listingType: "rental" });
      const saleProperties = await Property.countDocuments({ sellerId, listingType: "sale" });

      analyticsData.premiumMetrics = {
        rentalProperties,
        saleProperties,
      };
    }

    return NextResponse.json(
      { message: "Analytics retrieved successfully", data: analyticsData },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error retrieving analytics", error: error.message },
      { status: 500 }
    );
  }
}