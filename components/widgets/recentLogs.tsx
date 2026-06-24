import { getRecentTimeEntries } from "@/lib/actions";
import React, { Suspense } from "react";
import { Card, CardDescription } from "../ui/card";

type Submission = {
	date: string | Date;
	time: Time;
	note: string;
};

const formatDate = (value: string | Date) => {
	const date = typeof value === "string" ? new Date(value) : value;
	if (Number.isNaN(date.getTime())) return "—";
	return date.toLocaleDateString();
};

export default async function RecentLogs() {
    const recent = await getRecentTimeEntries();

	return (
		<Card className="rounded-2xl border p-4 shadow-sm gap-4 col-span-1 max-w-full xs:max-w-[45%] min-w-48 xs:col-span-2 xs:min-w-96">
			<CardDescription className="mt-2 flex items-center justify-between">
				<h3 className="text-sm font-semibold">Recent Submissions</h3>
			</CardDescription>

			<div className="overflow-x-auto">
				<table className="min-w-full border-separate border-spacing-0 text-left text-sm">
					<thead>
						<tr className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
							<th className="border-b border-zinc-200 px-3 py-2 dark:border-zinc-800">Date</th>
							<th className="border-b border-zinc-200 px-3 py-2 dark:border-zinc-800">Time Submitted</th>
							<th className="border-b border-zinc-200 px-3 py-2 dark:border-zinc-800">Note</th>
						</tr>
					</thead>
					<tbody>
                        <Suspense fallback={<tr>
                            <td colSpan={3} className="px-3 py-5 text-center text-zinc-500 dark:text-zinc-400">
                                Loading...
                            </td>
                        </tr>
                        }>
						{recent.length === 0 ? (
							<tr>
								<td colSpan={3} className="px-3 py-5 text-center text-zinc-500 dark:text-zinc-400">
									No submissions yet.
								</td>
							</tr>
						) : (
							recent.map((submission, idx) => (
								<tr key={`${submission.date}-${idx}`}>
									<td className="border-b border-zinc-100 px-3 py-2 text-zinc-700 dark:border-zinc-800 dark:text-zinc-200">
										{formatDate(submission.date)}
									</td>
									<td className="border-b border-zinc-100 px-3 py-2 text-zinc-700 dark:border-zinc-800 dark:text-zinc-200">
										{submission.time.hours}hr {submission.time.minutes}min
									</td>
									<td className="max-w-75 truncate border-b border-zinc-100 px-3 py-2 text-zinc-700 dark:border-zinc-800 dark:text-zinc-200">
										{submission.note}
									</td>
								</tr>
							))
						)}
                        </Suspense>
					</tbody>
				</table>
			</div>

			<button
				type="button"
				className="mt-4 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
			>
				View All Submissions
			</button>
		</Card>
	);
}
