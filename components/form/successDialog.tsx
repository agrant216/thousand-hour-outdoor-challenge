"use client";

import { Button } from "../ui/button";
import { CheckCircle2, LoaderCircleIcon } from "lucide-react";

type Props = {
	onClose: () => void;
	onAddEntry: () => void;
	isLoading: boolean;
};

export default function SuccessDialog(props: Props) {
	return (
		<div className="flex flex-col items-center justify-center space-y-4 py-8 text-center min-h-70.5">
			{props.isLoading ? (
				<LoaderCircleIcon className="h-12 w-12 text-gray-500 animate-spin" />
			) : (
				<>
					<CheckCircle2 className="h-12 w-12 text-green-500" />
					<div className="space-y-2">
						<h3 className="text-lg font-semibold">Submission Successful!</h3>
						<p className="text-sm text-muted-foreground">Your entry has been submitted!</p>
					</div>
					<div className="flex flex-row gap-x-2">
						<Button variant="outline" onClick={props.onClose}>
							Close
						</Button>
						<Button onClick={props.onAddEntry}>Add Another Entry</Button>
					</div>
				</>
			)}
		</div>
	);
}

