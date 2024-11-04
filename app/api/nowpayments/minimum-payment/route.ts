// app/api/nowpayments/minimum-payment/route.js
import axios from 'axios';
import { type NextRequest } from 'next/server'

export async function POST(req:NextRequest) {
  const { from_currency, to_currency } = await req.json();

  try {
    const response = await axios.get(`https://api.nowpayments.io/v1/min-amount?currency_from=${from_currency}&currency_to=${to_currency}`, {
      headers: { 'x-api-key': process.env.NOWPAYMENTS_API_KEY },
    });

    return new Response(JSON.stringify(response.data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error }), { status: 500 });
  }
}