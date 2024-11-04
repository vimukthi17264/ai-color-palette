'use client'

import * as React from "react"
import { Bitcoin, CreditCard, Loader2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface PricingTier {
  name: string
  description: string
  price: number
  credits: number
  features: string[]
  highlighted?: boolean
}

const pricingTiers: PricingTier[] = [
  {
    name: "Starter Pack",
    description: "Perfect for light users",
    price: 5,
    credits: 50,
    features: [
      "Access to essential data features",
      "Up to 50 data generation requests",
      "Community support",
    ],
  },
  {
    name: "Pro Pack",
    description: "For regular users and small teams",
    price: 20,
    credits: 250,
    features: [
      "Full access to data features",
      "Up to 250 data generation requests",
      "Priority support",
    ],
    highlighted: true,
  },
  {
    name: "Enterprise Pack",
    description: "For businesses and high-volume users",
    price: 100,
    credits: 1500,
    features: [
      "Unlimited data access",
      "Up to 1500 data generation requests",
      "Dedicated account manager",
    ],
  },
]

interface PaymentStatus {
  status: 'waiting' | 'pending' | 'confirming' | 'confirmed' | 'failed'
  address?: string
  amount?: string
  currency?: string
}

export function PricingComponent() {
  const [selectedTier, setSelectedTier] = React.useState<PricingTier | null>(null)
  const [paymentDialogOpen, setPaymentDialogOpen] = React.useState(false)
  const [availableCurrencies, setAvailableCurrencies] = React.useState<string[]>([])
  const [selectedCurrency, setSelectedCurrency] = React.useState<string>("")
  const [paymentStatus, setPaymentStatus] = React.useState<PaymentStatus | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const { toast } = useToast()

  // Fetch available currencies on component mount
  React.useEffect(() => {
    fetchAvailableCurrencies()
  }, [])

  const fetchAvailableCurrencies = async () => {
    try {
      const response = await fetch('/api/crypto/currencies')
      const data = await response.json()
      setAvailableCurrencies(data.currencies)
      if (data.currencies.length > 0) {
        setSelectedCurrency(data.currencies[0])
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

  const handlePurchase = async (tier: PricingTier) => {
    setSelectedTier(tier)
    setPaymentDialogOpen(true)
  }

  const initiatePayment = async () => {
    if (!selectedTier || !selectedCurrency) return

    setIsLoading(true)
    try {
      // Create payment using NOWPayments API
      const response = await fetch('/api/crypto/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          price: selectedTier.price,
          currency: selectedCurrency,
        }),
      })

      const data = await response.json()
      
      if (!response.ok) throw new Error(data.message)

      setPaymentStatus({
        status: 'waiting',
        address: data.pay_address,
        amount: data.pay_amount,
        currency: selectedCurrency,
      })

      // Start polling for payment status
      pollPaymentStatus(data.payment_id)
    } catch (error) {
      console.error('Error creating payment:', error)
      toast({
        title: "Error",
        description: "Failed to create payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const pollPaymentStatus = async (paymentId: string) => {
    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/crypto/payment-status/${paymentId}`)
        const data = await response.json()

        setPaymentStatus(prev => ({
          ...prev!,
          status: data.payment_status,
        }))

        if (['confirmed', 'failed'].includes(data.payment_status)) {
          if (data.payment_status === 'confirmed') {
            toast({
              title: "Success",
              description: "Payment confirmed! Credits have been added to your account.",
            })
            setPaymentDialogOpen(false)
          }
          return
        }

        // Continue polling if payment is not confirmed or failed
        setTimeout(checkStatus, 5000)
      } catch (error) {
        console.error('Error checking payment status:', error)
      }
    }

    checkStatus()
  }

  return (
    <>
      <div className="container mx-auto p-6 space-y-12">
        <h1 className="text-4xl font-bold text-center mb-8">Buy Credits</h1>
        
        <div className="grid gap-6 md:grid-cols-3">
          {pricingTiers.map((tier) => (
            <Card
              key={tier.name}
              className={tier.highlighted ? "bg-purple-950/30" : ""}
            >
              <CardHeader>
                <CardTitle className="text-2xl font-bold">{tier.name}</CardTitle>
                <CardDescription>{tier.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold mb-4">
                  ${tier.price} for {tier.credits} Credits
                </p>
                <ul className="space-y-1">
                  {tier.features.map((feature, index) => (
                    <li key={index}>✔️ {feature}</li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full"
                  onClick={() => handlePurchase(tier)}
                >
                  {tier.name === "Enterprise Pack" ? "Contact Sales" : "Buy Credits"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Purchase Credits</DialogTitle>
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
                      <SelectItem key={currency} value={currency}>
                        {currency.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
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
                    Continue with {selectedCurrency.toUpperCase()}
                  </>
                )}
              </Button>
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
    </>
  )
}