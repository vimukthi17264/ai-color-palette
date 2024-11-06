'use client'

import * as React from "react"
import { Bitcoin, CreditCard, Loader2, RefreshCw, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface CreditPackage {
  name: string
  credits: number
  price: number
  description: string
  features: string[]
}

const creditPackages: CreditPackage[] = [
  {
    name: "Starter",
    credits: 100,
    price: 9.99,
    description: "Perfect for beginners",
    features: ["Basic data access", "Email support", "7-day history"]
  },
  {
    name: "Pro",
    credits: 500,
    price: 39.99,
    description: "For regular users",
    features: ["Full data access", "Priority email support", "30-day history"]
  },
  {
    name: "Business",
    credits: 2000,
    price: 149.99,
    description: "Ideal for small teams",
    features: ["Advanced analytics", "Phone support", "90-day history"]
  },
  {
    name: "Enterprise",
    credits: 5000,
    price: 299.99,
    description: "For large organizations",
    features: ["Custom solutions", "Dedicated account manager", "Unlimited history"]
  },
  {
    name: "Ultimate",
    credits: 10000,
    price: 499.99,
    description: "Unlimited possibilities",
    features: ["All features included", "24/7 premium support", "API access"]
  }
]

interface PaymentStatus {
  status: 'waiting' | 'pending' | 'confirming' | 'confirmed' | 'failed'
  address?: string
  amount?: string
  currency?: string
}

export default function CreditPackages() {
  const [selectedPackage, setSelectedPackage] = React.useState<CreditPackage | null>(null)
  const [paymentDialogOpen, setPaymentDialogOpen] = React.useState(false)
  const [availableCurrencies, setAvailableCurrencies] = React.useState<
    { currency: string; min_amount: number; max_amount: number }[]
  >([])
  const [selectedCurrency, setSelectedCurrency] = React.useState<string>("")
  const [paymentStatus, setPaymentStatus] = React.useState<PaymentStatus | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const { toast } = useToast()

  React.useEffect(() => {
    fetchAvailableCurrencies()
  }, [])

  const fetchAvailableCurrencies = async () => {
    try {
      const response = await fetch('/api/nowpayments/currencies')
      if (!response.ok) {
        throw new Error('Failed to fetch currencies')
      }
      const data = await response.json()
      setAvailableCurrencies(data.currencies)
      if (data.currencies.length > 0) {
        setSelectedCurrency(data.currencies[0].currency)
      }
    } catch (error) {
      console.error('Error fetching currencies:', error)
      toast({
        title: "Error",
        description: "Failed to load available cryptocurrencies",
        variant: "destructive",
      })
    }
  }

  const handlePurchase = (pkg: CreditPackage) => {
    setSelectedPackage(pkg)
    setPaymentDialogOpen(true)
  }

  const initiatePayment = async () => {
    if (!selectedPackage || !selectedCurrency) return;
  
    setIsLoading(true);
    try {
      const response = await fetch('/api/nowpayments/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: selectedPackage.price,
          currency_from: 'USD',
          currency_to: selectedCurrency,
          order_id: `order_${Date.now()}`,
          success_url: `${window.location.origin}/payment-success`,
          ipn_callback_url: `https://bqqyvtionavtgtzrdmrp.supabase.co/functions/v1/ipn-callback`
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create payment');
      }

      const data = await response.json();
  
      setPaymentStatus({
        status: 'waiting',
        address: data.pay_address,
        amount: data.pay_amount,
        currency: selectedCurrency,
      });
  
      pollPaymentStatus(data.payment_id);
    } catch (error) {
      console.error('Error creating payment:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const pollPaymentStatus = async (paymentId: string) => {
    const checkStatus = async () => {
      try {
        const response = await fetch('/api/nowpayments/payment-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ payment_id: paymentId }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch payment status');
        }

        const data = await response.json();

        setPaymentStatus(prev => ({
          ...prev!,
          status: data.payment_status,
        }));

        if (['confirmed', 'failed'].includes(data.payment_status)) {
          if (data.payment_status === 'confirmed') {
            toast({
              title: "Success",
              description: `Payment confirmed! ${selectedPackage?.credits} credits have been added to your account.`,
            });
            setPaymentDialogOpen(false);
          } else {
            toast({
              title: "Payment Failed",
              description: "Your payment has failed. Please try again.",
              variant: "destructive",
            });
          }
          return;
        }

        setTimeout(checkStatus, 5000);
      } catch (error) {
        console.error('Error checking payment status:', error);
        toast({
          title: "Error",
          description: "Failed to check payment status. Please contact support.",
          variant: "destructive",
        });
      }
    };

    checkStatus();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-12">Choose Your Credit Package</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {creditPackages.map((pkg, index) => (
          <Card key={index} className={index === 2 ? "md:col-span-2 lg:col-span-1" : ""}>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">{pkg.name}</CardTitle>
              <CardDescription>{pkg.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold mb-4">${pkg.price}</p>
              <p className="text-lg mb-4">{pkg.credits} Credits</p>
              <ul className="space-y-2">
                {pkg.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => handlePurchase(pkg)}>
                Buy Now
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Purchase {selectedPackage?.credits} Credits</DialogTitle>
            <DialogDescription>
              {!paymentStatus ? (
                "Select your preferred cryptocurrency for payment"
              ) : (
                "Complete your payment by sending the exact amount to the address below"
              )}
            </DialogDescription>
          </DialogHeader>

          {!paymentStatus ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Cryptocurrency</label>
                <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select cryptocurrency" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCurrencies.map((currency) => (
                      <SelectItem key={currency.currency} value={currency.currency}>
                        {currency.currency.toUpperCase()} (Min: {currency.min_amount}, Max: {currency.max_amount})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter>
                <Button
                  className="w-full"
                  onClick={initiatePayment}
                  disabled={isLoading || !selectedCurrency}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Payment...
                    </>
                  ) : (
                    <>
                      <Bitcoin className="mr-2 h-4 w-4" />
                      Pay with {selectedCurrency.toUpperCase()}
                    </>
                  )}
                </Button>
              </DialogFooter>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Amount:</span>
                  <span>{paymentStatus.amount} {paymentStatus.currency?.toUpperCase()}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-medium">Send to address:</span>
                  <code className="block p-2 bg-background rounded border text-sm break-all">
                    {paymentStatus.address}
                  </code>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm">
                <RefreshCw className="h-4 w-4 animate-spin" />
                {paymentStatus.status === 'waiting' && "Waiting for payment..."}
                {paymentStatus.status === 'pending' && "Payment detected, waiting for confirmation..."}
                {paymentStatus.status === 'confirming' && "Confirming transaction..."}
                {paymentStatus.status === 'confirmed' && "Payment confirmed!"}
                {paymentStatus.status === 'failed' && "Payment failed. Please try again."}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}