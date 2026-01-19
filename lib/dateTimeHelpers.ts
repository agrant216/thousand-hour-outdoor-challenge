export function getWeekDates(): Date[] {
	const today = new Date();
	const dayOfWeek = today.getDay(); // Sunday is 0, Monday is 1, etc.
	const startDate = new Date(today); // Copy today's date

	// Calculate the start of the week (e.g., Sunday or Monday, depending on preference)
	// For a Sunday start, subtract the current day of the week
	startDate.setDate(today.getDate() - dayOfWeek);
	startDate.setHours(0, 0, 0, 0); // Set time to midnight for consistency

	const dates = [];
	for (let i = 0; i < 7; i++) {
		const currentDate = new Date(startDate);
		currentDate.setDate(startDate.getDate() + i);
		dates.push(currentDate);
	}
	return dates;
}

