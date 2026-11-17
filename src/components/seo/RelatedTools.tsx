import Link from "next/link";
import { getToolBySlug, getGuideBySlug } from "@/data/tools-registry";

interface RelatedToolsProps {
  relatedToolSlugs: string[];
  relatedGuideSlugs: string[];
}

export function RelatedTools({ relatedToolSlugs, relatedGuideSlugs }: RelatedToolsProps) {
  const tools = relatedToolSlugs.map((slug) => getToolBySlug(slug)).filter(Boolean);
  const guides = relatedGuideSlugs.map((slug) => getGuideBySlug(slug)).filter(Boolean);

  return (
    <section className="my-10 rounded-3xl border border-black/[0.08] bg-white p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.03)] print:hidden">
      <div className="flex items-center gap-2 mb-2">
        <span className="size-1.5 rounded-full bg-black" />
        <span className="text-xs font-mono font-medium uppercase tracking-wider text-zinc-500">
          Related Ecosystem
        </span>
      </div>
      <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-black">
        Related Calculators & Guides
      </h2>
      <p className="mt-1 text-xs sm:text-sm text-zinc-500">
        Compare platforms, calculate advertising break-evens, and read in-depth fee strategies.
      </p>

      {tools.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
            Recommended Calculators
          </h3>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((t) => (
              <Link
                key={t!.slug}
                href={`/tools/${t!.slug}`}
                className="group rounded-2xl border border-black/[0.08] p-4 transition-all hover:border-black/40 hover:shadow-2xs bg-white"
              >
                <h4 className="text-sm font-semibold text-black group-hover:underline flex items-center justify-between">
                  <span>{t!.title}</span>
                  <span className="font-mono text-xs text-zinc-400 group-hover:text-black">→</span>
                </h4>
                <p className="mt-1 line-clamp-2 text-xs text-zinc-500">
                  {t!.shortDescription}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {guides.length > 0 && (
        <div className="mt-6 border-t border-black/[0.06] pt-5">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
            In-Depth Seller Guides
          </h3>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {guides.map((g) => (
              <Link
                key={g!.slug}
                href={`/guides/${g!.slug}`}
                className="group rounded-2xl border border-black/[0.08] bg-black/[0.02] p-4 transition hover:border-black/30"
              >
                <div className="flex items-center gap-2 text-[10px] text-black font-mono font-semibold uppercase">
                  <span>Pillar Guide</span>
                  <span>•</span>
                  <span>{g!.estimatedReadMinutes} min read</span>
                </div>
                <h4 className="mt-1 text-sm font-semibold text-black group-hover:underline">
                  {g!.title}
                </h4>
                <p className="mt-1 line-clamp-2 text-xs text-zinc-500">
                  {g!.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
