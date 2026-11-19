<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

# AI Agent Workflow & Engineering Guidelines: `gstack`

This project uses **`gstack`** (by Garry Tan) to structure agent behavior into a disciplined virtual software team: CEO / Product Manager, Engineering Lead, UI/UX Designer, Reviewer, QA Automation Lead, and Release Engineer.

All AI agents (Antigravity, Claude Code, Cursor, Codex) working in this repository **must** follow the lifecycle and skill gates detailed below.

---

## 1. Core Engineering Loop

Whenever working on features, calculators, or fixes from `BUILD_PLAN.md`:

```
Think & Spec        Plan Review        Build & Design      Review & QA       Ship
(/office-hours,     (/plan-eng-review, (TDD + pure math    (/review,         (/ship)
 /spec)              /plan-ceo-review)  /design-review)     /qa)
```

Never jump straight into writing frontend code without verifying calculations and design requirements first.

---

## 2. When & How to Use `gstack` Skills in this Project

### Phase 1: Research & Tool Specification
- **`/gstack-browse` & `/gstack-scrape`:**
  - **When:** Auditing competitor tools (e.g., fee calculators, loan calculators) for `competitor-analysis.md`.
  - **Usage:** Extract competitor calculation models, tier rules, and UX shortcomings.
- **`/gstack-office-hours` & `/gstack-spec`:**
  - **When:** Starting a new milestone or adding a new calculator/tool from `BUILD_PLAN.md`.
  - **Usage:** Formulate the input parameters, calculation formula, default values, and pSEO requirements. Output a concrete spec before writing code.

### Phase 2: Architectural & Engineering Plan Review
- **`/gstack-plan-eng-review`:**
  - **When:** Designing state architecture, formula engine, or dataset schema.
  - **Rule:** Ensure calculation math is strictly separated into pure functions in `src/lib/calculators/<name>/` separate from React components.
- **`/gstack-plan-ceo-review`:**
  - **When:** Validating monetization potential, high-CPC intent, and user conversion loop (e.g., AdSense compliance, Journey by Mediavine 4-month requirements).

### Phase 3: Design & Anti-Slop Audit
- **`/gstack-design-review` & `/gstack-design-html`:**
  - **When:** Building or refining calculator UI components and mobile layouts.
  - **Rule:** Prevent "generic AI slop". Ensure:
    - Mobile-first responsiveness (large touch targets for number steppers/sliders).
    - Instant reactive outputs (debounced calculation updates).
    - Clear tabular visual breakdowns (fee splits, net vs gross).
    - AdSense-safe layout without content jumping (zero CLS).

### Phase 4: Rigorous Code Review
- **`/gstack-review`:**
  - **When:** Before finalizing any branch, commit, or pull request.
  - **Specific Checks for this Project:**
    1. **Decimal Precision:** Financial math must avoid JavaScript floating-point errors (e.g., `0.1 + 0.2`). Check cents rounding / integer math / Decimal utils.
    2. **Edge Cases:** Negative numbers, zero, astronomical values, missing optional fees.
    3. **Test Coverage:** Every math module must have unit tests with $\ge 90\%$ branch coverage.

### Phase 5: Automated Real Browser QA
- **`/gstack-qa` or `/gstack-qa-only`:**
  - **When:** After completing a calculator or interactive component.
  - **Usage:** Runs the real headless Playwright Chromium browser to:
    - Enter edge-case inputs in form fields.
    - Click toggle switches, dropdowns, and presets.
    - Verify that output numbers update accurately and layout does not break on mobile/desktop viewports.
    - Assert zero console errors or hydration mismatches.

### Phase 6: Production Verification & Shipping
- **`/gstack-ship`:**
  - **When:** Ready to merge or commit changes.
  - **Rule:** Runs the verification suite (`npm run verify` -> lint, tsc, vitest, build) and stages clean, atomic commits.

---

## 3. Mandatory Project Quality Guardrails

1. **Pure Calculation Engine:** UI components in `src/components/calculators/` must never contain raw calculation math. Math belongs in `src/lib/` and must be covered by unit tests in `vitest`.
2. **Next.js 16 App Router Compliance:** Read documentation from `node_modules/next/dist/docs/` before implementing server actions or metadata handlers.
3. **No Unreviewed Deployments:** Every PR or release slice must pass `/gstack-review` and `/gstack-qa` before deployment to Cloudflare or Vercel.
4. **Design Token Compliance:** All pages, calculators, cards, and buttons must strictly adhere to `DESIGN.md` (Roobert typography, `#010918` cosmic header, `#2b5cfd` pixel buttons, `rounded-xl` border radii). Never introduce conflicting styles or generic AI-generated layouts.

