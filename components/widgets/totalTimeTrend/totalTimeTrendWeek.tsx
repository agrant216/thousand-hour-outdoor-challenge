import { getCurrentWeekTotal, getPreviousWeektotal } from "@/lib/actions";
import TotalTimeTrendBase from "./totalTimeTrendBase";

export default async function TotalTimeTrendWeek() {
	const currentTotal = await getCurrentWeekTotal();
	const previousTotal = await getPreviousWeektotal();

	return <TotalTimeTrendBase range="week" currentTime={currentTotal} previousTime={previousTotal} />;
}
