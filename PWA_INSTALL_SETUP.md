# PWA Install Button Setup Guide

## What Was Fixed

### 1. Added Manifest Link
- Added `<link rel="manifest" href="./manifest.json">` to `index.html`

### 2. Added PWA Meta Tags
- `theme-color`: Sets the browser theme color
- `apple-mobile-web-app-capable`: Enables iOS standalone mode
- `apple-mobile-web-app-status-bar-style`: iOS status bar styling
- `apple-mobile-web-app-title`: iOS app name
- `mobile-web-app-capable`: Android support

### 3. Added Icon Links
- Apple Touch Icons (for iOS)
- Favicons (for browsers)
- Fixed icon paths to `icons/icons/` directory

### 4. Fixed Manifest Icon Paths
- Updated all icon paths in `manifest.json` to correct location: `icons/icons/icon-*.png`

## Requirements for PWA Install Button to Appear

### ✅ Technical Requirements (All Met)
- [x] Valid `manifest.json` file
- [x] Manifest linked in HTML
- [x] Service worker registered (via Vue PWA plugin)
- [x] Icons present (192x192 and 512x512 required)
- [x] HTTPS or localhost (required by browsers)

### 🌐 Browser Support

**Desktop:**
- ✅ Chrome/Edge: Shows install icon (➕) in address bar
- ✅ Firefox: Shows install prompt in address bar
- ✅ Safari: No install button (uses Add to Dock)

**Mobile:**
- ✅ Chrome/Edge (Android): Shows "Add to Home Screen" prompt
- ✅ Safari (iOS): Uses "Add to Home Screen" via share menu

## How to Test

### 1. Development (localhost)
```bash
npm run serve
# Open http://localhost:8080
# Install button should appear in Chrome/Edge
```

### 2. Production (HTTPS)
- Deploy to HTTPS server
- Open in browser
- Look for install icon in address bar
- Or use: Menu (⋮) > Install "Sample Size Calculator"

### 3. Verify PWA Status

**Chrome DevTools:**
1. Open DevTools (F12)
2. Go to "Application" tab
3. Check "Manifest" section
4. Check "Service Workers" section
5. Both should show green/active status

**Lighthouse PWA Audit:**
1. Open DevTools
2. Go to "Lighthouse" tab
3. Run PWA audit
4. Should score 100/100

## Troubleshooting

### Install Button Not Appearing?

1. **Check HTTPS**
   - PWA install only works on HTTPS (or localhost)
   - Production must use HTTPS

2. **Check Service Worker**
   - Open DevTools > Application > Service Workers
   - Should show "activated and running"
   - If not, clear cache and reload

3. **Check Manifest**
   - Open DevTools > Application > Manifest
   - Should show app name, icons, colors
   - No errors should appear

4. **Check Icons**
   - Verify icons load: `http://localhost:8080/icons/icons/icon-192x192.png`
   - Icons must be accessible

5. **Clear Browser Data**
   - Clear site data and cache
   - Reload page
   - Check again

6. **Check Console Errors**
   - Open DevTools > Console
   - Look for manifest or service worker errors
   - Fix any reported issues

### Already Installed?

If the app is already installed:
- Install button won't appear
- Uninstall first: Settings > Apps > Sample Size Calculator > Uninstall
- Or clear site data and reload

## Expected Behavior

### Desktop (Chrome/Edge)
- Install icon (➕) appears in address bar after page loads
- Click to show install prompt
- App installs as standalone window

### Mobile (Chrome Android)
- "Add to Home Screen" prompt appears automatically (can be dismissed)
- Or: Menu > "Add to Home Screen"
- Installs as app icon

### Mobile (Safari iOS)
- Share button (square with arrow) > "Add to Home Screen"
- No automatic prompt (Apple policy)
- Installs as app icon

## Files Modified

1. **public/index.html**
   - Added manifest link
   - Added PWA meta tags
   - Added icon links

2. **public/manifest.json**
   - Fixed icon paths (icons/icons/icon-*.png)

## Verification Checklist

- [ ] Manifest loads without errors (DevTools > Application > Manifest)
- [ ] Service worker registers (DevTools > Application > Service Workers)
- [ ] Icons load correctly (check Network tab)
- [ ] Install button appears in address bar (Chrome/Edge)
- [ ] App installs successfully
- [ ] Installed app opens in standalone window
- [ ] Theme color matches (#007BFF)

