import { getCurrentWeekTotal, getPreviousWeektotal } from "@/lib/actions";
	import TimeTrendBase from "./timeTrendBase";

export default async function TotalTimeTrendWeek() {
	const currentTotal = await getCurrentWeekTotal();
	const previousTotal = await getPreviousWeektotal();

	return <TimeTrendBase range="week" currentTime={currentTotal} previousTime={previousTotal} />;
}
