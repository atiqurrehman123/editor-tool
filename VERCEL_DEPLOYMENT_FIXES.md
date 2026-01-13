# Vercel Deployment Fixes

This document outlines all the fixes applied to resolve Vercel deployment issues.

## Changes Made

### 1. Created `vercel.json` Configuration
- Added proper build configuration for Vite
- Set output directory to `build`
- Added SPA routing rewrites
- Added cache headers for static assets

### 2. Updated `vite.config.js`
- **Removed `react-svg-anchor` plugin** - This plugin was causing build issues on Vercel
- Disabled sourcemaps for production builds (reduces build size)
- Added `optimizeDeps` configuration
- Increased chunk size warning limit

### 3. Fixed PostCSS Configuration
- Removed duplicate config files (`postcss.config.cjs`, `postcss.config.js.bak`)
- Kept only `postcss.config.js` with proper ES module format

### 4. Updated `package.json`
- Added `engines` field to specify Node.js and npm versions
- Ensures Vercel uses compatible Node.js version

### 5. Created `.vercelignore`
- Excludes unnecessary files from deployment
- Reduces deployment size and time

### 6. Created Node Version Files
- Added `.nvmrc` for Node version specification
- Added `.engines` file as backup

### 7. Fixed Import.meta.glob Deprecation
- Updated `src/common/functions.js` to use new `query` syntax instead of deprecated `as` option

### 8. Updated `index.html`
- Added noscript tag for better accessibility
- Ensured proper Vite compatibility

## Build Verification

The build was tested locally and completed successfully:
```
✓ built in 11.74s
```

## Next Steps for Vercel Deployment

1. **Push changes to your repository**
2. **In Vercel Dashboard:**
   - Go to your project settings
   - Ensure "Framework Preset" is set to "Vite" (or auto-detected)
   - Verify "Build Command" is `npm run build`
   - Verify "Output Directory" is `build`
   - Set Node.js version to 18.x or higher

3. **Environment Variables (if needed):**
   - Add any required environment variables in Vercel dashboard
   - Note: API keys should be moved to environment variables (see IMPROVEMENTS document)

4. **Redeploy:**
   - Trigger a new deployment
   - Monitor build logs for any issues

## Potential Issues to Watch For

1. **Large Bundle Size**: The fabric-vendor bundle is ~297KB. Consider code splitting if needed.
2. **Environment Variables**: If your app requires API keys, add them in Vercel dashboard
3. **Build Time**: First build may take longer due to dependency installation

## Files Modified

- `vercel.json` (created)
- `vite.config.js` (updated)
- `package.json` (updated)
- `index.html` (updated)
- `src/common/functions.js` (updated)
- `.vercelignore` (created)
- `.nvmrc` (created)
- `.engines` (created)

## Files Deleted

- `postcss.config.cjs` (duplicate)
- `postcss.config.js.bak` (backup file)

## Testing

Before deploying, test locally:
```bash
npm run build
npm run preview
```

If preview works correctly, the Vercel deployment should work as well.
