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

export default function Tablegenerator() {
  const [showInitial, setShowInitial] = React.useState(true)
  const [headers, setHeaders] = React.useState<string[]>([])
  const [newHeader, setNewHeader] = React.useState("")
  const [rowCount, setRowCount] = React.useState(5)
  const [tableData, setTableData] = React.useState<any[][]>([])
  const [prompt, setPrompt] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
 const {toast} = useToast()

  const addHeader = () => {
    if (newHeader.trim()) {
      setHeaders([...headers, newHeader.trim()])
      setNewHeader("")
    }
  }

  const removeHeader = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index))
  }

  const generateTable = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/generate-table', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ headers, rowCount, prompt }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate table')
      }

      const data = await response.json()
      setTableData(data)
      setShowInitial(false)
    } catch (error) {
      console.error('Error generating table:', error)
      toast({
        title: "Error",
        description: "Failed to generate table. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const exportData = () => {
    const csvContent = [
      headers.join(','),
      ...tableData.map(row => row.join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'table-data.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (!showInitial) {
    return (
      <div className="container mx-auto p-4 max-w-6xl">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Generated Table</h2>
              <Button onClick={exportData}>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </div>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {headers.map((header, index) => (
                      <TableHead key={index}>{header}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableData.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <TableCell key={cellIndex}>{cell}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="space-y-8 text-center">
        <h1 className="text-4xl font-bold tracking-tighter">
          Dynamic Table Generator
        </h1>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Table Headers</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {headers.map((header, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md"
                    >
                      {header}
                      <button
                        onClick={() => removeHeader(index)}
                        className="text-secondary-foreground/70 hover:text-secondary-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add header..."
                    value={newHeader}
                    onChange={(e) => setNewHeader(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addHeader()}
                  />
                  <Button onClick={addHeader} variant="secondary">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Number of Rows</label>
                <Input
                  type="number"
                  min="1"
                  value={rowCount}
                  onChange={(e) => setRowCount(parseInt(e.target.value) || 1)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Describe your data (optional)</label>
                <Textarea
                  placeholder="E.g., Generate a table of fictional characters with their powers and origins..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>
              <Button
                className="w-full"
                onClick={generateTable}
                disabled={headers.length === 0 || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Generate Table
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}