import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req:NextRequest) {
  const apiKey = process.env.NOWPAYMENTS_API_KEY;  // Store your API key in environment variables for security
  
  try {
    const response = await axios({
      method: 'get',
      url: 'https://api.nowpayments.io/v1/currencies?fixed_rate=true',
      headers: {
        'x-api-key': apiKey,
      },
      maxBodyLength: Infinity,
    });

    // Return the response data
    return new NextResponse(JSON.stringify(response.data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    
    // Return an error response
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch currencies' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}