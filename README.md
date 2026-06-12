# 🐓 Enermind Poultry Platform

Kenya's largest poultry marketplace — connecting farmers, buyers, agrovets, and feed sellers across all 47 counties.

**Live site:** [www.enermindcompany.co.ke](https://www.enermindcompany.co.ke)

---

## 📂 Project Structure

```
enermind/
├── index.html              # Homepage
├── CNAME                   # Custom domain for GitHub Pages
├── README.md
├── pages/
│   ├── listings.html       # Marketplace listings
│   ├── directory.html      # Seller directory
│   ├── list-farm.html      # List your farm / onboarding
│   ├── calculator.html     # ✨ NEW: Profit calculator
│   ├── market-prices.html  # ✨ NEW: Kenya market price index
│   ├── favourites.html     # ✨ NEW: Saved listings
│   ├── privacy.html        # Privacy policy
│   └── terms.html          # Terms of use
└── public/
    ├── css/style.css        # All styles
    └── js/
        ├── listings-data.js # Listing, directory & plan data
        └── main.js          # All JavaScript (UI + features)
```

---

## ✨ V2 New Features

| Feature | Description |
|---|---|
| 💰 Profit Calculator | Estimate costs, revenue & ROI for broilers, layers, kienyeji |
| 📈 Market Price Index | Weekly-updated Kenya poultry market prices |
| ❤️ Favourites | Save listings locally to your device |
| 💬 WhatsApp Quick Connect | One-tap WhatsApp enquiry on any listing |
| ↗️ Share Listings | Native share / copy link for any listing |
| 🔔 Toast Notifications | Non-intrusive feedback messages |

---

## 🚀 How to Deploy on GitHub Pages

### Step 1 — Create a GitHub account
Go to [github.com](https://github.com) and sign up (free).

### Step 2 — Create a new repository
1. Click **+** → **New repository**
2. Name it: `enermind` (or `enermindcompany.co.ke`)
3. Set it to **Public**
4. Click **Create repository**

### Step 3 — Upload your files
**Option A — GitHub web (easiest):**
1. Open your new repo
2. Click **Add file** → **Upload files**
3. Drag the entire `enermind/` folder contents into the upload area
4. Write a commit message: `Initial upload`
5. Click **Commit changes**

**Option B — Git command line:**
```bash
# Inside your enermind folder:
git init
git add .
git commit -m "Initial commit — Enermind Poultry Platform"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/enermind.git
git push -u origin main
```

### Step 4 — Enable GitHub Pages
1. Go to your repo → **Settings** → **Pages** (left sidebar)
2. Under **Source**, select **Deploy from a branch**
3. Branch: `main`, Folder: `/ (root)`
4. Click **Save**
5. Your site will be live at: `https://YOUR-USERNAME.github.io/enermind/`

### Step 5 — Connect your custom domain (enermindcompany.co.ke)
1. In GitHub Pages settings → **Custom domain** → enter `enermindcompany.co.ke`
2. Click **Save**
3. Log into your domain registrar (e.g. Safaricom, KenRegistry, GoDaddy)
4. Add these DNS records:

| Type | Name | Value |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | YOUR-USERNAME.github.io |

5. Wait 24–48 hours for DNS to propagate
6. Check **Enforce HTTPS** in GitHub Pages settings

---

## 🔧 How to Update the Site

### Update listings data
Edit `public/js/listings-data.js` — add new objects to the `LISTINGS` array following the existing format.

### Update market prices
Edit `pages/market-prices.html` — find the `PRICES` object in the `<script>` tag.

### Update styles
Edit `public/css/style.css`.

### Push changes to GitHub
```bash
git add .
git commit -m "Update listings - June 2025"
git push
```
GitHub Pages auto-deploys within 1–2 minutes.

---

## 💳 Payment Integration (Pesapal)

The unlock flow is in **demo mode** by default. To go live:

1. Sign up at [pesapal.com](https://pesapal.com)
2. Get your API credentials
3. Build a simple backend (Node.js / Python Flask) that calls Pesapal's API
4. Update `PESAPAL_CONFIG.demoMode = false` in `main.js`
5. Point the fetch calls to your backend endpoint

> ⚠️ Never put Pesapal secret keys in frontend JS code.

---

## 📞 Support

**Email:** info@enermindcompany.co.ke  
**Website:** www.enermindcompany.co.ke

© 2024 Enermind Company. All rights reserved.
