import { connectToDatabase } from "@/lib/database";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'whatthehelloisadeepseek'

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { email, password, name, phoneNumber, role } = body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      phoneNumber,
      role: role || "USER",
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id, email: newUser.email, role: newUser.role }, JWT_SECRET, {
      expiresIn: "1h",
    });

    return NextResponse.json({ 
      message: "User created successfully", 
      user: { 
        id: newUser._id, 
        email: newUser.email, 
        name: newUser.name, 
        role: newUser.role 
      }, 
      token 
    }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ message: "Error creating user", error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    const users = await User.find();
    return NextResponse.json(users, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: "Error fetching users", error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const { id, ...updateFields } = await req.json();
    const updatedUser = await User.findByIdAndUpdate(id, updateFields, { new: true });

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User updated successfully", user: updatedUser }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: "Error updating user", error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    const { id } = await req.json();
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: "Error deleting user", error: error.message }, { status: 500 });
  }
}
