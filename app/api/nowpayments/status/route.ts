// app/api/nowpayments/status/route.js
import axios from 'axios';

export async function GET() {
  try {
    const response = await axios.get('https://api.nowpayments.io/v1/status', {
      headers: { 'x-api-key': process.env.NOWPAYMENTS_API_KEY },
    });

    return new Response(JSON.stringify(response.data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error}), { status: 500 });
  }
}