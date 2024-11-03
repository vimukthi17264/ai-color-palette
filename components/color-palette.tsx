"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { PaperclipIcon, CopyIcon, DownloadIcon, PlusIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ColorPalette {
  id: string;
  paletteName: string;
  colors: string[];
}

export default function ColorPalette() {
  const [prompt, setPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [generatedPalettes, setGeneratedPalettes] = useState<ColorPalette[]>([])
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/generate-palettes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const palettes: ColorPalette[] = await response.json();
      if (!Array.isArray(palettes) || palettes.length === 0) {
        throw new Error('Invalid response format');
      }
      const palettesWithIds = palettes.map(palette => ({
        ...palette,
        id: Math.random().toString(36).substr(2, 9)
      }));
      setGeneratedPalettes(palettesWithIds);
      toast({
        title: "Palettes generated successfully",
        description: `${palettesWithIds.length} color palettes have been created based on your prompt.`,
      })
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      toast({
        title: "Error",
        description: "Failed to generate palettes. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyColorToClipboard = (color: string) => {
    navigator.clipboard.writeText(color)
    toast({
      title: "Color copied",
      description: `${color} has been copied to your clipboard.`,
    })
  }

  const exportPalette = (palette: ColorPalette) => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(palette));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", `${palette.paletteName.replace(/\s+/g, '_')}.json`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      toast({
        title: "Palette exported",
        description: `${palette.paletteName} has been exported as a JSON file.`,
      })
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export failed",
        description: "Failed to export the palette. Please try again.",
        variant: "destructive",
      })
    }
  }

  const createNewPalette = () => {
    window.location.reload();
  }

  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-900 font-sans">
      <header className="flex h-16 items-center justify-between border-b border-gray-200 px-6 bg-white">
        <div className="flex items-center gap-6">
          <span className="text-2xl font-bold text-black">ColorPalette AI</span>
          <nav className="hidden md:flex space-x-4">
            <Link href="/" className="text-gray-600 hover:text-black transition-colors">Home</Link>
            <Link href="/explore" className="text-gray-600 hover:text-black transition-colors">Explore</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="text-sm" size={'default'}>Sign In</Button>
          <Button className="text-sm bg-black hover:bg-black text-white">Sign Up</Button>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        {generatedPalettes.length === 0 ? (
          <div className="container mx-auto flex flex-col items-center justify-center space-y-8 max-w-4xl">
            <h1 className="text-center text-4xl font-bold text-gray-800">Whatcha painting next?</h1>
            <form onSubmit={handleSubmit} className="w-full space-y-4">
              <div className="relative">
                <Textarea
                  className="min-h-[120px] resize-none p-4 pr-12 rounded-2xl border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
                  placeholder="Describe your desired color palette..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-black ">
                    <PaperclipIcon className="h-4 w-4" />
                    <span className="sr-only">Attach file</span>
                  </Button>
                </div>
              </div>
              <Button 
                className="w-full bg-black hover:bg-black text-white font-semibold py-2 px-4  transition"
                type="submit" 
                disabled={isLoading || !prompt}
              >
                {isLoading ? "Generating..." : "Generate Palette"}
              </Button>
            </form>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <button className="hover:text-black transition-colors">Generate a retro color scheme</button>
              <button className="hover:text-black transition-colors">Create a modern minimalist palette</button>
              <button className="hover:text-black transition-colors">Design a nature-inspired color set</button>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-4xl mt-12 space-y-8">
            <div className="flex justify-end items-center mb-4">
              <Button variant="outline" size="sm" onClick={createNewPalette} className="text-black border-black hover:bg-gray-100 rounded-full">
                <PlusIcon className="h-4 w-4 mr-2" />
                New Palette
              </Button>
            </div>
            {generatedPalettes.map((palette) => (
              <div key={palette.id} className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">{palette.paletteName}</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => exportPalette(palette)}
                    className="rounded-full text-gray-500"
                    title={`Export ${palette.paletteName}`}
                  >
                    <DownloadIcon className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
                <div className="flex h-32 rounded-2xl overflow-hidden border border-gray-200">
                  {palette.colors.map((color, colorIndex) => (
                    <div
                      key={colorIndex}
                      className="flex-1 relative group"
                      style={{ backgroundColor: color }}
                      aria-label={`Color ${color}`}
                    >
                      <div className="absolute inset-x-0 bottom-0 p-4 bg-black bg-opacity-50 text-white text-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-lg font-mono font-bold mb-2">{color}</p>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="text-sm text-white hover:text-gray-200 rounded-full"
                          onClick={() => copyColorToClipboard(color)}
                        >
                          <CopyIcon className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </main>
      <footer className="border-t border-gray-200 py-6 bg-white">
        <div className="container mx-auto flex flex-wrap items-center justify-center gap-6 px-6 text-sm text-gray-600">
          <a href="#" className="hover:text-black transition-colors">Pricing</a>
          <a href="#" className="hover:text-black transition-colors">Enterprise</a>
          <a href="#" className="hover:text-black transition-colors">FAQ</a>
          <a href="#" className="hover:text-black transition-colors">Legal</a>
          <a href="#" className="hover:text-black transition-colors">Privacy</a>
        </div>
      </footer>
    </div>
  )
}