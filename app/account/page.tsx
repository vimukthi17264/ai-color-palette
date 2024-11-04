"use client";
import { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

// Define an interface for the payment history items
interface Payment {
    payment_id: string;
    amount: string;
    currency_from: string;
    currency_to: string;
    status: string;
    created_at: string;
}

export default function AccountPage() {
    const [paymentHistory, setPaymentHistory] = useState<Payment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Mock data for demonstration; replace with actual API call in a real application
    const mockPaymentHistory: Payment[] = [
        {
            payment_id: "123456",
            amount: "100",
            currency_from: "USD",
            currency_to: "BTC",
            status: "completed",
            created_at: "2024-10-01T12:00:00Z",
        },
        {
            payment_id: "789012",
            amount: "250",
            currency_from: "USD",
            currency_to: "ETH",
            status: "pending",
            created_at: "2024-10-10T08:30:00Z",
        },
        {
            payment_id: "345678",
            amount: "50",
            currency_from: "USD",
            currency_to: "DOGE",
            status: "failed",
            created_at: "2024-10-15T17:45:00Z",
        },
    ];

    // Fetch payment history from the API
    useEffect(() => {
        async function fetchPaymentHistory() {
            try {
                setLoading(true);

                // Uncomment below to use actual API data
                /*
                const response = await fetch("/api/nowpayments/list-payments");
                if (!response.ok) throw new Error("Failed to fetch payment history");
                const data = await response.json();
                setPaymentHistory(data.payments);
                */

                // Mock data for demonstration
                setPaymentHistory(mockPaymentHistory);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Unknown error");
            } finally {
                setLoading(false);
            }
        }

        fetchPaymentHistory();
    }, []);

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h1>Account Page</h1>
            <h2>Payment History</h2>

            {loading && <p>Loading payment history...</p>}
            {error && <p style={{ color: "red" }}>Error: {error}</p>}
            {paymentHistory.length === 0 && !loading && <p>No payment history available.</p>}

            {paymentHistory.length > 0 && (
                <Table>
                    <TableCaption>A list of your recent invoices.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>From</TableHead>
                            <TableHead>To</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paymentHistory.map((payment) => (
                            <TableRow key={payment.payment_id}> {/* Add a unique key here */}
                                <TableCell>{payment.payment_id}</TableCell>
                                <TableCell>{payment.amount}</TableCell>
                                <TableCell>{payment.currency_from}</TableCell>
                                <TableCell>{payment.currency_to}</TableCell>
                                <TableCell>{payment.created_at}</TableCell>
                                <TableCell style={{ color: getStatusColor(payment.status) }}>{payment.status}</TableCell> {/* Optional: Set status color */}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    );
}

// Helper functions
function capitalize(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getStatusColor(status: string): string {
    switch (status) {
        case "completed":
            return "green";
        case "pending":
            return "orange";
        case "failed":
            return "red";
        default:
            return "black";
    }
}