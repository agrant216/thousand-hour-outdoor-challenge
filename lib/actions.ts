"use server";

import { cacheTag, updateTag } from "next/cache";
import { query } from "./db";
import { minutesToHours } from "./dateTimeHelpers";
import { TimeEntryCursor } from "./types";

export async function submitTimeEntry(data: { hours: number; minutes: number; date: Date; note?: string }) {
	// Here you would handle the submitted data, e.g., save it to a database.
	const totalMinutes = hoursToMinutes(data.hours) + data.minutes;
	const result = await query(
		`INSERT INTO ${process.env.DB_TABLE!} (minutes, entry_date, notes) VALUES ($1, $2, $3)`,
		[totalMinutes, data.date, data.note ?? null],
	);
	console.log("Database Insert Result:", result);
	updateTag("dashboard-data");
}

export async function getTimeEntries() {
	const result = await query(
		`SELECT id, minutes, entry_date, notes FROM ${process.env.DB_TABLE!} ORDER BY entry_date DESC`,
		[],
	);
	return result.rows.map((row) => ({
		id: row.id,
		time: minutesToHours(row.minutes),
		date: row.entry_date,
		note: row.notes,
	}));
}

export async function getCurrentWeekTimeEntries() {
	const result = await query(
		`SELECT date_trunc('day', entry_date)::date AS weekday, SUM(minutes) AS total_minutes FROM ${process.env.DB_TABLE!} WHERE entry_date >= date_trunc('week', CURRENT_DATE) GROUP BY weekday ORDER BY weekday`,
		[],
	);
	return result.rows.map((row) => {
		return {
			date: row.weekday,
			time: minutesToHours(row.total_minutes),
		};
	});
}

export async function getCurrentWeekTotal() {
	"use cache";
	cacheTag("dashboard-data");
	const result = await query(
		`SELECT SUM(minutes) AS total_minutes FROM ${process.env.DB_TABLE!} WHERE entry_date >= date_trunc('week', CURRENT_DATE)`,
		[],
	);
	const totalMinutes = result.rows[0]?.total_minutes ?? 0;
	return minutesToHours(totalMinutes);
}

export async function getPreviousWeektotal() {
	"use cache";
	const result = await query(
		`SELECT SUM(minutes) AS total_minutes FROM ${process.env.DB_TABLE!} WHERE entry_date >= date_trunc('week', CURRENT_DATE) - INTERVAL '7 days' AND entry_date < date_trunc('week', CURRENT_DATE)`,
		[],
	);
	const totalMinutes = result.rows[0]?.total_minutes ?? 0;
	return minutesToHours(totalMinutes);
}

export async function getCurrentMonthTotal() {
	"use cache";
	cacheTag("dashboard-data");
	const result = await query(
		`SELECT SUM(minutes) AS total_minutes FROM ${process.env.DB_TABLE!} WHERE entry_date >= date_trunc('month', CURRENT_DATE)`,
		[],
	);
	const totalMinutes = result.rows[0]?.total_minutes ?? 0;
	return minutesToHours(totalMinutes);
}

export async function getPreviousMonthTotal() {
	"use cache";
	const result = await query(
		`SELECT SUM(minutes) AS total_minutes FROM ${process.env.DB_TABLE!} WHERE entry_date >= date_trunc('month', CURRENT_DATE) - INTERVAL '1 month' AND entry_date < date_trunc('month', CURRENT_DATE)`,
		[],
	);
	const totalMinutes = result.rows[0]?.total_minutes ?? 0;
	return minutesToHours(totalMinutes);
}

export async function getTotalTime() {
	"use cache";
	cacheTag("dashboard-data");
	const result = await query(`SELECT SUM(minutes) AS total_minutes FROM ${process.env.DB_TABLE!}`, []);
	const totalMinutes = result.rows[0]?.total_minutes ?? 0;
	return minutesToHours(totalMinutes);
}

export async function getRecentTimeEntries() {
	"use cache";
	cacheTag("dashboard-data");
    const result = await query(
        `SELECT minutes, entry_date, notes
         FROM ${process.env.DB_TABLE!}
         ORDER BY entry_date DESC
         LIMIT 5`,
        [],
    );

    return result.rows.map((row) => ({
        time: minutesToHours(row.minutes),
        date: row.entry_date,
        note: row.notes,
    }));
}

export async function getAllTimeEntries(input?: {
  limit?: number;
  cursor?: TimeEntryCursor | null;
}) {
  const limit = Math.min(Math.max(input?.limit ?? 25, 1), 100);
  const cursor = input?.cursor ?? null;

  const params: Array<string | number> = [];
  let whereSql = "";

  if (cursor) {
    params.push(cursor.entryDate, cursor.id);
    whereSql = "WHERE (entry_date, id) < ($1::timestamptz, $2::int)";
  }

  params.push(limit + 1);
  const limitParam = "$" + params.length;

  const result = await query(
    "SELECT id, minutes, entry_date, notes " +
      "FROM " + process.env.DB_TABLE! + " " +
      whereSql + " " +
      "ORDER BY entry_date DESC, id DESC " +
      "LIMIT " + limitParam,
    params
  );

  const rows = result.rows.map((row) => ({
    id: row.id as number,
    time: minutesToHours(row.minutes as number),
    date:
      row.entry_date instanceof Date
        ? row.entry_date.toISOString()
        : new Date(row.entry_date).toISOString(),
    note: row.notes ?? "",
  }));

  const hasMore = rows.length > limit;
  const items = hasMore ? rows.slice(0, limit) : rows;
  const last = items[items.length - 1];

  return {
    items,
    nextCursor: hasMore && last
      ? { entryDate: last.date, id: last.id }
      : null,
  };
}

function hoursToMinutes(hours: number): number {
	return hours * 60;
}