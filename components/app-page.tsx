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
import { PlusIcon } from "@radix-ui/react-icons"

export default function Tablegenerator() {
  const [showInitial, setShowInitial] = React.useState(true)
  const [headers, setHeaders] = React.useState<string[]>([])
  const [newHeader, setNewHeader] = React.useState("")
  const [rowCount, setRowCount] = React.useState(5)
  const [tableData, setTableData] = React.useState<any[][]>([])
  const [prompt, setPrompt] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const { toast } = useToast()
  const [actionCompleted, setActionCompleted] = React.useState(false);

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

      // Set action as completed
      setActionCompleted(true);

      // Trigger the share prompt
      window.dispatchEvent(new Event('triggerSharePrompt'));


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
        <Card className="border-0">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Generated Table</h2>
              <div className=" space-x-2">
                <ExportDataButton headers={headers} tableData={tableData} />

                <Button variant={'outline'} onClick={() => {
                  window.location.reload();
                }}>
                  <PlusIcon className="mr-2" />
                  New Table
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground"> I'm powered by AI, so surprises and mistakes are possible. Make sure to verify any generated code or suggestions, and share feedback so that we can learn and improve.</p>

            <div className="rounded-md border overflow-x-auto mt-4">

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
        <FeedbackCollector autoOpenCondition={false} />
      </div>
    )
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="container mx-auto p-4 max-w-5xl text-left">
        <div className="space-y-8">
          <h1 className="text-4xl font-bold tracking-tighter text-center">
          How can I help with your data needs?
           </h1>
          <Card className="bg-muted/40">
            <CardContent className="p-6 space-y-4">
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
                    <Button onClick={addHeader} size={'icon'} variant={'secondary'}>
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
                  <label className="text-sm font-medium">Describe your data</label>
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
          <Card className="border-0">
            <CardContent>
              <div className="flex flex-row text-sm text-center text-gray-500">
                <p>Generate a table of popular programming languages and their key features.</p>
                <p>Create a list of common exercises for strength training with instructions.</p>
                <p>List fictional characters with their unique powers and origin stories.</p>
              </div>
            </CardContent>
          </Card>
          <div className="w-full text-center">
            <p>made by <a href="https://twitter.com/highendstriker" className="text-blue-500">@highendstriker</a></p>
          </div>
        </div>
      </div>
    </div>
  )
}




import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import FeedbackCollector from "./feedback-collector"

// Define the prop types
interface ExportDataButtonProps {
  headers: string[]; // Array of strings for column headers
  tableData: (string | number)[][]; // 2D array for table data (strings or numbers)
}

const ExportDataButton: React.FC<ExportDataButtonProps> = ({ headers, tableData }) => {

  const generateBlobAndDownload = (content: string, fileType: string, fileExtension: string) => {
    const blob = new Blob([content], { type: fileType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `table-data_${new Date().toISOString().slice(0, 10)}.${fileExtension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    const csvContent = [
      headers.join(','),
      ...tableData.map(row =>
        row.map(cell => `"${cell.toString().replace(/"/g, '""')}"`).join(',')
      ),
    ].join('\n');
    generateBlobAndDownload(csvContent, 'text/csv', 'csv');
  };

  const exportJSON = () => {
    const jsonData = tableData.map(row => {
      const rowData: { [key: string]: string | number } = {}; // Define row data type
      headers.forEach((header, index) => rowData[header] = row[index]);
      return rowData;
    });
    const jsonContent = JSON.stringify(jsonData, null, 2);
    generateBlobAndDownload(jsonContent, 'application/json', 'json');
  };

  const exportXML = () => {
    const xmlData = tableData.map(row => {
      const rowData = headers.map((header, index) =>
        `<${header}>${row[index]}</${header}>`
      ).join('');
      return `<row>${rowData}</row>`;
    }).join('');
    const xmlContent = `<rows>${xmlData}</rows>`;
    generateBlobAndDownload(xmlContent, 'application/xml', 'xml');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Download className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Export as</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={exportCSV}>CSV</DropdownMenuItem>
        <DropdownMenuItem onClick={exportJSON}>JSON</DropdownMenuItem>
        <DropdownMenuItem onClick={exportXML}>XML</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
