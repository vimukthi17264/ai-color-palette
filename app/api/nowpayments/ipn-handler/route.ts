import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// NOWPayments IPN secret key
const nowpaymentsIpnSecret = process.env.NOWPAYMENTS_IPN_SECRET!;

export const config = {
  runtime: 'edge',
};

export async function POST(req: NextRequest) {
  try {
    // Verify the authenticity of the IPN
    const signature = req.headers.get('x-nowpayments-sig');
    if (!signature) {
      return NextResponse.json({ error: 'Missing NOWPayments signature' }, { status: 400 });
    }

    const body = await req.json();
    const hmac = crypto.createHmac('sha512', nowpaymentsIpnSecret);
    const digest = hmac.update(JSON.stringify(body)).digest('hex');

    if (digest !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Process the payment information
    const {
      payment_id,
      payment_status,
      pay_address,
      price_amount,
      price_currency,
      pay_amount,
      actually_paid,
      pay_currency,
      order_id,
      order_description,
      purchase_id,
      created_at,
      updated_at,
    } = body;

    // Update the database with the payment information
    const { error: upsertError } = await supabase
      .from('payments')
      .upsert({
        payment_id,
        payment_status,
        pay_address,
        price_amount,
        price_currency,
        pay_amount,
        actually_paid,
        pay_currency,
        order_id,
        order_description,
        purchase_id,
        created_at,
        updated_at,
      }, {
        onConflict: 'payment_id'
      });

    if (upsertError) {
      console.error('Error upserting payment:', upsertError);
      return NextResponse.json({ error: 'Failed to update payment information' }, { status: 500 });
    }

    // If payment is finished, update user credits
    if (payment_status === 'finished') {
      const { error: creditError } = await supabase.rpc('add_user_credits', {
        p_user_id: order_id, // Assuming order_id is the user_id
        p_credits: calculateCredits(price_amount, price_currency)
      });

      if (creditError) {
        console.error('Error updating user credits:', creditError);
        return NextResponse.json({ error: 'Failed to update user credits' }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing NOWPayments IPN:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function calculateCredits(amount: number, currency: string): number {
  // Implement your credit calculation logic here
  // This is a placeholder implementation
  return currency === 'USD' ? Math.floor(amount * 100) : Math.floor(amount);
}