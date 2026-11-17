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
    <section className="my-10 rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.03)] print:hidden">
      <div className="flex items-center gap-2 mb-2">
        <span className="size-2 rounded-full bg-slate-900" />
        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500">
          Related Ecosystem
        </span>
      </div>
      <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
        Related Calculators & Guides
      </h2>
      <p className="mt-1 text-xs sm:text-sm text-slate-500">
        Compare platforms, calculate advertising break-evens, and read in-depth fee strategies.
      </p>

      {tools.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            Recommended Calculators
          </h3>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((t) => (
              <Link
                key={t!.slug}
                href={`/tools/${t!.slug}`}
                className="group rounded-2xl border border-slate-200 p-4 transition-all hover:border-emerald-500/80 hover:shadow-sm"
              >
                <h4 className="text-sm font-semibold text-slate-900 group-hover:text-emerald-600 flex items-center justify-between">
                  <span>{t!.title}</span>
                  <span className="font-mono text-xs">→</span>
                </h4>
                <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                  {t!.shortDescription}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {guides.length > 0 && (
        <div className="mt-6 border-t border-slate-100 pt-5">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            In-Depth Seller Guides
          </h3>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {guides.map((g) => (
              <Link
                key={g!.slug}
                href={`/guides/${g!.slug}`}
                className="group rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4 transition hover:bg-emerald-50 hover:border-emerald-200"
              >
                <div className="flex items-center gap-2 text-[10px] text-emerald-800 font-mono font-semibold uppercase">
                  <span>Pillar Guide</span>
                  <span>•</span>
                  <span>{g!.estimatedReadMinutes} min read</span>
                </div>
                <h4 className="mt-1 text-sm font-semibold text-gray-900 group-hover:text-emerald-700">
                  {g!.title}
                </h4>
                <p className="mt-1 line-clamp-2 text-xs text-gray-600">
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
