"use client";

import { useEffect, useMemo, useState } from "react";

export default function PageLoader() {
	const [isVisible, setIsVisible] = useState(true);
	const [isFadingOut, setIsFadingOut] = useState(false);

	const minVisibleMs = useMemo(() => 450, []);

	useEffect(() => {
		const mountTime = performance.now();

		const beginHide = () => {
			const elapsed = performance.now() - mountTime;
			const wait = Math.max(0, minVisibleMs - elapsed);

			window.setTimeout(() => {
				setIsFadingOut(true);
				window.setTimeout(() => setIsVisible(false), 320);
			}, wait);
		};

		if (document.readyState === "complete") {
			beginHide();
			return;
		}

		window.addEventListener("load", beginHide, { once: true });
		return () => {
			window.removeEventListener("load", beginHide);
		};
	}, [minVisibleMs]);

	if (!isVisible) return null;

	return (
		<div className={`page-loader ${isFadingOut ? "page-loader--hidden" : ""}`} aria-live="polite" aria-busy="true">
			<div className="page-loader__content">
				<div className="page-loader__ring" aria-hidden="true" />
				<p className="page-loader__text">Loading Mile</p>
			</div>
		</div>
	);
}
