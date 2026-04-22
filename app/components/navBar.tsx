"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/hooks/api/useAuth";
import {
    LayoutDashboard,
    TrendingUp,
    ArrowLeftRight,
    LineChart,
    BarChart2,
    History,
    Briefcase,
    User,
    Settings,
    LogOut,
    ChevronDown,
    Wallet,
} from "lucide-react";

type LinkItem = {
    label: string;
    href: string;
    icon: React.ReactNode;
};

type DropdownItem = {
    label: string;
    icon: React.ReactNode;
    children: LinkItem[];
};

type NavItem = LinkItem | DropdownItem;

function isDropdownItem(item: NavItem): item is DropdownItem {
    return "children" in item;
}

const navItems: NavItem[] = [
    { label: "Dashboard", href: "/mainApp?view=dashboard", icon: <LayoutDashboard size={16} /> },
    {
        label: "Investments",
        icon: <Wallet size={16} />,
        children: [
            { label: "Positions", href: "/mainApp/positions", icon: <TrendingUp size={14} /> },
            { label: "Transactions", href: "/mainApp/transactions", icon: <ArrowLeftRight size={14} /> },
        ],
    },
    {
        label: "Analytics",
        icon: <LineChart size={16} />,
        children: [
            { label: "Performance", href: "/mainApp/analytics/performance", icon: <BarChart2 size={14} /> },
            { label: "Benchmarks", href: "/mainApp/analytics/benchmarks", icon: <LineChart size={14} /> },
            { label: "Historic Returns", href: "/mainApp/returns", icon: <History size={14} /> },
        ],
    },
];

const bottomItems = [
    { label: "Portfolio", href: "/mainApp/portfolio", icon: <Briefcase size={16} /> },
    { label: "Profile", href: "/mainApp/profile", icon: <User size={16} /> },
    { label: "Settings", href: "/mainApp/settings", icon: <Settings size={16} /> },
];

export default function NavBar() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { logout } = useAuth();

    function isActive(href: string): boolean {
        const [hrefPath, hrefQuery] = href.split("?");
        if (hrefQuery) {
            const params = new URLSearchParams(hrefQuery);
            return pathname === hrefPath && searchParams.get("view") === params.get("view");
        }
        return pathname === hrefPath;
    }

    const activeClass = "text-white bg-surface rounded-sm";
    const baseClass = "flex items-center gap-2 px-2 py-1.5 text-sm text-gray-400 hover:text-gray-200 rounded-sm";

    function handleLogout() {
        logout();
        router.push("/auth/login");
    }

    return (
        <div className="flex h-full w-64 flex-shrink-0 flex-col justify-between bg-mainapp border-r border-surface">
            <nav className="mx-4 flex flex-col mt-6">
                <Image src="/logo/LogoHeader.png" alt="Logo" width={100} height={50} />
                <ul className="mt-6 flex flex-col gap-1">
                    {navItems.map((item) => {
                        if (isDropdownItem(item)) {
                            return (
                                <li key={item.label}>
                                    <details className="group" open>
                                        <summary className="flex cursor-pointer list-none items-center justify-between px-2 py-1.5 text-sm font-semibold text-gray-400 hover:text-gray-200">
                                            <span className="flex items-center gap-2">
                                                {item.icon}
                                                {item.label}
                                            </span>
                                            <ChevronDown size={14} className="text-gray-500 transition-transform group-open:rotate-180" />
                                        </summary>
                                        <ul className="mt-1 ml-2 flex flex-col gap-0.5 border-l border-surface pl-3">
                                            {item.children.map((child) => (
                                                <li key={child.label}>
                                                    <Link
                                                        href={child.href}
                                                        className={`${baseClass} ${isActive(child.href) ? activeClass : ""}`}
                                                    >
                                                        {child.icon}
                                                        {child.label}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </details>
                                </li>
                            );
                        }

                        return (
                            <li key={item.label}>
                                <Link
                                    href={item.href}
                                    className={`${baseClass} font-semibold ${isActive(item.href) ? activeClass : ""}`}
                                >
                                    {item.icon}
                                    {item.label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
            <nav>
                <ul className="mx-4 mb-6 flex flex-col gap-1">
                    {bottomItems.map((item) => (
                        <li key={item.label}>
                            <Link href={item.href} className={`${baseClass} ${isActive(item.href) ? activeClass : ""}`}>
                                {item.icon}
                                {item.label}
                            </Link>
                        </li>
                    ))}
                    <li>
                        <button
                            type="button"
                            onClick={handleLogout}
                            className={baseClass}
                        >
                            <LogOut size={16} />
                            Logout
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
}
