# Clear Cache to See PWA Install Prompt Updates

## Quick Fix (Recommended)

### Option 1: Hard Refresh
- **Windows/Linux**: Press `Ctrl + Shift + R` or `Ctrl + F5`
- **Mac**: Press `Cmd + Shift + R`

### Option 2: Clear Service Worker
1. Open Chrome DevTools (`F12`)
2. Go to **Application** tab
3. Click **Service Workers** in the left sidebar
4. Find your service worker and click **Unregister**
5. Close DevTools and refresh the page (`F5`)

### Option 3: Clear All Site Data
1. Open Chrome DevTools (`F12`)
2. Go to **Application** tab
3. Click **Clear storage** in the left sidebar
4. Check all boxes
5. Click **Clear site data**
6. Refresh the page

## If Using Development Server

If you're running `npm run serve`, you may need to:

1. Stop the server (`Ctrl + C`)
2. Delete `.cache` folder (if exists):
   ```bash
   rm -rf node_modules/.cache
   ```
3. Restart the server:
   ```bash
   npm run serve
   ```
4. Clear browser cache (see above)

## Verify Changes

After clearing cache, you should see:

✅ **App Icon** (instead of 📱 emoji)  
✅ **Translated Text** (instead of `pwa.installTitle`)  
✅ **Styled Icon** (with rounded corners and shadow)

## If Still Not Working

1. Check browser console for errors
2. Verify the file was saved:
   - `src/components/PWAInstallPrompt.vue` should have:
     - `<img src="/icons/icons/icon-192x192.png" />`
     - `import { useI18n } from 'vue-i18n'`
     - `const { t } = useI18n()`
3. Try incognito/private mode
4. Check if service worker is serving cached version

