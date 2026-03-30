"use client";


export default function LandingSecondSection() {
    return (
        <section className="w-full h-[75vh] flex items-center justify-center relative">
            <p className="text-2xl text-white/80 max-w-3xl text-center">
               Mile is a personal investment portfolio platform built for investors who want a clear, real-time view of their wealth across every asset class — stocks, ETFs, index funds, crypto, bonds, gold, and cash.
                <br />
                <br />
                <span className="text-2xl font-bold font-serif text-[#FFB95D]">Track everything in one place </span>
                Add your positions and record transactions as you trade. FinanceTracker automatically calculates your average cost, total gain or loss, and current value — keeping your portfolio always up to date without any manual spreadsheet work.
                <br />
                <br />
                <span className="text-2xl font-bold font-serif text-[#FFB95D]">Multi-currency support </span>
                Invest globally without the headache. Positions in USD, EUR, GBP, or any other currency are automatically converted to your base currency using daily European Central Bank rates, so your portfolio summary is always in the currency that makes sense for you.                <br />
                <br />
                Experience the future of investment tracking with <a href="/auth/register" className="text-2xl font-bold font-serif text-[#FFB95D]">Mile</a> and take control of your financial journey today.
            </p>
            
        </section>
            
    );
}