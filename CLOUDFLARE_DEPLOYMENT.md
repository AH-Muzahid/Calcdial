# Cloudflare Pages Deployment Guide for FeeSnap

This guide covers deploying FeeSnap to **Cloudflare Pages** with 100% static export, global edge CDN caching, free bandwidth, and sub-50ms TTFB.

---

## ⚡ Why Cloudflare Pages is Ideal for this Project
1. **Unlimited Free Bandwidth:** Unlike Vercel (which limits bandwidth on the hobby tier), Cloudflare Pages has no bandwidth limits on the free tier.
2. **Global Edge Speed (< 50ms TTFB):** Pure static HTML in the `out/` folder is cached across 300+ global edge datacenters.
3. **Zero Backend Compute Cost:** No serverless function executions or cold starts.

---

## Method 1: Git-Connected Automatic Deployment (Recommended)

### Step 1: Push Project to GitHub
If you haven't pushed to GitHub yet:
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### Step 2: Connect to Cloudflare Pages
1. Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. In the left navigation, click **Compute (Workers & Pages)** > **Pages**.
3. Click **Create an application** > **Pages** > **Connect to Git**.
4. Select your GitHub repository.

### Step 3: Configure Build Settings
Fill in these exact build settings:

| Setting | Value |
| :--- | :--- |
| **Framework preset** | `Next.js (Static HTML Export)` or `None` |
| **Build command** | `npm run build` |
| **Build output directory** | `out` |
| **Root directory** | `/` (leave blank) |

### Step 4: Add Environment Variables
Under **Environment Variables** in the Cloudflare deployment setup, add:

| Variable Name | Value | Purpose |
| :--- | :--- | :--- |
| `NODE_VERSION` | `22` | Uses Node.js 22 LTS during build |
| `NEXT_PUBLIC_BASE_URL` | `https://yourdomain.com` (or your `.pages.dev` URL) | Canonical URLs and sitemap generation |
| `NEXT_PUBLIC_GA_ID` | `G-XXXXXXXXXX` | Google Analytics 4 |
| `NEXT_PUBLIC_AD_NETWORK` | `adsense` | Set to `grow` when installing Grow by Mediavine |
| `NEXT_PUBLIC_ADSENSE_ID` | `ca-pub-XXXXXXXXXXXXXXXX` | Your Google AdSense publisher ID |

Click **Save and Deploy**. Cloudflare will build the 86 static routes in ~30 seconds and publish your site!

---

## Method 2: Instant CLI Deployment via Wrangler

If you prefer deploying immediately from your local terminal without waiting on GitHub:

```bash
# 1. Build the static site locally
npm run build

# 2. Deploy directly to Cloudflare Pages via Wrangler
npx wrangler pages deploy out --project-name=feesnap
```
Wrangler will open a browser to authenticate your Cloudflare account and output your live `https://feesnap.pages.dev` URL instantly.

---

## Adding Custom Domain & Free SSL
1. In Cloudflare Dashboard, go to your Pages project > **Custom domains**.
2. Click **Set up a domain**, enter your domain (e.g. `feesnap.com`), and confirm DNS records.
3. Cloudflare automatically issues a free universal SSL certificate within minutes.
