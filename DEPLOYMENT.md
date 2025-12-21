# Deployment Guide for atharva.cc

## Quick Deploy to Vercel

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   cd portfolio
   vercel
   ```

3. **Add Custom Domain**:
   - Go to your Vercel project settings
   - Navigate to "Domains"
   - Add `atharva.cc` and `www.atharva.cc`
   - Follow DNS configuration instructions

## DNS Configuration

For Vercel, you'll need to add these DNS records:

- **Type A**: `@` → Vercel's IP (provided in Vercel dashboard)
- **Type CNAME**: `www` → `cname.vercel-dns.com`

Or use Vercel's nameservers if your registrar supports it.

## Environment Variables

No environment variables are required for basic deployment, but you can add:

- `NEXT_PUBLIC_SITE_URL=https://atharva.cc` (optional, for absolute URLs)

## Build & Test Locally

Before deploying, test the production build:

```bash
npm run build
npm start
```

Visit `http://localhost:3000` to verify everything works.

## Performance Checklist

✅ Static Site Generation enabled
✅ Image optimization configured
✅ Font optimization enabled
✅ Compression enabled
✅ SEO metadata configured
✅ Sitemap and robots.txt configured
✅ Domain configured for atharva.cc

## Post-Deployment

1. Verify site loads at https://atharva.cc
2. Check SSL certificate is active
3. Test all navigation links
4. Verify images load correctly
5. Test contact form (if you've added backend)
6. Submit sitemap to Google Search Console
