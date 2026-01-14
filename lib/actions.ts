"use server";

import { query } from "./db";

type Time = {
	hours: number;
	minutes: number;
};

export async function submitTimeEntry(data: { hours: number; minutes: number; date: Date; note?: string }) {
	// Here you would handle the submitted data, e.g., save it to a database.
	console.log("Time Entry Submitted:", data);
	const totalMinutes = hoursToMinutes(data.hours) + data.minutes;
	const result = query("INSERT INTO hfg_time_tracker (minutes, entry_date, notes) VALUES ($1, $2, $3)", [
		totalMinutes,
		data.date,
		data.note ?? null,
	]);
	console.log("Database Insert Result:", result);
}

function hoursToMinutes(hours: number): number {
	return hours * 60;
}

function minutesToHours(minutes: number): Time {
	return { hours: Math.floor(minutes / 60), minutes: minutes % 60 };
}

