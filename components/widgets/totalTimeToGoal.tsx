import { getTotalTime } from '@/lib/actions';
import { Suspense } from 'react';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { minutesToHours } from '@/lib/dateTimeHelpers';
import { cacheTag } from 'next/cache';
import { Progress } from '../ui/progress';

const goal = 1000 * 60; // Set your goal in minutes
const baseLineMinutesPerDay = goal / 365; // Average minutes needed per day to reach the goal in a year

async function getRemainingDays(): Promise<number> {
    "use cache";
    cacheTag("dashboard-data");
    const today = new Date();
    const endOfYear = new Date(today.getFullYear(), 11, 31); // December 31st
    const timeDifference = endOfYear.getTime() - today.getTime();
    const remainingDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24)); //milliseconds to days
    return Math.max(remainingDays, 0);
}

export default async function TotalTimeToGoal() {
    const totalTime = await getTotalTime();
    const totalMinutes = totalTime.hours * 60 + totalTime.minutes; 

    const percentage = Math.min((totalMinutes / goal) * 100, 100);

    const remainingDays = await getRemainingDays();
    const minutesNeeded = Math.max(goal - totalMinutes, 0);
    const dailyHoursNeeded = remainingDays > 0 ? minutesNeeded / (remainingDays) : 0;
    const percentComplete = Math.min((totalMinutes / goal) * 100, 100);

    function getProgressText(): string {
        //console.log({ baseLineMinutesPerDay, totalMinutes, minutesNeeded, remainingDays, dailyHoursNeeded });
        const difference = baseLineMinutesPerDay - dailyHoursNeeded;
        const timeDifference = minutesToHours(Math.abs(difference));

        if (difference > 1) {
            return `You're ahead of schedule! Current pace: ${timeDifference.hours == 0 ? '' : timeDifference.hours + 'hr '}${timeDifference.minutes.toFixed(0)}min needed per day!`;
        } else if (difference < 1) {
            return `You're behind schedule... You need ~${timeDifference.hours == 0 ? '' : timeDifference.hours + 'hr '}${timeDifference.minutes.toFixed(0)}min more per day.`;
        } else {
            return "You're on track to reach your goal!";
        }
    }

    return (
        <Card className="gap-4 col-span-1 max-w-full xs:max-w-[45%] min-w-48 xs:col-span-2 xs:min-w-96">
			<CardHeader>
				<CardDescription>
					Total Time this Year
				</CardDescription>

				<CardTitle className="text-2xl text-nowrap font-semibold tabular-nums @[250px]/card:text-3xl">
					<Suspense fallback={<span>--hr --min</span>}>
						{totalTime.hours}hr {totalTime.minutes}min
					</Suspense>
				</CardTitle>
                <Progress value={percentComplete} max={100} className="w-full h-2 mt-2" />
                <p className="text-sm font-medium text-gray-600">
                    {percentage.toFixed(1)}% of goal
                </p>
			</CardHeader>
		    <CardFooter>{getProgressText()}</CardFooter>
		</Card>
    );
};