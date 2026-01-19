import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardDescription, CardTitle, CardFooter } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Suspense } from "react";

type Props = {
	currentTime: { hours: number; minutes: number };
	previousTime: { hours: number; minutes: number };
	range: "week" | "month";
};

function timeToMinutes(time: { hours: number; minutes: number }): number {
	return time.hours * 60 + time.minutes;
}

function getTrendText(percentage: number, mode: "week" | "month"): React.JSX.Element {
	let trendText = "";
	let trendIcon = <></>;
	const trendPercentage = (
		<>
			{percentage > 0 ? "+" : "-"}
			{percentage.toFixed(1)}%
		</>
	);
	if (percentage > 50) {
		trendText = `Trending way up from last ${mode}!`;
		trendIcon = <TrendingUp />;
	} else if (percentage > 20) {
		trendText = `Trending up from last ${mode}!`;
		trendIcon = <TrendingUp />;
	} else if (percentage > 5) {
		trendText = `Trending slightly up from last ${mode}!`;
		trendIcon = <TrendingUp />;
	} else if (percentage > -5) {
		trendText = `Stable compared to last ${mode}.`;
		trendIcon = <></>;
	} else if (percentage > -20) {
		trendText = `Trending slightly down from last ${mode}.`;
		trendIcon = <TrendingDown />;
	} else if (percentage > -50) {
		trendText = `Trending down from last ${mode}.`;
		trendIcon = <TrendingDown />;
	} else {
		trendText = `Trending way down from last ${mode}.`;
		trendIcon = <TrendingDown />;
	}
	return (
		<span className="text-muted-foreground text-sm">
			{trendText}
			<Badge variant="outline" className="ml-1">
				{trendPercentage} {trendIcon}
			</Badge>
		</span>
	);
}
export default async function TotalTimeTrendBase(props: Props) {
	const currentMinutes = timeToMinutes(props.currentTime);
	const previousMinutes = timeToMinutes(props.previousTime);

	const percentage = ((currentMinutes - previousMinutes) / previousMinutes) * 100;

	return (
		<Card className="gap-4 max-w-[45%] min-w-48">
			<CardHeader>
				<CardDescription>
					Total Time this <span className="capitalize">{props.range}</span>
				</CardDescription>

				<CardTitle className="text-2xl text-nowrap font-semibold tabular-nums @[250px]/card:text-3xl">
					<Suspense fallback={<span>--hr --min</span>}>
						{props.currentTime.hours}hr {props.currentTime.minutes}min
					</Suspense>
				</CardTitle>
			</CardHeader>
			{previousMinutes > 0 && <CardFooter>{getTrendText(percentage, props.range)}</CardFooter>}
		</Card>
	);
}

