'use client'

import { useState } from 'react'
import { Lock, Unlock } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from '@/hooks/use-toast'

// In a real application, this would come from your backend
const PHOTOS = [
  { id: 1, src: 'https://static.displate.com/280x392/displate/2023-10-18/700644d6b28a4dd20fc26d1cc2db784e_b5deddaf55e0655e065f13d18b257a05.jpg', tokens: 5 },
  { id: 2, src: 'https://static.displate.com/280x392/displate/2023-10-18/700644d6b28a4dd20fc26d1cc2db784e_b5deddaf55e0655e065f13d18b257a05.jpg', tokens: 10 },
  { id: 3, src: 'https://static.displate.com/280x392/displate/2023-10-18/700644d6b28a4dd20fc26d1cc2db784e_b5deddaf55e0655e065f13d18b257a05.jpg', tokens: 15 },
  { id: 4, src: 'https://static.displate.com/280x392/displate/2023-10-18/700644d6b28a4dd20fc26d1cc2db784e_b5deddaf55e0655e065f13d18b257a05.jpg', tokens: 20 },
  { id: 5, src: 'https://static.displate.com/280x392/displate/2023-10-18/700644d6b28a4dd20fc26d1cc2db784e_b5deddaf55e0655e065f13d18b257a05.jpg', tokens: 25 },
  { id: 6, src: 'https://static.displate.com/280x392/displate/2023-10-18/700644d6b28a4dd20fc26d1cc2db784e_b5deddaf55e0655e065f13d18b257a05.jpg', tokens: 30 },
]

export default function LockedPhotosGallery() {
  const [userTokens, setUserTokens] = useState(50)
  const [unlockedPhotos, setUnlockedPhotos] = useState<number[]>([])
  const [inputTokens, setInputTokens] = useState('')
  const { toast } = useToast()

  const handleUnlock = (id: number, tokens: number) => {
    if (userTokens >= tokens) {
      setUserTokens(prevTokens => prevTokens - tokens)
      setUnlockedPhotos(prev => [...prev, id])
      toast({
        title: "Photo Unlocked!",
        description: `You spent ${tokens} tokens to unlock this photo.`,
      })
    } else {
      toast({
        title: "Not Enough Tokens",
        description: "You don't have enough tokens to unlock this photo.",
        variant: "destructive",
      })
    }
  }

  const handleAddTokens = () => {
    const tokensToAdd = parseInt(inputTokens)
    if (!isNaN(tokensToAdd) && tokensToAdd > 0) {
      setUserTokens(prevTokens => prevTokens + tokensToAdd)
      setInputTokens('')
      toast({
        title: "Tokens Added",
        description: `${tokensToAdd} tokens have been added to your account.`,
      })
    } else {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid number of tokens.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Locked Photos Gallery</h1>
      
      <div className="mb-8 p-4 bg-secondary rounded-lg flex items-center justify-between">
        <p className="text-lg font-semibold">Your Tokens: {userTokens}</p>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Enter tokens"
            value={inputTokens}
            onChange={(e) => setInputTokens(e.target.value)}
            className="w-32"
          />
          <Button onClick={handleAddTokens}>Add Tokens</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {PHOTOS.map((photo) => (
          <div key={photo.id} className="relative group">
            <img
              src={photo.src}
              alt={`Photo ${photo.id}`}
              className={`w-full h-auto rounded-lg transition-all duration-300 ${
                unlockedPhotos.includes(photo.id) ? '' : 'blur-xl'
              }`}
            />
            {!unlockedPhotos.includes(photo.id) && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                <Button
                  onClick={() => handleUnlock(photo.id, photo.tokens)}
                  className="flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  Unlock ({photo.tokens} tokens)
                </Button>
              </div>
            )}
            {unlockedPhotos.includes(photo.id) && (
              <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                <Unlock className="w-3 h-3" />
                Unlocked
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}