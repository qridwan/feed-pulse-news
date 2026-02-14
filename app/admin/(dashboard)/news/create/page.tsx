import Link from "next/link";
import { getAllSources } from "@/lib/db/sources";
import { getAllTags } from "@/lib/db/tags";
import { NewsFormClient } from "@/app/admin/(dashboard)/news/new/NewsFormClient";

export default async function AdminNewsCreatePage() {
	const [sources, tags] = await Promise.all([
		getAllSources(false),
		getAllTags(),
	]);

	const defaultPublished = new Date();
	defaultPublished.setMinutes(0, 0, 0);
	const defaultPublishedStr = defaultPublished.toISOString().slice(0, 16);

	return (
		<div className="max-w-4xl">
			<div className="flex items-center gap-4 mb-6">
				<Link
					href="/admin/news"
					className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
				>
					← Back to list
				</Link>
			</div>
			<h1 className="text-2xl lg:text-3xl font-semibold tracking-tight text-neutral-900 mb-6">
				Create article
			</h1>
			<NewsFormClient
				sources={sources}
				tags={tags}
				defaultValues={{
					status: "DRAFT",
					tagIds: [],
					publishedDate: defaultPublishedStr,
				}}
			/>
		</div>
	);
}
