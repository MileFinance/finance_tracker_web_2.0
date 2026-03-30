"use client";

import Link from "next/link";
import LandingHeroClient from "@/app/components/landing/landingHeroClient";
import { useEffect, useState } from "react";
import LandingSecondSection from "./components/landing/secondSection";
import Image from "next/image";
import Connections from "./components/landing/connections";
import Footer from "./components/landing/footer";

function Header({ visible }: { visible: boolean }) {
	return (
		<header
			className={`fixed left-0 right-0 top-0 z-50 flex w-full flex-row items-center justify-between px-4 py-4 text-white transition-all duration-500 md:px-10 md:py-5 ${
				visible
					? "pointer-events-auto translate-y-0 bg-black/55 opacity-100 backdrop-blur-md"
					: "pointer-events-none -translate-y-4 opacity-0"
			}`}
		>
			<Image
				src="/logo/Logo.svg"
				alt="Mile logo"
				width={1600}
				height={400}
				priority
				className="h-8 w-auto"
			/>
			<div className="hidden md:block">
				<ul className="flex flex-row gap-6 text-lg font-bold">
					<li>Home</li>
					<li>About</li>
					<li>Features</li>
					<li>Support</li>
					<li>Contact</li>
				</ul>
			</div>
			<div>
				<ul className="flex flex-row gap-4 md:gap-6">
					<li>
						<Link href="/auth/login" className="hover:underline">
							Log In
						</Link>
					</li>
					<li>
						<Link href="/auth/register" className="hover:underline">
							Sign Up
						</Link>
					</li>
				</ul>
			</div>
		</header>
	);
}

export default function Home() {
	const [showHeader, setShowHeader] = useState(false);

	useEffect(() => {
		const heroSection = document.getElementById("landing-hero");
		if (!heroSection) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				setShowHeader(entry.intersectionRatio <= 0.5);
			},
			{
				threshold: 0.5,
			}
		);

		observer.observe(heroSection);

		return () => {
			observer.disconnect();
		};
	}, []);

	return (
		<div className="flex h-screen w-screen flex-col items-center bg-black font-sans overflow-y-auto hide-scrollbar">
			<main className="relative flex w-screen flex-col items-center bg-black">
				<Header visible={showHeader} />
				<LandingHeroClient sectionId="landing-hero" />
				
				<LandingSecondSection />
				<Connections />
				<Footer />
				
			</main>
		</div>
	);
}