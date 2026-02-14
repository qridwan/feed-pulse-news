"use client";

import { useCallback, useState, useRef, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { DayPicker } from "react-day-picker";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import {
	parseDateFromParams,
	buildSearchParams,
} from "@/lib/news/filter-params";

type DateRange = { from: Date; to?: Date } | undefined;

export function DateFilter() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [showCustom, setShowCustom] = useState(false);
	const buttonRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);

	const { dateFrom, dateTo } = parseDateFromParams(searchParams);
	const range: DateRange =
		dateFrom && dateTo
			? { from: new Date(dateFrom), to: new Date(dateTo) }
			: dateFrom
				? { from: new Date(dateFrom) }
				: undefined;

	// Close popover when clicking outside
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				popoverRef.current &&
				!popoverRef.current.contains(event.target as Node) &&
				buttonRef.current &&
				!buttonRef.current.contains(event.target as Node)
			) {
				setShowCustom(false);
			}
		}

		if (showCustom) {
			document.addEventListener("mousedown", handleClickOutside);
			return () => document.removeEventListener("mousedown", handleClickOutside);
		}
	}, [showCustom]);

	// Close on escape
	useEffect(() => {
		function handleEscape(event: KeyboardEvent) {
			if (event.key === "Escape") {
				setShowCustom(false);
			}
		}

		if (showCustom) {
			document.addEventListener("keydown", handleEscape);
			return () => document.removeEventListener("keydown", handleEscape);
		}
	}, [showCustom]);

	const applyDateRange = useCallback(
		(from: string | null, to: string | null) => {
			const next = buildSearchParams({
				preserve: searchParams,
				dateFrom: from,
				dateTo: to,
				page: 1,
			});
			const q = next.toString();
			router.push(q ? `${pathname}?${q}` : pathname);
			setShowCustom(false);
		},
		[router, pathname, searchParams]
	);

	const today = startOfDay(new Date());
	const todayStr = format(today, "yyyy-MM-dd");

	const handleQuick = (days: number | "today") => {
		if (days === "today") {
			applyDateRange(todayStr, todayStr);
			return;
		}
		const to = endOfDay(new Date());
		const from = startOfDay(subDays(to, days - 1));
		applyDateRange(format(from, "yyyy-MM-dd"), format(to, "yyyy-MM-dd"));
	};

	const handleRangeSelect = (r: DateRange) => {
		if (!r?.from) {
			// User clicked outside or cleared selection
			return;
		}

		// Only apply and close the popover when we have a complete range (both from and to)
		if (r.from && r.to) {
			const fromStr = format(r.from, "yyyy-MM-dd");
			const toStr = format(r.to, "yyyy-MM-dd");
			applyDateRange(fromStr, toStr);
		}
		// If only 'from' is selected (r.to is undefined), keep popover open
		// The visual selection will update in the calendar, waiting for 'to' date
	};

	const clearDates = () => {
		applyDateRange(null, null);
	};

	const hasActive = Boolean(dateFrom || dateTo);
	const isToday = dateFrom === todayStr && dateTo === todayStr;
	const isLast7 = !isToday && dateFrom && dateTo &&
		Math.abs(new Date(dateTo).getTime() - new Date(dateFrom).getTime()) / (1000 * 60 * 60 * 24) <= 7;
	const isLast30 = !isToday && !isLast7 && dateFrom && dateTo &&
		Math.abs(new Date(dateTo).getTime() - new Date(dateFrom).getTime()) / (1000 * 60 * 60 * 24) <= 30;

	return (
		<div className="relative flex flex-wrap items-center gap-2">
			{/* Quick Filters - Compact Buttons */}
			<div className="inline-flex items-center gap-1">
				<button
					type="button"
					onClick={() => handleQuick("today")}
					className={`
            rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-150
            ${isToday
							? 'bg-neutral-900 text-white shadow-sm'
							: 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
						}
          `}
				>
					Today
				</button>
				<button
					type="button"
					onClick={() => handleQuick(7)}
					className={`
            rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-150
            ${isLast7
							? 'bg-neutral-900 text-white shadow-sm'
							: 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
						}
          `}
				>
					7 days
				</button>
				<button
					type="button"
					onClick={() => handleQuick(30)}
					className={`
            rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-150
            ${isLast30
							? 'bg-neutral-900 text-white shadow-sm'
							: 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
						}
          `}
				>
					30 days
				</button>
				<button
					ref={buttonRef}
					type="button"
					onClick={() => setShowCustom((v) => !v)}
					className={`
            rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-150 inline-flex items-center gap-1
            ${showCustom
							? 'bg-neutral-900 text-white shadow-sm'
							: 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
						}
          `}
					aria-expanded={showCustom}
					aria-haspopup="true"
				>
					Custom
					<svg
						className={`h-3 w-3 transition-transform duration-150 ${showCustom ? 'rotate-180' : ''}`}
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth="2.5"
						stroke="currentColor"
					>
						<path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
					</svg>
				</button>
			</div>

			{/* Active Filter Chip - Inline */}
			{hasActive && (
				<>
					<span className="hidden sm:inline text-neutral-300">|</span>
					<span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-100 pl-2.5 pr-2 py-1 text-xs font-medium text-blue-900">
						<svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
						</svg>
						{dateFrom && dateTo
							? `${format(new Date(dateFrom), "MMM d")} – ${format(new Date(dateTo), "MMM d")}`
							: dateFrom
								? format(new Date(dateFrom), "MMM d")
								: ""}
						<button
							type="button"
							onClick={clearDates}
							className="rounded-full p-0.5 hover:bg-blue-100 transition-colors"
							aria-label="Remove date filter"
						>
							<svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</span>
				</>
			)}

			{/* Custom Calendar Popover - Modern iOS Style */}
			{showCustom && (
				<>
					{/* Backdrop */}
					<div
						className="fixed inset-0 z-40 bg-black/5 backdrop-blur-[1px] animate-in fade-in duration-200"
						aria-hidden="true"
					/>

					{/* Popover */}
					<div
						ref={popoverRef}
						className="absolute left-0 sm:left-auto top-full mt-2 z-50 animate-in fade-in slide-in-from-top-3 duration-200"
						role="dialog"
						aria-modal="true"
						aria-label="Select date range"
					>
						<div className="rounded-2xl border border-neutral-200 bg-white shadow-2xl overflow-hidden">
							{/* Header */}
							<div className="flex items-center justify-between border-b border-neutral-100 bg-neutral-50/80 backdrop-blur-sm px-4 py-3">
								<h3 className="text-sm font-semibold text-neutral-900">
									Select Date Range
								</h3>
								<button
									type="button"
									onClick={() => setShowCustom(false)}
									className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors"
									aria-label="Close calendar"
								>
									<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
									</svg>
								</button>
							</div>

							{/* Calendar */}
							<div className="p-4">
								<DayPicker
									mode="range"
									selected={range}
									onSelect={handleRangeSelect}
									numberOfMonths={1}
									defaultMonth={range?.from ?? new Date()}
									className="rdp-ios"
								/>
							</div>

							{/* Footer - Quick Actions */}
							{hasActive && (
								<div className="flex items-center justify-between border-t border-neutral-100 bg-neutral-50/50 px-4 py-3">
									<span className="text-xs text-neutral-600">
										{dateFrom && dateTo
											? `${format(new Date(dateFrom), "MMM d, yyyy")} – ${format(new Date(dateTo), "MMM d, yyyy")}`
											: "Select a range"}
									</span>
									<button
										type="button"
										onClick={() => {
											clearDates();
											setShowCustom(false);
										}}
										className="rounded-lg px-3 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
									>
										Clear
									</button>
								</div>
							)}
						</div>
					</div>
				</>
			)}
		</div>
	);
}