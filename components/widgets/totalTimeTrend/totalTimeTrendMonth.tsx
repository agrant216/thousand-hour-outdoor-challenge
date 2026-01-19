import { getPreviousMonthTotal, getCurrentMonthTotal } from "@/lib/actions";
import TotalTimeTrendBase from "./totalTimeTrendBase";

export default async function TotalTimeTrendMonth() {
	const currentTotal = await getCurrentMonthTotal();
	const previousTotal = await getPreviousMonthTotal();

	return <TotalTimeTrendBase range="month" currentTime={currentTotal} previousTime={previousTotal} />;
}

