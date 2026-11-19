import { Roll, Stage, Window, type Act } from '../../kit'
import './calcdial.css'

type S = {
  priceStr: string
  costStr: string
  adsOn: boolean
  activeField: 'price' | 'none'
  showCaret: boolean
}

const initial: S = {
  priceStr: '25.00',
  costStr: '8.00',
  adsOn: false,
  activeField: 'none',
  showCaret: false,
}

const POSTER: S = {
  priceStr: '35.00',
  costStr: '8.00',
  adsOn: true,
  activeField: 'none',
  showCaret: false,
}

async function script(a: Act<S>) {
  await a.wait(800)
  a.mark('focus-price')
  await a.move({ at: 'price-input', x: 0.6, y: 0.5 }, { duration: 600 })
  await a.click({ at: 'price-input', x: 0.6, y: 0.5 })
  a.put({ activeField: 'price', showCaret: true })
  await a.wait(400)

  a.mark('type-price')
  a.put({ priceStr: '' })
  await a.type('priceStr', '35.00', { interval: 80 })
  await a.wait(500)
  a.put({ activeField: 'none', showCaret: false })

  a.mark('toggle-ads')
  await a.move({ at: 'ads-switch', x: 0.5, y: 0.5 }, { duration: 700 })
  await a.wait(200)
  await a.click({ at: 'ads-switch', x: 0.5, y: 0.5 })
  a.put({ adsOn: true })
  await a.wait(400)

  // Move away to let the viewer see the final numbers
  await a.move({ at: 'price-input', x: 1.8, y: 2.2 }, { duration: 700 })
  await a.wait(2500)
}

function calculate(price: number, cost: number, adsOn: boolean) {
  const listing = 0.20
  const transaction = price * 0.065
  const processing = price * 0.03 + 0.25
  const ads = adsOn ? price * 0.15 : 0
  const totalFees = listing + transaction + processing + ads
  const profit = Math.max(0, price - totalFees - cost)
  const margin = price > 0 ? (profit / price) * 100 : 0
  return { listing, transaction, processing, ads, totalFees, profit, margin }
}

export default function CalcDialHero() {
  return (
    <Stage<S>
      width={700}
      height={430}
      compact={{ below: 660, width: 358, height: 490 }}
      initial={initial}
      poster={POSTER}
      script={script}
      play="once"
      cursor={{ at: { x: 580, y: 380 } }}
      className="cd"
    >
      {(s) => {
        const p = parseFloat(s.priceStr) || 0
        const c = parseFloat(s.costStr) || 0
        const { totalFees, profit, margin } = calculate(p, c, s.adsOn)

        return (
          <Window url="calcdial.com/tools/etsy-fee-calculator" className="cd-win">
            <div className="cd-body">
              {/* Header */}
              <div className="cd-head">
                <div className="cd-title-group">
                  <div className="cd-logo">E</div>
                  <span className="cd-title">Etsy Fee &amp; Profit Calculator</span>
                </div>
                <span className="cd-badge">2026 Verified</span>
              </div>

              {/* Main Content Grid */}
              <div className="cd-grid">
                {/* Inputs Column */}
                <div className="cd-inputs">
                  <div className="cd-field">
                    <label className="cd-label">Listing Sale Price</label>
                    <div
                      className="cd-input-box"
                      data-target="price-input"
                      data-active={s.activeField === 'price' ? 'true' : 'false'}
                    >
                      <span className="cd-currency">$</span>
                      <span>{s.priceStr}</span>
                      {s.showCaret && <span className="cd-caret" />}
                    </div>
                  </div>

                  <div className="cd-field">
                    <label className="cd-label">Item Production Cost</label>
                    <div className="cd-input-box">
                      <span className="cd-currency">$</span>
                      <span>{s.costStr}</span>
                    </div>
                  </div>

                  <div className="cd-toggle-row">
                    <div>
                      <div className="cd-toggle-label">Etsy Offsite Ads</div>
                      <div className="cd-toggle-sub">15% fee on buyer conversion</div>
                    </div>
                    <div
                      className="cd-switch"
                      data-target="ads-switch"
                      data-on={s.adsOn ? 'true' : 'false'}
                    >
                      <div className="cd-switch-thumb" />
                    </div>
                  </div>
                </div>

                {/* Live Results Card */}
                <div className="cd-result-card">
                  <div className="cd-result-hero">
                    <div className="cd-result-label">Net Profit (Take-Home)</div>
                    <div className="cd-result-profit">
                      $<Roll delay={100}>{profit.toFixed(2)}</Roll>
                    </div>
                  </div>

                  <div className="cd-breakdown">
                    <div className="cd-breakdown-row">
                      <span>Net Margin:</span>
                      <span className="cd-breakdown-val">
                        <Roll delay={150}>{margin.toFixed(1)}</Roll>%
                      </span>
                    </div>
                    <div className="cd-breakdown-row">
                      <span>Total Fees:</span>
                      <span className="cd-breakdown-val">
                        $<Roll delay={200}>{totalFees.toFixed(2)}</Roll>
                      </span>
                    </div>
                    <div className="cd-breakdown-row">
                      <span>Payout to Bank:</span>
                      <span className="cd-breakdown-val">
                        $<Roll delay={250}>{(p - totalFees).toFixed(2)}</Roll>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Window>
        )
      }}
    </Stage>
  )
}
