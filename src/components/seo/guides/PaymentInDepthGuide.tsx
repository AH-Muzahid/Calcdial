import { BookOpen } from "lucide-react";

export function PaymentInDepthGuide() {
  return (
    <article className="my-10 border-t border-b border-zinc-200 py-10 text-zinc-900 font-sans">
      {/* Header */}
      <div className="max-w-3xl">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-600 mb-2">
          <BookOpen className="size-3.5" />
          <span>Merchant &amp; Freelancer Financial Methodology</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 leading-tight">
          How Stripe vs PayPal Fees Work in 2026: Mathematical Gross-Up Formulas, Cross-Border Traps &amp; Payout Architecture
        </h2>
        <p className="mt-2 text-sm sm:text-base text-zinc-700 leading-relaxed">
          A rigorous financial breakdown of credit card gateway spreads, digital invoicing economics, cross-border foreign exchange traps, and the exact mathematical formula to gross-up client invoices so you keep 100% of your target earnings.
        </p>
      </div>

      {/* SECTION 1: The Core Deduction Mechanics */}
      <section className="mt-8 max-w-3xl space-y-4">
        <h3 className="text-lg sm:text-xl font-bold text-zinc-950 tracking-tight">
          1. The Core Deduction Mechanics: How Stripe &amp; PayPal Extract Fees
        </h3>
        <p className="text-sm text-zinc-800 leading-relaxed">
          Every time a payment gateway processes a transaction, it charges a two-tier fee structure: a <strong>variable percentage rate</strong> applied to the gross charge, plus a <strong>fixed transaction fee</strong> that covers interchange clearing and card network authorization. While both platforms seem similar on the surface, their rates diverge significantly depending on transaction channel:
        </p>

        <div className="space-y-4 pt-1">
          <div className="border-l-2 border-zinc-900 pl-4 py-0.5">
            <h4 className="text-sm font-bold text-zinc-950">
              Online Card Checkout: Stripe (2.9% + $0.30) vs PayPal (3.49% + $0.49)
            </h4>
            <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed mt-0.5">
              For eCommerce storefronts and standard checkout forms, Stripe charges 2.9% + $0.30 per domestic card transaction. PayPal assesses 3.49% + $0.49 on standard checkout buttons. This means PayPal charges a <strong>20.3% higher percentage rate</strong> and a <strong>63.3% higher fixed fee</strong> on the exact same card swipe. On a $100 checkout, Stripe takes $3.20 while PayPal takes $3.98.
            </p>
          </div>

          <div className="border-l-2 border-zinc-900 pl-4 py-0.5">
            <h4 className="text-sm font-bold text-zinc-950">
              Digital Client Invoicing: Stripe (3.3% + $0.30) vs PayPal (2.99% + $0.49)
            </h4>
            <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed mt-0.5">
              When issuing digital invoices, the dynamics shift. Stripe includes a 0.40% Starter invoicing surcharge on paid invoices (bringing card payments to 3.30% + $0.30). PayPal Invoicing drops its rate to 2.99% + $0.49. At a ticket size of <strong>$61.29</strong>, both gateways cost exactly $2.32. Below $61, Stripe is cheaper due to its lower fixed fee; above $61, PayPal takes a smaller cut on credit cards—unless the merchant enables Stripe ACH bank debit.
            </p>
          </div>

          <div className="border-l-2 border-zinc-900 pl-4 py-0.5">
            <h4 className="text-sm font-bold text-zinc-950">
              ACH Direct Debit (US Bank Transfer): Stripe (0.80% Max $5.00) vs PayPal (N/A)
            </h4>
            <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed mt-0.5">
              Stripe natively supports automated US ACH Direct Debit clearing for invoices at 0.80% with an absolute maximum cap of $5.00 per transaction. On a $10,000 corporate invoice, credit card processing through PayPal costs $299.49, and Stripe card processing costs $330.30. Invoicing via Stripe ACH costs exactly <strong>$5.00 total</strong>, preserving $325.30 in pure profit.
            </p>
          </div>

          <div className="border-l-2 border-zinc-900 pl-4 py-0.5">
            <h4 className="text-sm font-bold text-zinc-950">
              Dispute &amp; Chargeback Surcharges: Stripe ($15.00 Refundable) vs PayPal ($20.00 Non-Refundable)
            </h4>
            <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed mt-0.5">
              When a buyer files a dispute, Stripe debits a $15.00 fee. If you submit evidence and win the dispute, Stripe refunds the $15.00 back to your account. PayPal charges a $20.00 dispute fee ($15.00 for standard volume merchants) that is non-refundable regardless of dispute outcome.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2: The Gross-Up Formula */}
      <section className="mt-10 max-w-3xl space-y-4">
        <h3 className="text-lg sm:text-xl font-bold text-zinc-950 tracking-tight">
          2. The Mathematical Gross-Up Formula: Why Adding 2.9% Leaves You Short
        </h3>
        <p className="text-sm text-zinc-800 leading-relaxed">
          The single most common mistake made by agency owners, consultants, and freelancers when covering processing fees is using the <em>additive markup</em> formula instead of the <em>true divisor gross-up</em> formula.
        </p>

        {/* The Naive Mistake Box */}
        <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-4 space-y-2 text-xs sm:text-sm text-rose-950">
          <span className="font-bold uppercase tracking-wider text-[11px] text-rose-800 font-mono block">
            The Naive Additive Calculation (The $1,000 Trap)
          </span>
          <p className="leading-relaxed">
            Suppose your contract rate is $1,000 net. You know Stripe charges 2.9% + $0.30, so you add 2.9% ($29.00) + $0.30 = $1,029.30 and invoice the client for $1,029.30.
          </p>
          <p className="leading-relaxed font-mono">
            Stripe Fee = ($1,029.30 × 0.029) + $0.30 = $29.85 + $0.30 = $30.15<br />
            Bank Deposit = $1,029.30 - $30.15 = <strong>$999.15 (Short by $0.85)</strong>
          </p>
          <p className="text-[11px] text-rose-800 leading-normal">
            Why? Because Stripe takes 2.9% of the <em>total charged invoice amount</em> ($1,029.30), not just your target $1,000. You failed to pay the fee on the fee! On a $10,000 invoice, this naive calculation costs you over $90.
          </p>
        </div>

        <p className="text-sm text-zinc-800 leading-relaxed pt-1">
          To receive exactly your target payout into your bank account, you must derive the equation from first principles:
        </p>

        {/* Derivation Equation Box */}
        <div className="rounded-xl border border-zinc-200 bg-zinc-50/90 p-4 font-mono text-xs sm:text-sm text-zinc-900 space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 font-sans">
            Mathematical Derivation
          </div>
          <p>
            Net Deposit = Gross Invoice - Processing Fee<br />
            Target Payout = Gross - [(Gross × Rate) + Fixed Fee]<br />
            Target Payout = Gross × (1 - Rate) - Fixed Fee<br />
            Target Payout + Fixed Fee = Gross × (1 - Rate)
          </p>
          <div className="pt-2 border-t border-zinc-200 text-sm font-bold text-zinc-950">
            Gross Invoice Amount = (Target Payout + Fixed Fee) / (1 - Rate)
          </div>
        </div>

        {/* Worked Proof */}
        <div className="space-y-3 pt-2">
          <h4 className="text-sm font-bold text-zinc-950">
            Step-by-Step Proof for a $1,000 Target Payout on Stripe (2.9% + $0.30)
          </h4>
          <ol className="list-decimal list-inside space-y-1.5 text-xs sm:text-sm text-zinc-800">
            <li>
              <strong>Add the fixed fee to target payout:</strong> $1,000.00 + $0.30 = $1,000.30
            </li>
            <li>
              <strong>Calculate retention divisor:</strong> 1 - 0.029 = 0.971
            </li>
            <li>
              <strong>Divide numerator by divisor:</strong> $1,000.30 ÷ 0.971 = <strong>$1,030.18</strong>
            </li>
          </ol>
          <div className="rounded-lg bg-emerald-50 border border-emerald-200/80 p-3 text-xs text-emerald-950 font-mono">
            <strong>Reconciliation Check:</strong><br />
            Stripe Fee = ($1,030.18 × 0.029) + $0.30 = $29.875 + $0.30 = $30.18<br />
            Net Bank Payout = $1,030.18 - $30.18 = <strong>$1,000.00 EXACT</strong>
          </div>
        </div>
      </section>

      {/* SECTION 3: Hidden Margin Traps */}
      <section className="mt-10 max-w-3xl space-y-4">
        <h3 className="text-lg sm:text-xl font-bold text-zinc-950 tracking-tight">
          3. Four Hidden Traps That Erode Merchant Margins
        </h3>
        <p className="text-sm text-zinc-800 leading-relaxed">
          Beyond standard published rates, both payment processors enforce subtle surcharge policies that can silently strip 3% to 6% of gross turnover if left unmonitored:
        </p>

        <ul className="space-y-4 pt-1">
          <li className="space-y-1">
            <div className="text-sm font-bold text-zinc-950">
              Trap A: The Cross-Border Double-Dip (International Card + FX Margin)
            </div>
            <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed">
              When a foreign customer completes a checkout using an international card, processors trigger two separate fees: an international card authorization fee (+1.50% on both platforms) and a foreign exchange currency conversion fee. Stripe charges a transparent 1.0% conversion fee (total 5.40% + $0.30). PayPal, however, charges an aggressive <strong>3.0% to 4.0% FX markup spread</strong> over wholesale exchange rates (totaling <strong>7.99% to 8.99% + $0.49</strong>). On a $1,000 international transaction, PayPal takes up to $85.39 versus $54.30 on Stripe—costing you an extra $31.09 per payment.
            </p>
          </li>

          <li className="space-y-1">
            <div className="text-sm font-bold text-zinc-950">
              Trap B: Non-Refundable Processing Fees on Customer Returns
            </div>
            <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed">
              When you issue a full refund to a customer, payment processors do not refund the credit card interchange fees. If a customer purchases a $300 product and requests a return 5 days later, you refund $300 back to the customer, but Stripe retains the $9.00 processing cut and PayPal retains $10.96. For eCommerce merchants with an 8% to 12% return rate, unrecovered transaction fees quietly drain 0.35% to 0.50% of annual top-line revenue.
            </p>
          </li>

          <li className="space-y-1">
            <div className="text-sm font-bold text-zinc-950">
              Trap C: PayPal Automated Rolling Reserves &amp; 180-Day Holds
            </div>
            <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed">
              PayPal utilizes automated heuristic risk engines that frequently place accounts under 21-day payment delays or 180-day rolling reserves (where 10% to 20% of all gross sales volume is sequestered in escrow for 6 months). This policy is triggered by rapid revenue growth, pre-order products, or spikes in buyer disputes. Stripe uses continuous ML risk scoring (Stripe Radar) but rarely initiates blanket rolling reserves for standard SaaS or verified eCommerce sellers.
            </p>
          </li>

          <li className="space-y-1">
            <div className="text-sm font-bold text-zinc-950">
              Trap D: Microtransaction Margin Collapse on Orders Under $10
            </div>
            <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed">
              Because both processors charge a fixed fee on every authorization ($0.30 on Stripe, $0.49 on PayPal), low-ticket items suffer astronomical effective percentage cuts. On a $5 digital item, Stripe takes $0.45 (<strong>9.0% effective rate</strong>), while PayPal takes $0.66 (<strong>13.2% effective rate</strong>). Merchants selling micro-goods should either bundle products into $20+ baskets or apply for specialized micropayment merchant tiers (PayPal Micropayments: 4.99% + $0.09).
            </p>
          </li>
        </ul>
      </section>

      {/* SECTION 4: Tactical Merchant Playbook */}
      <section className="mt-10 max-w-3xl space-y-4">
        <h3 className="text-lg sm:text-xl font-bold text-zinc-950 tracking-tight">
          4. Tactical Merchant Playbook: 4 Rules to Maximize Net Deposits
        </h3>

        <div className="space-y-4 pt-1">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-zinc-950">
              Rule 1: Standardize Core Checkout on Stripe for 0.59% + $0.19 Margin Expansion
            </h4>
            <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed">
              For your primary checkout architecture, use Stripe Elements with 1-click Express Checkout (Apple Pay, Google Pay, Link). You capture lower domestic card fees (2.9% + $0.30 vs 3.49% + $0.49) and eliminate redirect friction, reducing cart abandonment while keeping an extra $0.78 on every $100 processed.
            </p>
          </div>

          <div className="space-y-1">
            <h4 className="text-sm font-bold text-zinc-950">
              Rule 2: Keep PayPal as a Secondary Option to Protect Conversion
            </h4>
            <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed">
              Never remove PayPal completely from consumer eCommerce. Numerous industry A/B tests demonstrate that offering PayPal alongside credit card checkout lifts overall store conversion by 8% to 14%. Many consumers—particularly in Germany, the UK, and on mobile devices—refuse to enter raw credit card numbers on non-enterprise storefronts and prefer PayPal’s buyer protection.
            </p>
          </div>

          <div className="space-y-1">
            <h4 className="text-sm font-bold text-zinc-950">
              Rule 3: Migrate High-Ticket B2B Invoices to Stripe ACH Direct Debit
            </h4>
            <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed">
              When invoicing corporate clients for projects exceeding $1,000, explicitly designate ACH Direct Debit or bank wire as the preferred payment method. With Stripe’s 0.80% fee capped at $5.00, processing a $5,000 invoice costs exactly $5.00 instead of $165.30 on a credit card.
            </p>
          </div>

          <div className="space-y-1">
            <h4 className="text-sm font-bold text-zinc-950">
              Rule 4: Contractual Best Practices for Passing Gateway Fees
            </h4>
            <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed">
              Under US credit card surcharge regulations and EU PSD2 rules, charging explicit &quot;credit card surcharges&quot; is restricted or requires mandatory merchant registration. The legally compliant, professional approach is to state: <em>&quot;All fees quoted reflect an ACH/bank transfer discount. Invoices settled via credit card incur a standard 3% payment processing convenience fee.&quot;</em> Alternatively, simply use our calculator above to compute the exact grossed-up invoice figure before issuing the statement.
            </p>
          </div>
        </div>
      </section>
    </article>
  );
}
