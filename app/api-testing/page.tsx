"use client";
import { useState } from "react";

export default function TestPaymentPage() {
  const [status, setStatus] = useState(null);
  const [availableCurrencies, setAvailableCurrencies] = useState([]);
  const [amount, setAmount] = useState(10);
  const [currencyFrom, setCurrencyFrom] = useState("USD");
  const [currencyTo, setCurrencyTo] = useState("BTC");
  const [minimumAmount, setMinimumAmount] = useState(null);
  const [estimatedAmount, setEstimatedAmount] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [paymentId, setPaymentId] = useState(null);

  // Helper functions to call each API route
  async function checkApiStatus() {
    try {
      const res = await fetch("/api/nowpayments/status");
      const data = await res.json();
      setStatus(data);
    } catch (error) {
      console.error("Error checking API status:", error);
    }
  }

  async function fetchMinimumPayment() {
    try {
      const res = await fetch("/api/nowpayments/minimum-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from_currency: currencyFrom, to_currency: currencyTo }),
      });
      const data = await res.json();
      setMinimumAmount(data.min_amount);
    } catch (error) {
      console.error("Error fetching minimum payment:", error);
    }
  }

  async function fetchEstimatePrice() {
    try {
      const res = await fetch("/api/nowpayments/estimate-price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, currency_from: currencyFrom, currency_to: currencyTo }),
      });
      const data = await res.json();
      setEstimatedAmount(data.estimated_amount);
    } catch (error) {
      console.error("Error fetching estimated price:", error);
    }
  }

  async function createPayment() {
    try {
      const res = await fetch("/api/nowpayments/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          currency_from: currencyFrom,
          currency_to: currencyTo,
          order_id: `order_${Date.now()}`,
          success_url: "https://yourdomain.com/success",
          ipn_callback_url: "https://yourdomain.com/api/nowpayments/ipn",
        }),
      });
      const data = await res.json();
      setPaymentData(data);
      setPaymentId(data.payment_id);
    } catch (error) {
      console.error("Error creating payment:", error);
    }
  }

  async function checkPaymentStatus() {
    try {
      if (!paymentId) return alert("No payment ID to check status for.");
      
      const res = await fetch("/api/nowpayments/payment-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payment_id: paymentId }),
      });
      const data = await res.json();
      setStatus(data);
    } catch (error) {
      console.error("Error checking payment status:", error);
    }
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>NowPayments API Testing Page</h1>

      <section>
        <h2>1. Check API Status</h2>
        <button onClick={checkApiStatus}>Check API Status</button>
        {status && (
          <pre>{JSON.stringify(status, null, 2)}</pre>
        )}
      </section>

      <section>
        <h2>2. Set Amount and Select Currencies</h2>
        <div>
          <label>Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </div>
        <div>
          <label>Currency From:</label>
          <input
            type="text"
            value={currencyFrom}
            onChange={(e) => setCurrencyFrom(e.target.value.toUpperCase())}
          />
        </div>
        <div>
          <label>Currency To:</label>
          <input
            type="text"
            value={currencyTo}
            onChange={(e) => setCurrencyTo(e.target.value.toUpperCase())}
          />
        </div>
      </section>

      <section>
        <h2>3. Get Minimum Payment Amount</h2>
        <button onClick={fetchMinimumPayment}>Get Minimum Payment</button>
        {minimumAmount && (
          <p>Minimum Payment: {minimumAmount} {currencyTo}</p>
        )}
      </section>

      <section>
        <h2>4. Get Estimated Price</h2>
        <button onClick={fetchEstimatePrice}>Get Estimated Price</button>
        {estimatedAmount && (
          <p>Estimated Price: {estimatedAmount} {currencyTo}</p>
        )}
      </section>

      <section>
        <h2>5. Create Payment</h2>
        <button onClick={createPayment}>Create Payment</button>
        {paymentData && (
          <div>
            <p>Payment Created:</p>
            <pre>{JSON.stringify(paymentData, null, 2)}</pre>
            {paymentData.invoice_url && (
              <a href={paymentData.invoice_url} target="_blank" rel="noopener noreferrer">
                Go to Invoice
              </a>
            )}
          </div>
        )}
      </section>

      <section>
        <h2>6. Check Payment Status</h2>
        <button onClick={checkPaymentStatus}>Check Payment Status</button>
        {status && (
          <pre>{JSON.stringify(status, null, 2)}</pre>
        )}
      </section>
    </div>
  );
}