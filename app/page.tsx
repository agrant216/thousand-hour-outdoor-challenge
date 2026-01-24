import FormDialogModal from "@/components/form/formDialogModal";
import Dashboard from "@/components/widgets/dashboard";

export default function Home() {
	return (
		<>
			<h1 className="text-2xl font-bold m-4">Hannah&apos;s Thousand Hour Outside Challenge</h1>
			<FormDialogModal />
			<Dashboard />
		</>
	);
}

