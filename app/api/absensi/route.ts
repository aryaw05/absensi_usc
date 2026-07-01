import { NextRequest, NextResponse } from "next/server";
import {
  getAttendances,
  getDashboardStats,
  markAttendance,
} from "@/lib/google-sheets";
import { rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

// GET: Fetch all attendance records + dashboard stats
export async function GET() {
  try {
    const [attendances, stats] = await Promise.all([
      getAttendances(),
      getDashboardStats(),
    ]);

    return NextResponse.json({
      success: true,
      data: attendances,
      stats,
    });
  } catch (error) {
    console.error("[API] Error fetching attendance:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data absensi" },
      { status: 500 }
    );
  }
}

// POST: Mark attendance for a participant
export async function POST(req: NextRequest) {
  // Rate limiting
  const ip =
    req.headers.get("x-forwarded-for") ||
    req.headers.get("x-real-ip") ||
    "unknown";
  const { allowed } = rateLimit(ip, 30, 60 * 1000);

  if (!allowed) {
    console.log(`[RATE LIMIT] IP ${ip} exceeded rate limit`);
    return NextResponse.json(
      {
        success: false,
        message: "Terlalu banyak permintaan. Coba lagi nanti.",
        type: "error",
      },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const { id_peserta } = body;

    if (!id_peserta || typeof id_peserta !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "ID Peserta tidak valid",
          type: "error",
        },
        { status: 400 }
      );
    }

    // Sanitize input
    const sanitizedId = id_peserta.trim().substring(0, 50);
    const result = await markAttendance(sanitizedId);

    const statusCode = result.success
      ? 200
      : result.type === "already"
        ? 409
        : result.type === "not_found"
          ? 404
          : 500;

    return NextResponse.json(result, { status: statusCode });
  } catch (error) {
    console.error("[API] Error marking attendance:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan server",
        type: "error",
      },
      { status: 500 }
    );
  }
}
