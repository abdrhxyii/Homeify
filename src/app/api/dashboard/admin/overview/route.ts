import { connectToDatabase } from "@/lib/database";
import User from "@/models/User";
import Property from "@/models/Property";
import Subscription from "@/models/Subscription";
import Payment from "@/models/Payment";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    // Total Users
    const totalUsers = await User.countDocuments();

    // Paid Users (users with Pro or Premium subscriptions)
    const paidUsers = await Subscription.countDocuments({
      plan: { $in: ["Pro", "Premium"] },
      status: "active",
      expiresAt: { $gt: new Date() },
    });

    // Total Property Listings
    const totalProperties = await Property.countDocuments();

    // Best Property Lister (seller with most properties)
    const bestLister = await Property.aggregate([
      {
        $group: {
          _id: "$sellerId",
          propertyCount: { $sum: 1 },
        },
      },
      {
        $sort: { propertyCount: -1 },
      },
      {
        $limit: 1,
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          name: "$user.name",
          email: "$user.email",
          propertyCount: 1,
        },
      },
    ]);

    // Subscription Distribution
    const subscriptionDistribution = await Subscription.aggregate([
      {
        $match: {
          status: "active",
          expiresAt: { $gt: new Date() },
        },
      },
      {
        $group: {
          _id: "$plan",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          plan: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ]);

    // Format subscription distribution
    const subscriptionCounts = {
      Basic: 0,
      Pro: 0,
      Premium: 0,
    };
    subscriptionDistribution.forEach((dist: { plan: string; count: number }) => {
      subscriptionCounts[dist.plan as keyof typeof subscriptionCounts] = dist.count;
    });

    // Total Revenue from Subscriptions
    const totalRevenue = await Payment.aggregate([
      {
        $match: {
          paymentStatus: "completed",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    return NextResponse.json(
      {
        totalUsers,
        paidUsers,
        totalProperties,
        bestLister: bestLister[0] || { name: "N/A", email: "N/A", propertyCount: 0 },
        subscriptionDistribution: subscriptionCounts,
        totalRevenue: totalRevenue[0]?.total || 0,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error fetching dashboard stats", error: error.message },
      { status: 500 }
    );
  }
}

// /api/dashboard/admin/overview
// /api/dashboard/admin/users 