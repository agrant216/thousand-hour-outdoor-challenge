import FormDialogModal from "@/components/form/formDialogModal";
import Dashboard from "@/components/widgets/dashboard";

export default function Home() {
	return (
		<>
			<h1 className="absolute top-8 left-8 text-2xl font-bold">Hannah&apos;s Thousand Hour Outside Challenge</h1>
			{/* <SubmitTimeForm /> */}
			<FormDialogModal />
			<Dashboard />
		</>
	);
}

