'use client'

import * as React from "react"
import { Download, Loader2, Plus, Send, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export default function TableGenerator() {
  const [showInitial, setShowInitial] = React.useState(true)
  const [headers, setHeaders] = React.useState<string[]>([])
  const [newHeader, setNewHeader] = React.useState("")
  const [rowCount, setRowCount] = React.useState(5)
  const [tableData, setTableData] = React.useState<any[][]>([])
  const [prompt, setPrompt] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const { toast } = useToast()

  const addHeader = () => {
    if (newHeader.trim()) {
      setHeaders([...headers, newHeader])
      setNewHeader("")
    }
  }

  const handleGenerateTable = async () => {
    setIsLoading(true)
    try {
      // Sample fetch to imitate async generation process
      const response = await fetch('/api/generate-table', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ headers, rowCount, prompt })
      });
      if (!response.ok) throw new Error("Failed to generate table data")

      const data = await response.json()
      setTableData(data.rows)
      toast({
        title: "Table generated successfully",
        description: `${data.rows.length} rows have been created based on your input.`
      })
    } catch (error) {
      console.error("Generation error:", error)
      toast({
        title: "Error generating table",
        description: "Failed to generate table data. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-900 font-sans">
      <header className="flex h-16 items-center justify-between border-b border-gray-200 px-6 bg-white">
        <div className="flex items-center gap-6">
          <span className="text-2xl font-bold text-black">Table Generator</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm">Sign In</Button>
          <Button className="bg-black text-white">Sign Up</Button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 space-y-8">
        {tableData.length === 0 ? (
          <div className="container mx-auto flex flex-col items-center space-y-8 max-w-4xl">
            <h1 className="text-center text-4xl font-bold text-gray-800">Build Your Custom Table</h1>
            <form className="w-full space-y-4" onSubmit={(e) => { e.preventDefault(); handleGenerateTable() }}>
              <Textarea
                className="min-h-[120px] resize-none p-4 pr-12 rounded-2xl border-gray-300 focus:border-blue-500 focus:ring-blue-200 transition"
                placeholder="Enter table description..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <Button
                className="w-full bg-black hover:bg-gray-900 text-white font-semibold py-2 transition"
                type="submit"
                disabled={isLoading || !prompt}
              >
                {isLoading ? "Generating..." : "Generate Table"}
              </Button>
            </form>
          </div>
        ) : (
          <div className="container mx-auto max-w-4xl mt-12 space-y-8">
            <Button
              variant="outline"
              onClick={() => setShowInitial(true)}
              className="rounded-full text-black border-black hover:bg-gray-100"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Table
            </Button>

            <Card className="w-full">
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      {headers.map((header, idx) => (
                        <TableHead key={idx}>{header}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tableData.map((row, idx) => (
                      <TableRow key={idx}>
                        {row.map((cell, cellIdx) => (
                          <TableCell key={cellIdx}>{cell}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <footer className="border-t border-gray-200 py-6 bg-white">
        <div className="container mx-auto flex items-center justify-center text-sm text-gray-600">
          <a href="#" className="hover:text-black transition-colors">FAQ</a>
          <a href="#" className="hover:text-black transition-colors">Terms</a>
          <a href="#" className="hover:text-black transition-colors">Privacy</a>
        </div>
      </footer>
    </div>
  )
}
