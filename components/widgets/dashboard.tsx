import RecentLogs from "./recentLogs";
import TimeTrendMonth from "./timeTrend/timeTrendMonth";
import TimeTrendWeek from "./timeTrend/timeTrendWeek";
import TotalTimeToGoal from "./totalTimeToGoal";

export default async function Dashboard() {
	return (
		<div className="grid mx-3 mt-35 grid-cols-1 gap-y-2 xs:grid-cols-2 xs:gap-x-2 xs:gap-y-3 md:grid-cols-3 md:gap-x-2 md:gap-y-3">
			<TotalTimeToGoal />
			<TimeTrendWeek />
			<TimeTrendMonth />
			<RecentLogs />
		</div>
	);
}

