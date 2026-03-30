"use client";

import Image from "next/image";
import Link from "next/link";

const footerLinks = {
	product: ["Dashboard", "Analytics", "Transactions", "Tax Reports"],
	company: ["About", "Security", "Careers", "Contact"],
	resources: ["Help Center", "API Docs", "Status", "Privacy"],
};

export default function Footer() {
	const year = new Date().getFullYear();

	return (
		<footer className="w-full bg-black pb-10 pt-8">
			<div className="mx-auto w-[calc(100vw-4rem)] md:w-[calc(100vw-3rem)]">
				<div className="hero-gradient-card rounded-3xl border border-white/15 p-6 sm:p-8">
					<div className="grid grid-cols-1 gap-8 md:grid-cols-[1.35fr_1fr_1fr_1fr] md:gap-6">
						<div>
							<Image
								src="/logo/Logo.svg"
								alt="Mile logo"
								width={1600}
								height={400}
								className="h-10 w-auto"
							/>
							<p className="mt-4 max-w-sm text-sm leading-relaxed text-white/75">
								A modern portfolio workspace to track holdings, performance, and risk with clarity.
							</p>
							<p className="mt-3 text-xs uppercase tracking-[0.16em] text-[#FFB95D]">
								Support: support@mile.app
							</p>
						</div>

						<div>
							<h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-white/85">Product</h3>
							<ul className="mt-3 space-y-2 text-sm text-white/70">
								{footerLinks.product.map((item) => (
									<li key={item}>
										<Link href="#" className="transition-colors hover:text-white">
											{item}
										</Link>
									</li>
								))}
							</ul>
						</div>

						<div>
							<h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-white/85">Company</h3>
							<ul className="mt-3 space-y-2 text-sm text-white/70">
								{footerLinks.company.map((item) => (
									<li key={item}>
										<Link href="#" className="transition-colors hover:text-white">
											{item}
										</Link>
									</li>
								))}
							</ul>
						</div>

						<div>
							<h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-white/85">Resources</h3>
							<ul className="mt-3 space-y-2 text-sm text-white/70">
								{footerLinks.resources.map((item) => (
									<li key={item}>
										<Link href="#" className="transition-colors hover:text-white">
											{item}
										</Link>
									</li>
								))}
							</ul>
						</div>
					</div>

					<div className="mt-8 flex flex-col gap-2 border-t border-white/10 pt-4 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
						<p>© {year} Mile. All rights reserved.</p>
						<p>Built for long-term investors and active portfolio tracking.</p>
					</div>
				</div>
			</div>
		</footer>
	);
}
