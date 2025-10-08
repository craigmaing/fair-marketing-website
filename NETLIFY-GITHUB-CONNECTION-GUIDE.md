# Connect GitHub to Netlify for Automatic Deployments

## Current Status
- ✅ Site is LIVE at: https://outcome-digital-marketing.netlify.app
- ✅ GitHub Repository: https://github.com/craigmaing/fair-marketing-website
- ❌ GitHub NOT connected for auto-deployment

## Steps to Connect GitHub:

1. **Go to Netlify Admin Dashboard**
   - Already opened: https://app.netlify.com/projects/outcome-digital-marketing

2. **Navigate to Site Configuration**
   - Click on "Site configuration" in the top menu
   - Go to "Build & deploy" → "Continuous deployment"

3. **Link to GitHub**
   - Click "Link repository" or "Configure GitHub App"
   - Choose "GitHub" as your Git provider
   - Authorize Netlify to access your GitHub account

4. **Select Repository**
   - Search for: `fair-marketing-website`
   - Select: `craigmaing/fair-marketing-website`

5. **Configure Build Settings**
   These should auto-populate from netlify.toml:
   - **Branch to deploy:** `main`
   - **Base directory:** (leave empty - site is at root)
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`

6. **Click "Deploy"**

## What This Enables:
- ✅ Every push to `main` branch auto-deploys
- ✅ Pull request previews
- ✅ Branch deploys
- ✅ Rollback capabilities
- ✅ Deploy notifications

## Current Manual Deployment Command:
If you need to deploy manually before GitHub is connected:
```bash
cd /c/Users/Fearn/fearnbell
netlify deploy --prod
```

## Repository Structure (Fixed):
```
fair-marketing-website/
├── src/           # Astro source files
├── public/        # Static assets
├── dist/          # Build output (git-ignored)
├── netlify.toml   # Netlify configuration
├── package.json   # Dependencies
└── astro.config.mjs # Astro configuration
```

## Troubleshooting:
If the build fails after connecting:
1. Check the deploy logs in Netlify dashboard
2. Ensure `NODE_VERSION = "20"` is in netlify.toml ✅
3. Verify build command is `npm run build` ✅
4. Confirm publish directory is `dist` ✅

All configurations are already in place in the repository!