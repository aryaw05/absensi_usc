import { NextResponse } from "next/server";
import { getParticipants } from "@/lib/google-sheets";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const participants = await getParticipants();
    return NextResponse.json({ success: true, data: participants });
  } catch (error) {
    console.error("[API] Error fetching participants:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data peserta" },
      { status: 500 }
    );
  }
}
