import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowUpRight } from 'lucide-react'

export default function UniqueTables() {
    const tables = [
        {
            title: "Popular Programming Languages",
            headers: ["Language", "Year Created", "Primary Use", "Popularity Index", "Typing Discipline"],
            data: [
                ["Python", "1991", "General-purpose", "100", "Dynamic"],
                ["JavaScript", "1995", "Web development", "97", "Dynamic"],
                ["Java", "1995", "Enterprise applications", "95", "Static"],
                ["C++", "1979", "System/application software", "87", "Static"],
                ["Ruby", "1995", "Web development", "85", "Dynamic"],
                ["Go", "2009", "System programming", "93", "Static"],
                ["Swift", "2014", "iOS/macOS development", "90", "Static"],
            ]
        },
        {
            title: "Solar System Planets",
            headers: ["Planet", "Distance from Sun (AU)", "Diameter (km)"],
            data: [
                ["Mercury", "0.39", "4,879"],
                ["Venus", "0.72", "12,104"],
                ["Earth", "1.00", "12,742"],
                ["Mars", "1.52", "6,779"],
                ["Jupiter", "5.20", "139,820"],
                ["Saturn", "9.54", "116,460"],
                ["Uranus", "19.19", "50,724"],
            ]
        },
        {
            title: "World Cuisines",
            headers: ["Cuisine", "Country", "Popular Dish", "Main Ingredients"],
            data: [
                ["Italian", "Italy", "Pizza", "Wheat flour, tomatoes, cheese"],
                ["Japanese", "Japan", "Sushi", "Rice, fish, seaweed"],
                ["Mexican", "Mexico", "Tacos", "Corn tortillas, meat, vegetables"],
                ["Indian", "India", "Curry", "Spices, vegetables, meat/legumes"],
                ["French", "France", "Coq au Vin", "Chicken, wine, mushrooms"],
                ["Thai", "Thailand", "Pad Thai", "Rice noodles, peanuts, tamarind"],
                ["Greek", "Greece", "Moussaka", "Eggplant, ground meat, béchamel"],
            ]
        },
        {
            title: "Famous Paintings",
            headers: ["Painting", "Artist", "Year"],
            data: [
                ["Mona Lisa", "Leonardo da Vinci", "c. 1503–1506"],
                ["The Starry Night", "Vincent van Gogh", "1889"],
                ["The Persistence of Memory", "Salvador Dalí", "1931"],
                ["The Scream", "Edvard Munch", "1893"],
                ["Guernica", "Pablo Picasso", "1937"],
                ["The Birth of Venus", "Sandro Botticelli", "c. 1485"],
                ["Girl with a Pearl Earring", "Johannes Vermeer", "c. 1665"],
            ]
        },
        {
            title: "Olympic Sports",
            headers: ["Sport", "Category", "First Introduced"],
            data: [
                ["Swimming", "Aquatics", "1896"],
                ["Basketball", "Team sport", "1936"],
                ["Gymnastics", "Artistic", "1896"],
                ["Athletics", "Track and field", "1896"],
                ["Fencing", "Combat sport", "1896"],
                ["Table Tennis", "Racket sport", "1988"],
                ["Skateboarding", "Extreme sport", "2020"],
            ]
        },
        {
            title: "Chemical Elements",
            headers: ["Element", "Symbol", "Atomic Number", "Group", "Period"],
            data: [
                ["Hydrogen", "H", "1", "1", "1"],
                ["Carbon", "C", "6", "14", "2"],
                ["Oxygen", "O", "8", "16", "2"],
                ["Sodium", "Na", "11", "1", "3"],
                ["Iron", "Fe", "26", "8", "4"],
                ["Gold", "Au", "79", "11", "6"],
                ["Uranium", "U", "92", "3", "7"],
            ]
        },
        {
            title: "World Landmarks",
            headers: ["Landmark", "Location"],
            data: [
                ["Eiffel Tower", "Paris, France"],
                ["Great Wall of China", "China"],
                ["Taj Mahal", "Agra, India"],
                ["Machu Picchu", "Cusco Region, Peru"],
                ["Pyramids of Giza", "Giza, Egypt"],
                ["Colosseum", "Rome, Italy"],
                ["Christ the Redeemer", "Rio de Janeiro, Brazil"],
            ]
        },
    ]

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-left">Example Tables</h1>
            <div className="space-y-12">
                {tables.map((table, index) => (
                    <div key={index}>
                    <h2>{table.title}</h2>
                    <div>
                        <Table className="border">
                            <TableHeader>
                                <TableRow>
                                    {table.headers.map((header, headerIndex) => (
                                        <TableHead key={headerIndex}>{header}</TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {table.data.map((row, rowIndex) => (
                                    <TableRow key={rowIndex}>
                                        {row.map((cell, cellIndex) => (
                                            <TableCell key={cellIndex}>{cell}</TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="w-full flex flex-row justify-end">
                        <Link href={'/'} className='flex flex-row items-center space-x-2'>
                            <Button variant={'link'} className='px-0'>Generate my Table</Button>
                            <ArrowUpRight className='h-4 w-4'/>
                        </Link>
                    </div>
                </div>
                ))}

            </div>
        </div>
    )
}