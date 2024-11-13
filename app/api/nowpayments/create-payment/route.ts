// app/api/nowpayments/create-payment/route.js
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req:NextRequest) {
  const { amount, currency_from, currency_to, order_id, success_url, ipn_callback_url } = await req.json();

  try {
    const response = await axios.post('https://api.nowpayments.io/v1/payment', {
      price_amount: amount,
      price_currency: currency_from,
      pay_currency: currency_to,
      order_id,
      success_url,
      ipn_callback_url,
      is_fixed_rate:true,

    }, {
      headers: { 'x-api-key': process.env.NOWPAYMENTS_API_KEY },
    });

    return new NextResponse(JSON.stringify(response.data), { status: 200 });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: error }), { status: 500 });
  }
}