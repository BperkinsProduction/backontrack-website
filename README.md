# Back on Track - Website

Pete Wright Memorial Summer All-Comers Track & Field Series
A program of Cumberland Valley Athletic Club (501(c)(3) nonprofit)

---

## Quick Deploy to Vercel (5 minutes)

### Step 1: Push to GitHub
1. Create a free GitHub account at github.com (if you don't have one)
2. Click the green "New" button to create a new repository
3. Name it `backontrack-website`
4. Open Terminal (Mac) or Command Prompt (Windows) and run:

```bash
cd path/to/backontrack-website
git init
git add .
git commit -m "Initial commit - Back on Track website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/backontrack-website.git
git push -u origin main
```

### Step 2: Deploy on Vercel
1. Go to vercel.com and sign up with your GitHub account
2. Click "Add New..." > "Project"
3. Select your `backontrack-website` repository
4. Click "Deploy" (all settings auto-detected)
5. Wait ~60 seconds and your site is live!

### Step 3: Connect your domain (BackOnTrackMeets.com)
1. Buy the domain at namecheap.com or similar registrar
2. In Vercel: Go to Project Settings > Domains
3. Add `backontrackmeeets.com`
4. Follow Vercel's instructions to update your domain's DNS settings

---

## Running Locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000

---

## Admin Panel

Click "Admin" in the footer and enter the admin password.

The password is no longer hardcoded — it is read from the `ADMIN_PASSWORD` environment variable on the server. Logins set a signed HTTP-only session cookie; the bundle the browser downloads contains no secrets.

### Required environment variables

Set these in Vercel (Project Settings → Environment Variables) and in a local `.env.local` for development:

| Variable | Purpose |
|---|---|
| `ADMIN_PASSWORD` | The password admins type to log in. Use a long random string. |
| `SESSION_SECRET` | Random 32+ character secret used to sign admin session cookies. Generate with `openssl rand -hex 32`. |
| `STORAGE_REST_API_URL` (or `KV_REST_API_URL`) | Vercel KV endpoint. Set automatically when you connect a KV store in Vercel. |
| `STORAGE_REST_API_TOKEN` (or `KV_REST_API_TOKEN`) | Vercel KV token. Set automatically when you connect a KV store in Vercel. |

If `ADMIN_PASSWORD` or `SESSION_SECRET` is missing, login will fail with a 500 — this is intentional, never deploy without them.

From admin mode you can:
- Edit the hero section text
- Edit the about/mission statement
- Add, edit, or delete meets from the schedule
- Add, edit, or delete past meet results
- Add, edit, or delete sponsors
- Update contact information

Changes persist to Vercel KV. Admin sessions expire after 8 hours.

---

## Project Structure

```
backontrack-website/
  app/
    globals.css      - All site styles
    layout.js        - HTML layout, metadata, SEO
    page.js          - Full website component with admin panel
  public/
    logo-letterhead.png  - Horizontal logo (nav & footer)
    logo-icon.png        - Runner icon (hero section & favicon)
    logo-stamp.png       - Stacked logo (for print/marketing)
    logo-alternate.png   - Alternate logo layout
  package.json
  next.config.js
  README.md
```

---

## Tech Stack

- **Next.js 14** - React framework
- **Lucide React** - Icon library
- **Raleway** - Google Font (brand font)
- **Vercel** - Hosting (free tier)

---

## Contacts

- Meet Director: Laura Salvatore
- Website: Brandon DaSilva
- Built by: Brice Perkins
