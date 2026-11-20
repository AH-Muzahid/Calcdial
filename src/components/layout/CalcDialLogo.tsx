import Link from "next/link";
import Image from "next/image";

export function CalcDialLogo({ className = "", isDark = false }: { className?: string; isDark?: boolean }) {
  return (
    <Link href="/" className={`group inline-flex items-center gap-2.5 ${className}`}>
      <div className="relative size-9 flex-shrink-0 transition-transform duration-200 group-hover:scale-105">
        <Image
          src="/calcdial-app-icon-1024.png"
          alt="CalcDial App Icon"
          width={36}
          height={36}
          className="size-9 rounded-xl object-contain shadow-md ring-1 ring-white/15 drop-shadow-[0_2px_10px_rgba(43,92,253,0.4)]"
          priority
        />
      </div>

      <span className={`text-xl font-bold tracking-tight font-sans transition-colors ${isDark ? "text-white" : "text-zinc-950"}`}>
        Calc<span className="text-[#2b5cfd]">Dial</span>
      </span>
    </Link>
  );
}
