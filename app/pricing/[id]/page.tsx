'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState, useCallback, useRef } from 'react'
import { ArrowLeft, Check, Loader2, Bitcoin, RefreshCw, X, Copy } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useToast } from '@/hooks/use-toast'
import { createClient } from '@/utils/supabase/client'
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
import { QRCodeCanvas } from 'qrcode.react'

interface PricingTier {
  id: string
  name: string
  description: string
  price: number
  credits: number
  features: string[]
  highlighted: boolean
}

interface PaymentStatus {
  status: 'waiting' | 'pending' | 'confirming' | 'confirmed' | 'failed'
  address?: string
  amount?: string
  currency?: string
  qrAdress?: string
}

export default function PricingDetails() {
  const supabase = createClient()
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const { toast } = useToast()
  const [tier, setTier] = useState<PricingTier | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
  const [availableCurrencies, setAvailableCurrencies] = useState<string[]>(['BTC', 'ETH', 'LTC', 'USDT'])
  const [selectedCurrency, setSelectedCurrency] = useState<string>("")
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null)
  const [isPaymentLoading, setIsPaymentLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState(900) // 15 minutes in seconds
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const pollCountRef = useRef(0)
  const [qrcurency, setQrCurency] = useState<string>("")

  const QrSetCurecncy = (selectedCurrency: string) => {
    switch (selectedCurrency) {
      case 'BTC':
        setQrCurency('bitcoin')
        break;
      case 'ETH':
        setQrCurency('ethereum')
        break;
      case 'LTC':
        setQrCurency('litcoin')
        break;
      case 'USDT':
        setQrCurency('tether')
      default:
        break;
    }
  }
  const fetchTierDetails = useCallback(async () => {
    if (!params.id) return

    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('pricing_tiers')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) throw error

      if (!data) throw new Error('No data returned from the query')

      setTier({
        id: data.id,
        name: data.name,
        description: data.description,
        price: parseFloat(data.price),
        credits: data.credits,
        features: Array.isArray(data.features) ? data.features : JSON.parse(data.features),
        highlighted: data.highlighted,
      })
    } catch (error) {
      console.error('Error in fetchTierDetails:', error)
      toast({
        title: "Error",
        description: "Failed to load pricing tier details. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [params.id, supabase, toast])

  useEffect(() => {
    fetchTierDetails()
  }, [fetchTierDetails])

  const handlePurchase = () => {
    setPaymentDialogOpen(true)
    setSelectedCurrency(availableCurrencies[0])
    QrSetCurecncy(selectedCurrency)
  }

  const initiatePayment = async () => {
    if (!tier || !selectedCurrency) return

    setIsPaymentLoading(true)

    const amount = tier.price
    const currency_from = "USD"
    const currency_to = selectedCurrency
    const order_id = `order-${Date.now()}`
    const success_url = `${window.location.origin}/payment-success`
    const ipn_callback_url = `${window.location.origin}/api/nowpayments/ipn-callback`

    try {
      const response = await fetch('/api/nowpayments/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          currency_from,
          currency_to,
          order_id,
          success_url,
          ipn_callback_url,
        }),
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.message)

      setPaymentStatus({
        status: 'waiting',
        address: data.pay_address,
        amount: data.pay_amount,
        currency: selectedCurrency,
        qrAdress: `${qrcurency}:${data.pay_address}?amount=${data.pay_amount}&currency=${data.pay_currency}`
      })

      pollPaymentStatus(data.payment_id)
      startCountdown()
    } catch (error) {
      console.error('Error creating payment:', error)
      toast({
        title: "Error",
        description: "Failed to create payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsPaymentLoading(false)
    }
  }

  const pollPaymentStatus = useCallback(async (paymentId: string) => {
    const checkStatus = async () => {
      try {
        const response = await fetch('/api/nowpayments/payment-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ payment_id: paymentId }),
        })
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
          } else {
            toast({
              title: "Payment Failed",
              description: "Your payment could not be processed. Please try again.",
              variant: "destructive",
            })
          }
          clearInterval(pollIntervalRef.current!)
          return
        }

        pollCountRef.current += 1
        if (pollCountRef.current >= 60) { // Stop polling after 5 minutes (60 * 5 seconds)
          clearInterval(pollIntervalRef.current!)
          setPaymentStatus(prev => ({ ...prev!, status: 'failed' }))
          toast({
            title: "Payment Timeout",
            description: "The payment process has timed out. Please try again.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error('Error checking payment status:', error)
      }
    }

    pollIntervalRef.current = setInterval(checkStatus, 5000)
  }, [toast])

  const startCountdown = () => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer)
          return 0
        }
        return prevTime - 1
      })
    }, 1000)
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: "Payment address copied to clipboard.",
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!tier) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Pricing Tier Not Found</h1>
        <p className="mb-8">The requested pricing tier could not be found.</p>
        <Button onClick={() => router.push('/pricing')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Pricing
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <Button variant="ghost" onClick={() => router.push('/pricing')} className="mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Pricing
      </Button>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-3xl font-bold">{tier.name}</CardTitle>
            {tier.highlighted && <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>}
          </div>
          <CardDescription className="text-lg">{tier.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p className="text-5xl font-extrabold">${tier.price.toFixed(2)}</p>
            <p className="text-xl text-muted-foreground mt-2">{tier.credits.toLocaleString()} Credits</p>
          </div>
          <Progress value={(tier.credits / 1500) * 100} className="w-full" />
          <div>
            <h3 className="text-xl font-semibold mb-4">Features</h3>
            <ul className="space-y-3">
              {tier.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="w-5 h-5 mr-2 text-primary flex-shrink-0 mt-1" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handlePurchase} className="w-full text-lg py-6">
            Choose {tier.name}
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Purchase {tier.credits} Credits</DialogTitle>
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
                disabled={isPaymentLoading || !selectedCurrency}
              >
                {isPaymentLoading ? (
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
                  <span className="font-bold">{paymentStatus.amount} {paymentStatus.currency?.toUpperCase()}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-medium">Send to address:</span>
                  <div className="flex items-center space-x-2">
                    <code className="block p-2 bg-background rounded border text-sm break-all flex-grow">
                      {paymentStatus.address}
                    </code>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => copyToClipboard(paymentStatus.address!)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="mt-4 flex justify-center bg-white rounded-lg">
                  <QRCodeCanvas className='m-4' value={paymentStatus.qrAdress!} size={128} />
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm font-medium">
                {paymentStatus.status === 'waiting' && <RefreshCw className="h-4 w-4 animate-spin" />}
                {paymentStatus.status === 'pending' && <Loader2 className="h-4 w-4 animate-spin" />}
                {paymentStatus.status === 'confirming' && <Loader2 className="h-4 w-4 animate-spin" />}
                {paymentStatus.status === 'confirmed' && <Check className="h-4 w-4 text-green-500" />}
                {paymentStatus.status === 'failed' && <X className="h-4 w-4 text-red-500" />}
                <span>
                  {paymentStatus.status === 'waiting' && "Waiting for payment..."}
                  {paymentStatus.status === 'pending' && "Payment detected, waiting for confirmation..."}
                  {paymentStatus.status === 'confirming' && "Confirming transaction..."}
                  {paymentStatus.status === 'confirmed' && "Payment confirmed!"}
                  {paymentStatus.status === 'failed' && "Payment failed. Please try again."}
                </span>
              </div>

              <div className="text-center text-sm font-medium">
                Time remaining: {formatTime(timeLeft)}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}