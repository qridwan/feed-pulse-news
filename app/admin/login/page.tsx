"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { LoginHeader } from "@/components/admin/LoginHeader";

const loginSchema = z.object({
	email: z.string().min(1, "Email is required").email("Invalid email address"),
	password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters"),
	remember: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get("callbackUrl") ?? "/admin";
	const [submitError, setSubmitError] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
		defaultValues: { email: "", password: "", remember: false },
	});

	async function onSubmit(data: LoginFormData) {
		setSubmitError(null);
		try {
			const result = await signIn("credentials", {
				email: data.email,
				password: data.password,
				redirect: false,
			});

			if (result?.error) {
				setSubmitError(result.error);
				return;
			}

			if (result?.ok) {
				router.push(callbackUrl);
				router.refresh();
				return;
			}

			setSubmitError("Something went wrong. Please try again.");
		} catch {
			setSubmitError("Something went wrong. Please try again.");
		}
	}

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-neutral-100 px-4">
			<div className="w-full max-w-sm">
				<LoginHeader />

				<form
					onSubmit={handleSubmit(onSubmit)}
					className="rounded-2xl bg-white p-6 shadow-sm border border-neutral-200/80"
				>
					{submitError && (
						<div
							role="alert"
							className="mb-4 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-800"
						>
							{submitError}
						</div>
					)}

					<div className="space-y-4">
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-neutral-700 mb-1.5"
							>
								Email
							</label>
							<input
								id="email"
								type="email"
								autoComplete="email"
								disabled={isSubmitting}
								className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent disabled:opacity-60 disabled:cursor-not-allowed"
								placeholder="you@example.com"
								{...register("email")}
							/>
							{errors.email && (
								<p className="mt-1.5 text-sm text-red-600">{errors.email.message}</p>
							)}
						</div>

						<div>
							<label
								htmlFor="password"
								className="block text-sm font-medium text-neutral-700 mb-1.5"
							>
								Password
							</label>
							<input
								id="password"
								type="password"
								autoComplete="current-password"
								disabled={isSubmitting}
								className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent disabled:opacity-60 disabled:cursor-not-allowed"
								placeholder="••••••••"
								{...register("password")}
							/>
							{errors.password && (
								<p className="mt-1.5 text-sm text-red-600">{errors.password.message}</p>
							)}
						</div>

						<div className="flex items-center">
							<input
								id="remember"
								type="checkbox"
								disabled={isSubmitting}
								className="h-4 w-4 rounded border-neutral-300 text-neutral-600 focus:ring-neutral-400"
								{...register("remember")}
							/>
							<label htmlFor="remember" className="ml-2 text-sm text-neutral-600">
								Remember me
							</label>
						</div>
					</div>

					<button
						type="submit"
						disabled={isSubmitting}
						className="mt-6 w-full rounded-xl bg-neutral-800 py-3 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
					>
						{isSubmitting ? (
							<>
								<span
									className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
									aria-hidden
								/>
								Signing in…
							</>
						) : (
							"Sign in"
						)}
					</button>
				</form>

				<p className="mt-6 text-center text-xs text-neutral-400">
					Admin access only. Contact your administrator if you need access.
				</p>
			</div>
		</div>
	);
}
