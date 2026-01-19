import TotalTimeTrendMonth from "./totalTimeTrend/totalTimeTrendMonth";
import TotalTimeTrendWeek from "./totalTimeTrend/totalTimeTrendWeek";

export default async function Dashboard() {
	return (
		<div className="grid mx-3 justify-items-center-safe gap-1 mt-35 grid-cols-2 lg:grid-cols-3">
			<TotalTimeTrendWeek />
			<TotalTimeTrendMonth />
		</div>
	);
}

