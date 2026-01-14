"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useController, useFormContext } from "react-hook-form";

function dateIsToday(date: Date) {
	return date.toDateString() === new Date().toDateString();
}

export function DatePicker() {
	const [open, setOpen] = React.useState(false);
	const methods = useFormContext();

	const { field } = useController({
		name: "date",
		control: methods.control,
	});
	const selectedDate = field.value as Date | undefined;

	return (
		<div className="flex flex-col gap-3">
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button variant="outline" id="date">
						{selectedDate && dateIsToday(selectedDate) ? "Today" : selectedDate?.toLocaleDateString()}
						<ChevronDownIcon />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto overflow-hidden p-0" align="start">
					<Calendar
						mode="single"
						selected={selectedDate}
						captionLayout="dropdown"
						onSelect={(date) => {
							field.onChange(date);
							setOpen(false);
						}}
					/>
				</PopoverContent>
			</Popover>
		</div>
	);
}

export default DatePicker;

