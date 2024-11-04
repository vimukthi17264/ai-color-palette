import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

const IPN_SECRET = process.env.NOWPAYMENTS_IPN_SECRET

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = req.headers.get('x-nowpayments-sig')

    if (!signature) {
      return new NextResponse('Missing signature', { status: 400 })
    }

    // Verify the signature
    const hmac = crypto.createHmac('sha512', IPN_SECRET || '')
    const digest = hmac.update(body).digest('hex')

    if (signature !== digest) {
      return new NextResponse('Invalid signature', { status: 400 })
    }

    const data = JSON.parse(body)

    // Process the IPN data
    if (data.payment_status === 'finished') {
      // Payment is confirmed, update user's credits
      await updateUserCredits(data.order_id, data.actually_paid)
    }

    return new NextResponse('OK', { status: 200 })
  } catch (error) {
    console.error('Error processing IPN:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

async function updateUserCredits(orderId: string, amountPaid: number) {
  // Implement the logic to update user's credits based on the order ID and amount paid
  // This is a placeholder function and should be replaced with actual database operations
  console.log(`Updating credits for order ${orderId}, amount paid: ${amountPaid}`)
  // Example: await db.updateUserCredits(orderId, amountPaid)
}