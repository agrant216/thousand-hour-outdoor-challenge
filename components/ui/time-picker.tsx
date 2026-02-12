'use client";';
import { useState } from "react";
import { Button } from "./button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import { WheelPickerWrapper, WheelPicker, WheelPickerOption } from "../wheel-picker";
import { useController, useFormContext } from "react-hook-form";

export function TimePicker() {
	const [open, setOpen] = useState(false);

	const handleComplete = () => {
		setOpen(false);
	};

	const createOptions = (unit: string, count: number): WheelPickerOption<number>[] =>
		Array.from({ length: count }, (_, i) => i).map((value) => ({
			label: String(value).padStart(2, " ") + ` ${unit}`,
			value: value,
		}));

	const hourOptions = createOptions("hr", 23);
	const minuteOptions = createOptions("min", 59);

	const methods = useFormContext();
	const { field: hoursField } = useController({
		name: "hours",
		control: methods.control,
		defaultValue: 0,
	});
	const { field: minutesField } = useController({
		name: "minutes",
		control: methods.control,
		defaultValue: 0,
	});

	const hours = Number(hoursField.value ?? 0);
	const minutes = Number(minutesField.value ?? 0);

	const displayTime =
		hours === 0 && minutes === 0
			? "Select Time"
			: hours > 0
				? `${String(hours)}hrs ${String(minutes)}mins`
				: `${String(minutes)}mins`;

	return (
		<>
			<Button className="min-h-13 text-xl" type="button" onClick={() => setOpen(true)} variant="outline">
				{displayTime}
			</Button>

			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="w-[90%] sm:w-90 h-110">
					<DialogHeader>
						<DialogTitle>Select Time</DialogTitle>
					</DialogHeader>

					<WheelPickerWrapper>
						<WheelPicker
							options={hourOptions}
							defaultValue={0}
							value={hours}
							onValueChange={(v) => hoursField.onChange(v)}
							visibleCount={12}
							optionItemHeight={52}
							infinite
						/>
						<WheelPicker
							options={minuteOptions}
							defaultValue={0}
							value={minutes}
							onValueChange={(v) => minutesField.onChange(v)}
							visibleCount={12}
							optionItemHeight={52}
							infinite
						/>
					</WheelPickerWrapper>

					<Button type="button" onClick={handleComplete} className="w-full h-14">
						Done
					</Button>
				</DialogContent>
			</Dialog>
		</>
	);
}

