// app/api/generateIPN/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  // Load IPN secret from environment variables
  const ipnSecret = process.env.NOWPAYMENT_SECRET;
  if (!ipnSecret) {
    return NextResponse.json({ error: 'IPN secret key is missing' }, { status: 500 });
  }

  // Parse the JSON body
  const body = await req.json();
  const bodyString = JSON.stringify(body);

  // Generate HMAC SHA-512 signature
  const hmac = crypto.createHmac('sha512', ipnSecret);
  hmac.update(bodyString);
  const signature = hmac.digest('hex');

  // Return the generated signature and body (for testing)
  return NextResponse.json({
    signature,
    requestBody: body
  });
}