import Link from "next/link";
import { getToolBySlug, getGuideBySlug } from "@/data/tools-registry";
import { ToolIcon } from "@/components/common/ToolIcons";
import { ArrowRight, BookOpen } from "lucide-react";

interface RelatedToolsProps {
  relatedToolSlugs: string[];
  relatedGuideSlugs: string[];
}

export function RelatedTools({ relatedToolSlugs, relatedGuideSlugs }: RelatedToolsProps) {
  const tools = relatedToolSlugs.map((slug) => getToolBySlug(slug)).filter(Boolean);
  const guides = relatedGuideSlugs.map((slug) => getGuideBySlug(slug)).filter(Boolean);

  if (tools.length === 0 && guides.length === 0) return null;

  return (
    <section className="my-8 pt-6 border-t border-zinc-200 print:hidden">
      {/* Section Header - Clean, No outer card, No arbitrary badges */}
      <div className="pb-3">
        <h2 className="text-base sm:text-lg font-extrabold tracking-tight text-zinc-950">
          Related Calculators &amp; Seller Guides
        </h2>
        <p className="mt-0.5 text-xs text-zinc-600">
          Cross-check your margins on competing platforms and learn fee reduction strategies.
        </p>
      </div>

      {/* Recommended Calculators Grid */}
      {tools.length > 0 && (
        <div className="mt-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {tools.map((t) => (
              <Link
                key={t!.slug}
                href={`/tools/${t!.slug}`}
                className="group flex items-center justify-between gap-3 rounded-xl border border-zinc-200/90 bg-white p-3 shadow-2xs hover:border-zinc-950 hover:shadow-xs transition-all"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <ToolIcon slug={t!.slug} size="sm" />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs sm:text-sm font-bold text-zinc-950 group-hover:text-blue-600 transition-colors truncate">
                      {t!.title}
                    </h3>
                    <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                      {t!.shortDescription}
                    </p>
                  </div>
                </div>
                <ArrowRight className="size-4 shrink-0 text-zinc-400 group-hover:text-zinc-950 group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* In-Depth Guides Grid */}
      {guides.length > 0 && (
        <div className="mt-4 pt-4 border-t border-zinc-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {guides.map((g) => (
              <Link
                key={g!.slug}
                href={`/guides/${g!.slug}`}
                className="group flex items-center justify-between gap-3 rounded-xl border border-zinc-200/90 bg-white p-3 shadow-2xs hover:border-zinc-950 hover:shadow-xs transition-all"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="size-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-700 shrink-0">
                    <BookOpen className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
                      <span>Guide</span>
                      <span>•</span>
                      <span>{g!.estimatedReadMinutes} min read</span>
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-zinc-950 group-hover:text-blue-600 transition-colors truncate mt-0.5">
                      {g!.title}
                    </h3>
                  </div>
                </div>
                <ArrowRight className="size-4 shrink-0 text-zinc-400 group-hover:text-zinc-950 group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
