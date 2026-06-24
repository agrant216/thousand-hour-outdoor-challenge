import RecentLogs from "./recentLogs";
import TimeTrendMonth from "./timeTrend/timeTrendMonth";
import TimeTrendWeek from "./timeTrend/timeTrendWeek";
import TotalTimeToGoal from "./totalTimeToGoal";

export default async function Dashboard() {
	return (
		<div className="grid mx-3 justify-items-center-safe gap-3 mt-35 grid-cols-1 xs:grid-cols-2 xs:gap-1 md:grid-cols-3">
			<TotalTimeToGoal />
			<TimeTrendWeek />
			<TimeTrendMonth />
			<RecentLogs />
		</div>
	);
}

