export default function AdminSourcesLoading() {
	return (
		<div className="max-w-6xl space-y-6">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="h-9 w-64 rounded-xl bg-neutral-200 animate-pulse" />
				<div className="h-10 w-40 rounded-xl bg-neutral-200 animate-pulse" />
			</div>
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:flex-wrap">
				<div className="h-10 flex-1 min-w-[200px] rounded-xl bg-neutral-200 animate-pulse" />
				<div className="h-10 w-32 rounded-xl bg-neutral-200 animate-pulse" />
				<div className="h-10 w-40 rounded-xl bg-neutral-200 animate-pulse" />
			</div>
			<div className="overflow-x-auto rounded-2xl border border-neutral-200/80 bg-white shadow-sm">
				<table className="w-full min-w-[640px] text-left text-sm">
					<thead>
						<tr className="border-b border-neutral-200/80">
							<th className="py-3 pl-4 pr-2 font-medium text-neutral-500">Logo</th>
							<th className="py-3 px-2 font-medium text-neutral-500">Name</th>
							<th className="py-3 px-2 font-medium text-neutral-500">Website</th>
							<th className="py-3 px-2 font-medium text-neutral-500">News</th>
							<th className="py-3 px-2 font-medium text-neutral-500">Status</th>
							<th className="py-3 pl-2 pr-4 font-medium text-neutral-500 text-right">
								Actions
							</th>
						</tr>
					</thead>
					<tbody>
						{[1, 2, 3, 4, 5].map((i) => (
							<tr key={i} className="border-b border-neutral-100">
								<td className="py-3 pl-4 pr-2">
									<div className="h-10 w-10 rounded-lg bg-neutral-200 animate-pulse" />
								</td>
								<td className="py-3 px-2">
									<div className="h-5 w-32 rounded bg-neutral-200 animate-pulse" />
								</td>
								<td className="py-3 px-2">
									<div className="h-5 w-40 rounded bg-neutral-200 animate-pulse" />
								</td>
								<td className="py-3 px-2">
									<div className="h-5 w-8 rounded bg-neutral-200 animate-pulse" />
								</td>
								<td className="py-3 px-2">
									<div className="h-6 w-14 rounded-lg bg-neutral-200 animate-pulse" />
								</td>
								<td className="py-3 pl-2 pr-4">
									<div className="flex justify-end gap-2">
										<div className="h-8 w-12 rounded-lg bg-neutral-200 animate-pulse" />
										<div className="h-8 w-14 rounded-lg bg-neutral-200 animate-pulse" />
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
