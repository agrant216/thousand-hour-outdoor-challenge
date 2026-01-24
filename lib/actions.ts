"use server";

import { cacheTag, updateTag } from "next/cache";
import { query } from "./db";

type Time = {
	hours: number;
	minutes: number;
};

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
		`SELECT date_trunc('day', entry_date)::date AS weekday, SUM(minutes) AS total_minutes FROM ${process.env
			.DB_TABLE!} WHERE entry_date >= date_trunc('week', CURRENT_DATE) GROUP BY weekday ORDER BY weekday`,
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
		`SELECT SUM(minutes) AS total_minutes FROM ${process.env
			.DB_TABLE!} WHERE entry_date >= date_trunc('week', CURRENT_DATE)`,
	);
	const totalMinutes = result.rows[0]?.total_minutes ?? 0;
	return minutesToHours(totalMinutes);
}

export async function getPreviousWeektotal() {
	"use cache";
	const result = await query(
		`SELECT SUM(minutes) AS total_minutes FROM ${process.env
			.DB_TABLE!} WHERE entry_date >= date_trunc('week', CURRENT_DATE) - INTERVAL '7 days' AND entry_date < date_trunc('week', CURRENT_DATE)`,
	);
	const totalMinutes = result.rows[0]?.total_minutes ?? 0;
	return minutesToHours(totalMinutes);
}

export async function getCurrentMonthTotal() {
	"use cache";
	cacheTag("dashboard-data");
	const result = await query(
		`SELECT SUM(minutes) AS total_minutes FROM ${process.env
			.DB_TABLE!} WHERE entry_date >= date_trunc('month', CURRENT_DATE)`,
	);
	const totalMinutes = result.rows[0]?.total_minutes ?? 0;
	return minutesToHours(totalMinutes);
}

export async function getPreviousMonthTotal() {
	"use cache";
	const result = await query(
		`SELECT SUM(minutes) AS total_minutes FROM ${process.env
			.DB_TABLE!} WHERE entry_date >= date_trunc('month', CURRENT_DATE) - INTERVAL '1 month' AND entry_date < date_trunc('month', CURRENT_DATE)`,
	);
	const totalMinutes = result.rows[0]?.total_minutes ?? 0;
	return minutesToHours(totalMinutes);
}

function hoursToMinutes(hours: number): number {
	return hours * 60;
}

function minutesToHours(minutes: number): Time {
	return { hours: Math.floor(minutes / 60), minutes: minutes % 60 };
}

