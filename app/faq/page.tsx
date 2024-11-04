// FAQSection.tsx

import * as React from "react"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"

export default function FAQSection() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <h2 className="text-3xl font-bold text-left mb-16">Frequently Asked Questions</h2>
      <Accordion type="single" collapsible className="space-y-4">
        

      <AccordionItem value="q4">
          <AccordionTrigger>
            What is this tool?
          </AccordionTrigger>
          <AccordionContent>
            You can generate Any type of Table. details about Movies, Games, Bacteria, You name it. Simply put the headers, how much and describe what you want.
          </AccordionContent>
        </AccordionItem>
        {/* FAQ Item 1 */}
        <AccordionItem value="q1">
          <AccordionTrigger>
            How do I buy credits?
          </AccordionTrigger>
          <AccordionContent>
            To buy credits, simply go to the “Buy Credits” section, select the amount you need, and proceed to checkout. You can pay with major credit cards or PayPal, and credits will be added to your account instantly after payment.
          </AccordionContent>
        </AccordionItem>

        {/* FAQ Item 2 */}
        <AccordionItem value="q2">
          <AccordionTrigger>
            Are the credits refundable?
          </AccordionTrigger>
          <AccordionContent >
            Purchased credits are non-refundable. However, they never expire, so you can use them at any time. If you encounter an issue with your purchase, please contact our support team, and we’ll be happy to assist you.
          </AccordionContent>
        </AccordionItem>

        {/* FAQ Item 3 */}
        <AccordionItem value="q3">
          <AccordionTrigger >
            Can I upgrade my credit package later?
          </AccordionTrigger>
          <AccordionContent >
            Yes, you can purchase additional credits at any time. Simply go to the “Buy Credits” page and choose the package that suits your needs. Your total credits will be updated instantly after purchase.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </main>
  )
}