# Connect GitHub to Netlify - Simple Steps

## Quick Connection Guide

Since you have both GitHub and Netlify open:

### In Netlify Dashboard (https://app.netlify.com/projects/outcome-digital-marketing):

1. **Go to "Site configuration"** (top menu)
2. **Click "Build & deploy"** → **"Continuous deployment"**
3. **Click "Link repository"**
4. **Choose GitHub**
5. **Authorize Netlify** to access your GitHub
6. **Search for:** `fair-marketing-website`
7. **Select:** `craigmaing/fair-marketing-website`
8. **Confirm these settings:**
   - Branch: `main`
   - Base directory: (leave empty)
   - Build command: `npm run build`
   - Publish directory: `dist`
9. **Click "Deploy"**

## That's it! ✅

Once connected:
- Every push to `main` will auto-deploy
- You'll get deploy previews for pull requests
- All settings are already in the `netlify.toml` file

## Current Status:
- **Repository:** https://github.com/craigmaing/fair-marketing-website
- **Live Site:** https://outcome-digital-marketing.netlify.app
- **Site is working perfectly** - just needs GitHub connection

## Alternative: Use Build Hook (Already Created)
If the GitHub connection doesn't work, you have a build hook ready:
- Hook URL: `https://api.netlify.com/build_hooks/68e64e39434d22bc66393a81`
- Add this to GitHub repository webhooks to trigger builds on push