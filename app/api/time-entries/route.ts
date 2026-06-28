import { NextRequest, NextResponse } from "next/server";
import { getAllTimeEntries } from "@/lib/actions";
import { TimeEntryCursor } from "@/lib/types";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const limitRaw = Number(params.get("limit"));
  const limit = Number.isFinite(limitRaw) ? limitRaw : 25;

  const cursorDate = params.get("cursorDate");
  const cursorIdRaw = params.get("cursorId");
  const cursorId = cursorIdRaw ? Number(cursorIdRaw) : NaN;

  const cursor: TimeEntryCursor | null =
    cursorDate && Number.isFinite(cursorId)
      ? { entryDate: cursorDate, id: cursorId }
      : null;

  const page = await getAllTimeEntries({ limit, cursor });

  return NextResponse.json(page, {
    headers: { "Cache-Control": "no-store" },
  });
}