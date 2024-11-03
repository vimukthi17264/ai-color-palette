import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { NextResponse } from 'next/server';

const schema = {
    description: "List of color palettes",
    type: SchemaType.ARRAY,
    items: {
        type: SchemaType.OBJECT,
        properties: {
            paletteName: {
                type: SchemaType.STRING,
                description: "Name of the color palette",
                nullable: false,
            },
            colors: {
                type: SchemaType.ARRAY,
                description: "List of 5 colors in the palette",
                items: {
                    type: SchemaType.STRING,
                    description: "Color in hexadecimal format",
                },
                minItems: 5,
                maxItems: 5,
            },
        },
        required: ["paletteName", "colors"],
    },
};


export async function POST(request: Request) {

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string || '');

    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-pro",
        systemInstruction: "You are a color pallete generator. use the schema provided",
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: schema,
        },
    });

    try {
        const { prompt } = await request.json();
        const result = await model.generateContent(
            `Generate 4 color palettes based on the following prompt: ${prompt}. Each palette should have 5 colors.`
        );
        const palettes = JSON.parse(result.response.text());
        return NextResponse.json(palettes);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to generate palettes' }, { status: 500 });
    }
}