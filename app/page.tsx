import FormDialogModal from "@/components/form/formDialogModal";

export default function Home() {
	return (
		<div className="flex min-h-screen items-center justify-center font-sans">
			<h1 className="absolute top-8 left-8 text-2xl font-bold">Hannah&apos;s Thousand Hour Outside Challenge</h1>
			{/* <SubmitTimeForm /> */}
			<FormDialogModal />
		</div>
	);
}

