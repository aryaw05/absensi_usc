import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pin } = body;

    if (!pin || typeof pin !== "string") {
      return NextResponse.json(
        { success: false, message: "PIN tidak valid" },
        { status: 400 }
      );
    }

    const correctPin = process.env.SCANNER_PIN || "1234";

    if (pin.trim() === correctPin) {
      return NextResponse.json({ success: true, message: "PIN benar" });
    }

    return NextResponse.json(
      { success: false, message: "PIN salah" },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan" },
      { status: 500 }
    );
  }
}
