import TotalTimeTrendMonth from "./totalTimeTrend/totalTimeTrendMonth";
import TotalTimeTrendWeek from "./totalTimeTrend/totalTimeTrendWeek";

export default async function Dashboard() {
	return (
		<div className="grid mx-3 justify-items-center-safe gap-2 mt-35 grid-cols-1 xs:grid-cols-2 xs:gap-1 md:grid-cols-3">
			<TotalTimeTrendWeek />
			<TotalTimeTrendMonth />
		</div>
	);
}

