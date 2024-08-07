import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { prompt } from "./prompt";
// Initialize the Google Generative AI client
const initializeGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set in environment variables");
    console.log("Gemini init didn't work ");
  }
  return new GoogleGenerativeAI(apiKey);
  console.log("Gemi init worked work ");
};

export async function POST(request: NextRequest) {
  //console.log("Function call works");
  try {
    const genAI = initializeGenAI();
    const formData = await request.formData();
    const file = formData.get("file") as Blob | null;

    if (!file) {
      return NextResponse.json({ error: "File is required." }, { status: 400 });
    }

    // Check file type
    if (!["application/pdf", "image/png", "image/jpeg"].includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only PDF, PNG, and JPEG are allowed." },
        { status: 400 }
      );
    }

    // Convert file to base64
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64File = buffer.toString("base64");

    // Create a parts array for Gemini API
    const parts = [
      {
        inlineData: {
          mimeType: file.type,
          data: base64File,
        },
      },
      {
        text: prompt,
      },
    ];

    // Use the gemini-1.5-flash model
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      // Set the `responseMimeType` to output JSON
      generationConfig: { responseMimeType: "application/json" },
    });

    // Generate content
    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
    });

    const response = result.response;
    const text = response.text();
    console.log(text)

    return NextResponse.json({ text }, { status: 200 });
  } catch (error) {
    console.error("Error processing file:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}
