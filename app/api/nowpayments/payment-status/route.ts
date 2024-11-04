// app/api/nowpayments/payment-status/route.js
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { payment_id } = await req.json();

  // Check if we're in development mode or if we're using a mock environment variable
  const isMockMode = process.env.NEXT_PUBLIC_MOCK_NOWPAYMENTS === 'true';

  if (isMockMode) {
    console.log('Runnning on Moke mode')
    // Mock data to simulate a successful response from NOWPayments
    const mockResponse = {
      payment_id: payment_id,
      payment_status: 'confirmed',
      pay_amount: '0.0025',
      pay_currency: 'BTC',
      price_amount: '100',
      price_currency: 'USD',
      created_at: new Date().toISOString(),
    };

    return new NextResponse(JSON.stringify(mockResponse), { status: 200 });
  }

  // Real API call when not in mock mode
  console.log('Running in Real mode')
  try {
    const response = await axios.get(`https://api.nowpayments.io/v1/payment/${payment_id}`, {
      headers: { 'x-api-key': process.env.NOWPAYMENTS_API_KEY },
    });

    return new NextResponse(JSON.stringify(response.data), { status: 200 });
  } catch (error) {
    console.error('Error fetching payment status:', error);

    function isAxiosError(error: any): error is { response: { data: { message: string } } } {
      return error.response && error.response.data && typeof error.response.data.message === 'string';
    }

    const errorMessage = isAxiosError(error) ? error.response.data.message : 'Failed to fetch payment status'; return new NextResponse(JSON.stringify({ error: errorMessage }), { status: 500 });
  }
}