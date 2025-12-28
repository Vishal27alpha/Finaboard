import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const name = searchParams.get("name")

    if (!name) {
      return NextResponse.json(
        { error: "Missing required query param: name" },
        { status: 400 }
      )
    }

    const response = await fetch(
      `https://stock.indianapi.in/stock?name=${encodeURIComponent(name)}`,
      {
        headers: {
          "X-Api-Key": process.env.INDIAN_API_KEY!,
        },
      }
    )

    if (!response.ok) {
      const text = await response.text()
      return NextResponse.json(
        { error: text },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    )
  }
}
