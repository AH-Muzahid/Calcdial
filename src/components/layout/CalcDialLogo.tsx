import Link from "next/link";
import Image from "next/image";

export function CalcDialLogo({ className = "", isDark = false }: { className?: string; isDark?: boolean }) {
  return (
    <Link href="/" className={`group inline-flex items-center gap-2.5 ${className}`}>
      <div className="relative size-9 flex-shrink-0 transition-transform duration-200 group-hover:scale-105">
        <Image
          src="/apple-touch-icon.png?v=2"
          alt="CalcDial App Icon"
          width={36}
          height={36}
          className="size-9 object-contain"
          priority
        />
      </div>

      <span className={`text-xl font-bold tracking-tight font-sans transition-colors ${isDark ? "text-white" : "text-zinc-950"}`}>
        Calc<span className="text-[#2b5cfd]">Dial</span>
      </span>
    </Link>
  );
}
