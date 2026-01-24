"use client";
import { submitTimeEntry } from "@/lib/actions";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ClockPlus } from "lucide-react";
import { Button } from "../ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import NumberFieldInput from "../ui/numberfield";
import DatePicker from "../ui/date-picker";
import SuccessDialog from "./successDialog";

interface IFormInput {
	hours: number;
	minutes: number;
	date: Date;
	note?: string;
}

export default function FormDialogModal() {
	const [shouldShowNotes, setShouldShowNotes] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

	const form = useForm<IFormInput>({
		defaultValues: {
			hours: 0,
			minutes: 0,
			note: "",
		},
	});

	async function onSubmit(data: IFormInput) {
		// Do something with the form values.
		console.log(data);
		setIsSubmitted(true);
		await submitTimeEntry(data);
		form.reset();
	}

	const handleOpenChange = (open: boolean) => {
		setIsOpen(open);
		if (!open) {
			setTimeout(() => {
				setIsSubmitted(false);
				form.reset();
			}, 300); // Delay reset until after close animation
		}
	};

	const handleAddAnotherEntry = () => {
		setIsSubmitted(false);
		form.reset();
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				<Button variant="outline" className="fixed bottom-5 right-5 rounded-full shadow-lg z-50" size="lg">
					<ClockPlus />
					Add Time
				</Button>
			</DialogTrigger>

			<DialogContent>
				<DialogHeader className="text-left">
					<DialogTitle>Time Entry</DialogTitle>
					<DialogDescription>Log your outdoor time today</DialogDescription>
				</DialogHeader>
				{isSubmitted ? (
					<SuccessDialog
						isLoading={form.formState.isSubmitting}
						onClose={() => handleOpenChange(false)}
						onAddEntry={() => handleAddAnotherEntry()}
					/>
				) : (
					<FormProvider {...form}>
						<form id="time-entry" onSubmit={form.handleSubmit(onSubmit)}>
							<FieldGroup className="gap-5">
								<Field orientation="vertical">
									<FieldLabel>Time</FieldLabel>
									<Field orientation="responsive">
										<NumberFieldInput name="hours" size="lg" unit="hour" />
										<NumberFieldInput name="minutes" size="lg" unit="minute" />
									</Field>
								</Field>
								<Field>
									<FieldLabel htmlFor="date">Date</FieldLabel>
									<DatePicker />
								</Field>
								<Field>
									{!shouldShowNotes && (
										<Button
											className="w-full"
											type="button"
											variant="outline"
											onClick={() => setShouldShowNotes(!shouldShowNotes)}
										>
											Add Note
										</Button>
									)}
									{shouldShowNotes && (
										<textarea
											aria-label="note"
											{...form.register("note")}
											className="cn-textarea field-sizing-content min-h-16 mt-2 w-full p-2 border rounded-lg"
											placeholder="Add a note..."
										/>
									)}
								</Field>
							</FieldGroup>
						</form>
					</FormProvider>
				)}
				{!isSubmitted && (
					<DialogFooter>
						<Field orientation="horizontal">
							<Button type="button" form="time-entry" variant="outline" onClick={() => form.reset()}>
								Clear
							</Button>
							<Button
								type="submit"
								form="time-entry"
								variant="default"
								disabled={form.formState.isSubmitting}
							>
								{form.formState.isSubmitting ? "Sending..." : "Submit"}
							</Button>
						</Field>
					</DialogFooter>
				)}
			</DialogContent>
		</Dialog>
	);
}
