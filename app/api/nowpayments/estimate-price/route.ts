// app/api/nowpayments/estimate-price/route.js
import axios from 'axios';
import { NextRequest } from 'next/server';

export async function POST(req:NextRequest) {
  const { amount, currency_from, currency_to } = await req.json();

  try {
    const response = await axios.get(`https://api.nowpayments.io/v1/estimate?amount=${amount}&currency_from=${currency_from}&currency_to=${currency_to}`, {
      headers: { 'x-api-key': process.env.NOWPAYMENTS_API_KEY },
    });

    return new Response(JSON.stringify(response.data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error }), { status: 500 });
  }
}