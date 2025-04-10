import { connectToDatabase } from "@/lib/database";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = 'whatthehelloisadeepseek'

export async function POST(req: NextRequest) {
    try {
      await connectToDatabase();
      const { email, password } = await req.json();
  
      const user = await User.findOne({ email });
      if (!user) {
        return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
      }
  
      const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, {
        expiresIn: "1h",
      });
  
      return NextResponse.json({
        message: "Login successful",
        user: { 
          id: user._id, 
          email: user.email, 
          name: user.name, 
          role: user.role 
        },
        token,
      }, { status: 200 });
  
    } catch (error: any) {
      return NextResponse.json({ message: "Error logging in", error: error.message }, { status: 500 });
    }
}