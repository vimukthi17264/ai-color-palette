'use client'

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { CheckIcon, ArrowRightIcon } from "@radix-ui/react-icons"
import { NavbarSwitcherComponent } from "./navbar-switcher"

interface CreditPackage {
  id: string
  name: string
  credits: number
  price: number
  popular?: boolean
}

const creditPackages: CreditPackage[] = [
  { id: "a57b2c6e-9507-48a0-a618-7e131c241071", name: "Starter", credits: 200, price: 20.00 },
  { id: "62322b2e-2504-4450-abeb-f5a0c7e53ce4", name: "Pro", credits: 500, price: 40.00, popular: true },
  { id: "3019b250-69cc-4b2a-9af1-274d2b79f509", name: "Enterprise", credits: 5000, price: 300.00 },
]

const features = [
  "Full data access",
  "Priority support",
  "Unlimited history",
  "Advanced analytics",
  "Custom solutions"
]

const faqs = [
  {
    question: "How do credits work?",
    answer: "Credits are used to access our services. Each action or query consumes a certain number of credits, allowing you to manage your usage effectively."
  },
  {
    question: "Can I upgrade my plan?",
    answer: "Yes, you can upgrade your plan at any time. Your unused credits will be transferred to your new plan."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept various cryptocurrencies including Bitcoin (BTC), Ethereum (ETH), Litecoin (LTC), and USD Coin (USDC)."
  },
  {
    question: "Are there any refunds?",
    answer: "Due to the nature of digital credits, we do not offer refunds. However, we're happy to assist you in making the most of your credits."
  }
]

export function PricingPageComponent() {
  const renderPackageCard = (pkg: CreditPackage) => (
    <Card key={pkg.id} className={`flex flex-col justify-between transition-all duration-300 hover:shadow-lg ${pkg.popular ? 'border-primary' : ''}`}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">{pkg.name}</CardTitle>
          {pkg.popular && <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>}
        </div>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-5xl font-extrabold mb-2">${pkg.price}</p>
        <p className="text-lg mb-4 text-blue-500">{pkg.credits.toLocaleString()} Credits</p>
        <Progress value={(pkg.credits / 5000) * 100} className="mb-6" />
        <ul className="text-sm text-left space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <CheckIcon className="w-5 h-5 mr-2 text-primary" />
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button className="w-full text-lg" asChild>
          <Link href={`/pricing/${pkg.id}`}>
            Choose {pkg.name}
            <ArrowRightIcon className="w-5 h-5 ml-2" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )

  return (
    <>
      <NavbarSwitcherComponent />
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-5xl font-extrabold text-center mb-4">Choose Your Perfect Plan</h1>
        <p className="text-xl text-center text-muted-foreground mb-12">Unlock the power of our platform with the right package for your needs</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {creditPackages.map(renderPackageCard)}
        </div>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">All Plans Include</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-center bg-muted p-6 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md">
                <div className="bg-primary rounded-full p-2 mr-4">
                  <CheckIcon className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="text-lg font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger className="text-left text-lg font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </div>
    </>
  )
}