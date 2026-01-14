"use client";

import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

import { Button, Group, Input, NumberField } from "react-aria-components";
import { useController, useFormContext } from "react-hook-form";

type NumberFieldInputProps = {
	name: string;
	size: string;
	unit: string;
};

const NumberFieldInput = (props: NumberFieldInputProps) => {
	const methods = useFormContext();
	const { field } = useController({
		name: props.name,
		control: methods.control,
	});

	return (
		<NumberField
			aria-label={props.name}
			defaultValue={0}
			minValue={0}
			value={field.value ?? 0}
			onChange={(val: number) => field.onChange(val)}
			formatOptions={{ style: "unit", unit: props.unit, unitDisplay: props.size == "sm" ? "short" : "long" }}
			className="w-full space-y-2"
		>
			<Group className="dark:bg-input/30 border-input data-focus-within:border-ring data-focus-within:ring-ring/50 data-focus-within:has-aria-invalid:ring-destructive/20 dark:data-focus-within:has-aria-invalid:ring-destructive/40 data-focus-within:has-aria-invalid:border-destructive relative inline-flex h-12 w-full min-w-0 items-center overflow-hidden rounded-md border bg-transparent text-base whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-50 data-focus-within:ring-[3px] md:text-sm">
				<Input
					//value={field.value ?? ""}
					inputMode="numeric"
					className="selection:bg-primary selection:text-primary-foreground w-full grow px-3 py-2 text-center tabular-nums outline-none"
				/>
				<div className="flex h-[calc(100%+2px)] flex-col">
					<Button
						slot="increment"
						className="border-input bg-background text-muted-foreground hover:bg-accent hover:text-foreground -me-px flex h-1/2 w-7 flex-1 items-center justify-center border text-md transition-[color,box-shadow] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
					>
						<ChevronUpIcon className="size-4" />
						<span className="sr-only">Increment</span>
					</Button>
					<Button
						slot="decrement"
						className="border-input bg-background text-muted-foreground hover:bg-accent hover:text-foreground -me-px -mt-px flex h-1/2 w-7 flex-1 items-center justify-center border text-md transition-[color,box-shadow] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
					>
						<ChevronDownIcon className="size-4" />
						<span className="sr-only">Decrement</span>
					</Button>
				</div>
			</Group>
		</NumberField>
	);
};

export default NumberFieldInput;

