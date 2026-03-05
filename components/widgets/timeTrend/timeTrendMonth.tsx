import { getPreviousMonthTotal, getCurrentMonthTotal } from "@/lib/actions";
import TimeTrendBase from "./timeTrendBase";

export default async function TimeTrendMonth() {
	const currentTotal = await getCurrentMonthTotal();
	const previousTotal = await getPreviousMonthTotal();

	return <TimeTrendBase range="month" currentTime={currentTotal} previousTime={previousTotal} />;
}

