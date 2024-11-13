// app/api/nowpayments/payment-status/route.ts
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { payment_id } = await req.json();

  const isMockMode = process.env.NEXT_PUBLIC_MOCK_NOWPAYMENTS === 'true';

  if (isMockMode) {
    console.log('Running in Mock mode');
    const mockResponse = {
      payment_id: payment_id,
      payment_status: 'confirming',
      pay_amount: '0.0025',
      pay_currency: 'BTC',
      price_amount: '100',
      price_currency: 'USD',
      created_at: new Date().toISOString(),
    };

    return NextResponse.json(mockResponse);
  }

  console.log('Running in Real mode');
  try {
    const response = await axios.get(`https://api.nowpayments.io/v1/payment/${payment_id}`, {
      headers: { 'x-api-key': process.env.NOWPAYMENTS_API_KEY },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching payment status:', error);

    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.json({ error: error.response.data.message }, { status: error.response.status });
    }

    return NextResponse.json({ error: 'Failed to fetch payment status' }, { status: 500 });
  }
}