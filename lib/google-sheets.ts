import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });
const SHEET_ID = process.env.GOOGLE_SHEET_ID!;

// ─── Types ───────────────────────────────────────────────────────────
// Kolom sheet: id_peserta | email | nama_peserta | asal_sekolah | alamat | no_hp | waktu_absen | status
//              A           B       C               D               E       F       G             H

export interface Participant {
  id_peserta: string;
  email: string;
  nama_peserta: string;
  asal_sekolah: string;
  alamat: string;
  no_hp: string;
  waktu_absen: string;
  status: string;
  rowIndex: number; // 1-based row index in the sheet (for updating)
}

export interface Attendance {
  id_peserta: string;
  email: string;
  nama_peserta: string;
  asal_sekolah: string;
  alamat: string;
  no_hp: string;
  waktu_absen: string;
  status: string;
}

export interface DashboardStats {
  totalPeserta: number;
  totalHadir: number;
  totalBelumHadir: number;
  persentaseKehadiran: number;
}

export interface AttendanceResult {
  success: boolean;
  message: string;
  type: "success" | "already" | "not_found" | "error";
  participant?: Omit<Participant, "rowIndex">;
}

// ─── Helpers ─────────────────────────────────────────────────────────

function formatDateTime(): string {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(now);

  const get = (type: string) => parts.find((p) => p.type === type)?.value || "";
  return `${get("year")}-${get("month")}-${get("day")} ${get("hour")}:${get("minute")}:${get("second")}`;
}

// ─── Data Access ─────────────────────────────────────────────────────

export async function getParticipants(): Promise<Participant[]> {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: "Peserta!A2:H",
  });

  const rows = res.data.values || [];
  return rows
    .filter((row) => row[0]) // skip empty rows
    .map((row, index) => ({
      id_peserta: (row[0] || "").trim(),
      email: (row[1] || "").trim(),
      nama_peserta: (row[2] || "").trim(),
      asal_sekolah: (row[3] || "").trim(),
      alamat: (row[4] || "").trim(),
      no_hp: (row[5] || "").trim(),
      waktu_absen: (row[6] || "").trim(),
      status: (row[7] || "").trim(),
      rowIndex: index + 2, // +2 because row 1 is header, and index is 0-based
    }));
}

export async function getAttendances(): Promise<Attendance[]> {
  const participants = await getParticipants();
  // Filter hanya peserta yang sudah absen (waktu_absen terisi)
  return participants
    .filter((p) => p.waktu_absen)
    .map(({ rowIndex: _, ...rest }) => rest);
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const participants = await getParticipants();

  const totalPeserta = participants.length;
  const totalHadir = participants.filter((p) => p.waktu_absen).length;
  const totalBelumHadir = totalPeserta - totalHadir;
  const persentaseKehadiran =
    totalPeserta > 0 ? Math.round((totalHadir / totalPeserta) * 100) : 0;

  return { totalPeserta, totalHadir, totalBelumHadir, persentaseKehadiran };
}

// ─── Mark Attendance ─────────────────────────────────────────────────

export async function markAttendance(
  id_peserta: string,
): Promise<AttendanceResult> {
  try {
    // 1. Find participant
    const participants = await getParticipants();
    const participant = participants.find(
      (p) => p.id_peserta === id_peserta.trim(),
    );

    if (!participant) {
      console.log(`[SCAN] ID tidak terdaftar: ${id_peserta}`);
      return {
        success: false,
        message: "Peserta tidak terdaftar dalam sistem",
        type: "not_found",
      };
    }

    // 2. Check if already attended (waktu_absen sudah terisi)
    if (participant.waktu_absen) {
      console.log(
        `[SCAN] Sudah absen: ${id_peserta} - ${participant.nama_peserta}`,
      );
      return {
        success: false,
        message: `${participant.nama_peserta} sudah melakukan absensi pada ${participant.waktu_absen}`,
        type: "already",
        participant,
      };
    }

    // 3. Record attendance — update kolom G (waktu_absen) dan H (status) di row peserta
    const waktu_absen = formatDateTime();
    const rowNumber = participant.rowIndex;

    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `Peserta!G${rowNumber}:H${rowNumber}`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[waktu_absen, "Hadir"]],
      },
    });

    console.log(
      `[SCAN] Berhasil absen: ${id_peserta} - ${participant.nama_peserta} at ${waktu_absen} (row ${rowNumber})`,
    );

    return {
      success: true,
      message: `Absensi berhasil untuk ${participant.nama_peserta}`,
      type: "success",
      participant,
    };
  } catch (error) {
    console.error(`[SCAN ERROR] Gagal mencatat absensi: ${id_peserta}`, error);
    return {
      success: false,
      message: "Terjadi kesalahan sistem. Coba lagi.",
      type: "error",
    };
  }
}
