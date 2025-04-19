import { lemonSqueezySetup, createCheckout } from "@lemonsqueezy/lemonsqueezy.js";
import { NextRequest, NextResponse } from "next/server";

// Initialize Lemon Squeezy client
lemonSqueezySetup({
  apiKey: process.env.LEMONSQUEEZY_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { variantId, userId } = await req.json();
    console.log({
      variantId,
      userId
    });

    if (!variantId || !userId) {
      return NextResponse.json(
        { message: "Missing variantId or userId" },
        { status: 400 }
      );
    }

    // Get the base URL for your application
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    // Define success and cancel URLs
    const successUrl = `${appUrl}/payment/success`;
    const cancelUrl = `${appUrl}/payment/cancel`;

    const checkout = await createCheckout(
      process.env.LEMONSQUEEZY_STORE_ID!, 
      variantId, 
      {
        checkoutData: {
          custom: {
            userId: userId
          },
        },
        productOptions: {
          enabledVariants: [variantId],
          redirectUrl: successUrl,
          receiptButtonText: "Go to Dashboard",
          receiptThankYouNote: "Thank you for signing up to Lemon Stand!",
        },
      }
    );

    // Check if checkout.data is null
    if (!checkout.data) {
      throw new Error("Failed to create checkout: No data returned");
    }

    // Log the checkout response to inspect its structure
    console.log("Checkout response:", JSON.stringify(checkout, null, 2));

    // Temporarily use 'any' to bypass type error, then fix based on logged response
    const checkoutData: any = checkout.data;
    
    // Access the checkout URL (adjust based on actual structure)
    const checkoutUrl = checkoutData.data.attributes?.url;
    if (!checkoutUrl) {
      throw new Error("Checkout URL not found in response");
    }

    return NextResponse.json({ checkoutUrl }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { message: "Error creating checkout", error: e.message },
      { status: 500 }
    );
  }
}