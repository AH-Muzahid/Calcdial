import Link from "next/link";
import { getToolBySlug, getGuideBySlug } from "@/data/tools-registry";
import { ArrowRight, BookOpen } from "lucide-react";

interface RelatedToolsProps {
  relatedToolSlugs: string[];
  relatedGuideSlugs?: string[];
}

export function RelatedTools({ relatedToolSlugs }: RelatedToolsProps) {
  const tools = relatedToolSlugs.map((slug) => getToolBySlug(slug)).filter(Boolean);

  if (tools.length === 0) return null;

  return (
    <section className="my-5 pt-4 border-t border-zinc-200/70 print:hidden font-sans">
      <div className="flex items-center justify-between mb-2.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
          Related Calculators
        </h3>
        <span className="text-[11px] text-zinc-400 font-normal">
          Cross-check fees
        </span>
      </div>

      {/* Ultra-compact, Icon-Free Minimal Pills */}
      <div className="flex flex-wrap gap-2">
        {tools.map((t) => (
          <Link
            key={t!.slug}
            href={`/tools/${t!.slug}`}
            prefetch={false}
            className="group inline-flex items-center gap-1.5 rounded-lg border border-zinc-200/85 bg-zinc-50/70 hover:bg-white hover:border-[#2b5cfd] px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:text-[#2b5cfd] shadow-2xs hover:shadow-xs transition-all"
          >
            <span>{t!.title}</span>
            <ArrowRight className="size-3 text-zinc-400 group-hover:text-[#2b5cfd] group-hover:translate-x-0.5 transition-all" />
          </Link>
        ))}
      </div>
    </section>
  );
}

export function RelatedGuides({ guideSlugs }: { guideSlugs: string[] }) {
  const guides = guideSlugs.map((slug) => getGuideBySlug(slug)).filter(Boolean);
  if (guides.length === 0) return null;

  return (
    <section className="my-6 pt-5 border-t border-zinc-200/70 print:hidden font-sans">
      <div className="flex items-center justify-between mb-2.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
          Related Seller Guides
        </h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {guides.map((g) => (
          <Link
            key={g!.slug}
            href={`/guides/${g!.slug}`}
            prefetch={false}
            className="group inline-flex items-center gap-1.5 rounded-lg border border-zinc-200/85 bg-white hover:border-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:text-zinc-950 shadow-2xs transition-all"
          >
            <BookOpen className="size-3 text-zinc-400 group-hover:text-zinc-950" />
            <span>{g!.title}</span>
            <ArrowRight className="size-3 text-zinc-400 group-hover:translate-x-0.5 transition-all" />
          </Link>
        ))}
      </div>
    </section>
  );
}
