import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai"
import { NextResponse } from "next/server"


export async function POST(req: Request) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

  try {
    const { headers, rowCount, prompt } = await req.json()

    const schema = {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: headers.reduce((acc: any, header: string) => {
          acc[header] = {
            type: SchemaType.STRING,
            description: `Value for ${header}`,
          }
          return acc
        }, {}),
      },
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction:'you are a table generator. generate table with the prompt provided',
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    })

    const result = await model.generateContent(
      `Generate a table with ${rowCount} rows of data for the following headers: ${headers.join(", ")}. ${prompt}`
    )

    const generatedData = JSON.parse(result.response.text())

    // Convert the generated data to the format expected by the frontend
    const tableData = generatedData.map((item: any) => headers.map((header: string) => item[header]))

    return NextResponse.json(tableData)
  } catch (error) {
    console.error("Error generating table:", error)
    return NextResponse.json({ error: "Failed to generate table" }, { status: 500 })
  }
}