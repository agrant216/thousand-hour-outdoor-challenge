"use client";

import { Button } from "./ui/button";
import { FormProvider, useForm } from "react-hook-form";
import NumberFieldInput from "./ui/numberfield";
import { useState } from "react";
import DatePicker from "./ui/date-picker";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Field, FieldGroup, FieldLabel } from "./ui/field";
import { submitTimeEntry } from "@/lib/actions";
import { FieldInputContext } from "react-aria-components";

interface IFormInput {
	hours: number;
	minutes: number;
	date: Date;
	note?: string;
}

export default function SubmitTimeForm() {
	const [shouldShowNotes, setShouldShowNotes] = useState(false);

	const form = useForm<IFormInput>({
		defaultValues: {
			hours: 0,
			minutes: 0,
			date: new Date(),
			note: "",
		},
	});

	function onSubmit(data: IFormInput) {
		// Do something with the form values.
		console.log(data);
		submitTimeEntry(data);
		form.reset();
	}

	return (
		<Card className="w-full sm:max-w-md">
			<CardHeader>
				<CardTitle>Time Entry</CardTitle>
				<CardDescription>Log your outdoor time today</CardDescription>
			</CardHeader>
			{/* <h3 className="block text-left text-lg font-medium">Log your outdoor time today:</h3> */}
			<CardContent>
				<FormProvider {...form}>
					<form id="time-entry" onSubmit={form.handleSubmit(onSubmit)}>
						<FieldGroup className="gap-5">
							<Field orientation="responsive">
								<FieldLabel>Time</FieldLabel>
								<NumberFieldInput name="hours" size="lg" unit="hour" />
								<NumberFieldInput name="minutes" size="lg" unit="minute" />
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
			</CardContent>
			<CardFooter>
				<Field orientation="horizontal">
					<Button type="button" form="time-entry" variant="outline" onClick={() => form.reset()}>
						Clear
					</Button>
					<Button type="submit" form="time-entry" variant="default">
						Submit
					</Button>
				</Field>
			</CardFooter>
		</Card>
	);
}

