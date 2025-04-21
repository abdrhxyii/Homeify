import { connectToDatabase } from "@/lib/database";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

// GET all users
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const data = await User.find();

    return NextResponse.json({ data }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || "Something went wrong" },
      { status: 400 }
    );
  }
}

// DELETE a user by ID
export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    await User.deleteOne({ _id: userId });

    return NextResponse.json({ message: "Deleted successfully" }, { status: 204 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Something went wrong" }, { status: 400 });
  }
}

// PUT - Update user by ID
export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const { userId, updates } = body;

    if (!userId || !updates || typeof updates !== "object") {
      return NextResponse.json({ error: "User ID and valid update fields are required" }, { status: 400 });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User updated successfully", user: updatedUser }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Something went wrong" }, { status: 400 });
  }
}
