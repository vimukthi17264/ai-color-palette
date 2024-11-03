// Pricing.tsx

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle, CardHeader, CardDescription, CardFooter } from "@/components/ui/card"

export default function Pricing() {
  return (
    <div className="container mx-auto p-6 space-y-12">
      
      <h1 className="text-4xl font-bold text-center mb-8">Buy Credits</h1>
      
      {/* Pricing Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        
        {/* Basic Pack */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Starter Pack</CardTitle>
            <CardDescription >Perfect for light users</CardDescription>
          </CardHeader>
          <CardContent >
            <p className="text-3xl font-bold mb-4">$5 for 50 Credits</p>
            <ul className="space-y-1">
              <li>✔️ Access to essential data features</li>
              <li>✔️ Up to 50 data generation requests</li>
              <li>✔️ Community support</li>
            </ul>
          </CardContent>
          <CardFooter>            
            <Button>Buy Credits</Button>
          </CardFooter>
        </Card>

        {/* Pro Pack */}
        <Card className="bg-purple-950/30">
          <CardHeader >
            <CardTitle className="text-2xl font-bold">Pro Pack</CardTitle>
            <CardDescription >For regular users and small teams</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold mb-4">$20 for 250 Credits</p>
            <ul className="space-y-1">
              <li>✔️ Full access to data features</li>
              <li>✔️ Up to 250 data generation requests</li>
              <li>✔️ Priority support</li>
            </ul>
          </CardContent>
          <CardFooter>
          <Button>Buy Credits</Button>
          </CardFooter>
        </Card>

        {/* Enterprise Pack */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Enterprise Pack</CardTitle>
            <CardDescription>For businesses and high-volume users</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold mb-4">$100 for 1500 Credits</p>
            <ul className="space-y-1">
              <li>✔️ Unlimited data access</li>
              <li>✔️ Up to 1500 data generation requests</li>
              <li>✔️ Dedicated account manager</li>
            </ul>
          </CardContent>
          <CardFooter>
          <Button>Contact Sales</Button>
          </CardFooter>
        </Card>

      </div>
    </div>
  )
}