# GitHub Pages Deployment Guide

## Quick Setup

### 1. Install gh-pages package
```bash
cd app
npm install --save-dev gh-pages
```

### 2. Update package.json
Add these lines to `app/package.json`:
```json
{
  "homepage": "https://<your-github-username>.github.io/math-app",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

### 3. Deploy
```bash
cd app
npm run deploy
```

This will:
- Build your app
- Create/update `gh-pages` branch
- Push build files to GitHub

### 4. Enable GitHub Pages
1. Go to your GitHub repo settings
2. Navigate to **Pages** section
3. Source: Select `gh-pages` branch
4. Click **Save**

### 5. Access Your App
Visit: `https://<your-github-username>.github.io/math-app`

(May take 1-2 minutes for first deployment)

## Updates
To deploy changes:
```bash
cd app
npm run deploy
```

## Notes
- App works offline after first load (IndexedDB is client-side)
- No backend required - perfect for GitHub Pages
- Free hosting with custom domain support
