# PWA Offline Support & Mobile Redirect Setup

## ✅ Features Implemented

### 1. **Full Offline PWA Support**
- ✅ Complete service worker configuration
- ✅ Caching strategies for all resources:
  - HTML pages (NetworkFirst - tries network, falls back to cache)
  - CSS/JS files (CacheFirst - uses cache first)
  - Images (CacheFirst)
  - Fonts (CacheFirst)
  - KaTeX CSS (for LaTeX formulas)
  - API calls (NetworkFirst with timeout)
- ✅ Offline fallback page
- ✅ Automatic cache updates
- ✅ Works completely offline after first visit

### 2. **Automatic Mobile Redirect**
- ✅ Device detection (mobile vs desktop)
- ✅ Automatic redirect to mobile app URL
- ✅ User preference support (can choose to stay on web)
- ✅ Respects PWA installation (won't redirect if already installed)
- ✅ Prevents infinite redirects
- ✅ Configurable via environment variables

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory (or set them in your deployment platform):

```bash
# Web App URL (where the main Vue.js web app is hosted)
VUE_APP_WEB_APP_URL=https://your-web-app-url.com

# Mobile App URL (where the Ionic web version is hosted)
VUE_APP_MOBILE_APP_URL=https://your-mobile-app-url.com

# Enable/disable mobile redirect (default: true)
VUE_APP_ENABLE_MOBILE_REDIRECT=true
```

### Example `.env` file:

```bash
# Production URLs
VUE_APP_WEB_APP_URL=https://sample-size-calc.com
VUE_APP_MOBILE_APP_URL=https://mobile.sample-size-calc.com

# Or same domain with different paths
VUE_APP_WEB_APP_URL=https://sample-size-calc.com
VUE_APP_MOBILE_APP_URL=https://sample-size-calc.com/mobile
```

---

## 📱 How Mobile Redirect Works

1. **On Page Load:**
   - Checks if device is mobile
   - Checks if not already in standalone/PWA mode
   - Checks if user hasn't dismissed redirect
   - If all conditions met, redirects to mobile app URL

2. **User Options:**
   - **Automatic Redirect**: Happens immediately on mobile devices
   - **User Prompt**: Shows a modal asking if user wants mobile app (via `MobileRedirectPrompt` component)
   - **Stay on Web**: User can choose to stay on web app (saved in localStorage)

3. **Smart Detection:**
   - Won't redirect if already installed as PWA
   - Won't redirect if user previously chose to stay on web
   - Prevents infinite redirect loops

---

## 🔄 PWA Offline Functionality

### What's Cached:

1. **App Shell** (HTML, CSS, JS)
   - All static files cached for offline use
   - Automatically updated when new version is available

2. **Images & Fonts**
   - All images cached (icons, etc.)
   - Google Fonts cached
   - KaTeX CSS cached

3. **Pages**
   - All HTML pages cached
   - NetworkFirst strategy: tries to fetch fresh content, falls back to cache if offline

4. **API Calls** (if any)
   - Cached with NetworkFirst strategy
   - Falls back to cache if offline

### How It Works:

1. **First Visit:**
   - Service worker installs
   - Caches all assets
   - App works online

2. **Subsequent Visits:**
   - Works online: fetches fresh content
   - Works offline: uses cached content
   - Automatic updates when new version is available

3. **Offline Mode:**
   - All calculations work (client-side JavaScript)
   - LaTeX formulas work (cached KaTeX CSS)
   - All UI features work
   - Only external API calls (if any) won't work

---

## 🧪 Testing

### Test PWA Offline:

1. **Build the app:**
   ```bash
   npm run build
   ```

2. **Serve locally:**
   ```bash
   cd app
   python3 -m http.server 8080
   ```

3. **Open in Chrome:**
   - Go to `http://localhost:8080`
   - Open DevTools → Application → Service Workers
   - Verify service worker is registered
   - Check "Offline" checkbox
   - Refresh page - app should still work!

4. **Test on Mobile:**
   - Install as PWA
   - Turn off WiFi/data
   - Open app - should work offline

### Test Mobile Redirect:

1. **Set environment variables:**
   ```bash
   export VUE_APP_MOBILE_APP_URL=https://your-mobile-app-url.com
   export VUE_APP_ENABLE_MOBILE_REDIRECT=true
   ```

2. **Build and test:**
   ```bash
   npm run build
   ```

3. **On Mobile Device:**
   - Open web app URL
   - Should automatically redirect to mobile app URL
   - Or show prompt asking to use mobile app

4. **Test User Preference:**
   - Click "Stay on Web App"
   - Refresh page - should stay on web app (not redirect)

---

## 🚀 Deployment

### For Netlify/Vercel:

1. **Set Environment Variables:**
   - Go to site settings
   - Add environment variables:
     - `VUE_APP_WEB_APP_URL`
     - `VUE_APP_MOBILE_APP_URL`
     - `VUE_APP_ENABLE_MOBILE_REDIRECT` (optional)

2. **Build Command:**
   ```bash
   npm run build
   ```

3. **Publish Directory:**
   ```
   app
   ```

### For GitHub Pages:

1. **Set Environment Variables in GitHub Actions:**
   ```yaml
   env:
     VUE_APP_WEB_APP_URL: ${{ secrets.WEB_APP_URL }}
     VUE_APP_MOBILE_APP_URL: ${{ secrets.MOBILE_APP_URL }}
   ```

2. **Build and Deploy:**
   ```bash
   npm run build
   # Deploy app/ directory to GitHub Pages
   ```

---

## 📝 Notes

### Service Worker Path:
- **Development**: `/service-worker.js`
- **Production**: `./service-worker.js`

The service worker is automatically generated by Vue CLI PWA plugin based on `vue.config.js` settings.

### Cache Strategy:
- **NetworkFirst**: Tries network, falls back to cache (for dynamic content)
- **CacheFirst**: Uses cache, falls back to network (for static assets)

### Mobile Redirect Behavior:
- Only redirects on initial page load
- Respects user preferences
- Won't redirect if app is installed as PWA
- Prevents redirect loops with session storage

---

## 🔍 Troubleshooting

### PWA Not Working Offline:

1. **Check Service Worker:**
   - Open DevTools → Application → Service Workers
   - Verify it's registered and active

2. **Check Cache:**
   - DevTools → Application → Cache Storage
   - Verify files are cached

3. **Check Build:**
   - Make sure you built in production mode
   - Check that `service-worker.js` exists in `app/` directory

### Mobile Redirect Not Working:

1. **Check Environment Variables:**
   - Verify `VUE_APP_MOBILE_APP_URL` is set
   - Check `VUE_APP_ENABLE_MOBILE_REDIRECT` is not 'false'

2. **Check Device Detection:**
   - Open browser console
   - Check if device is detected as mobile
   - Check localStorage for user preferences

3. **Check Redirect Logic:**
   - Verify mobile app URL is different from web app URL
   - Check that redirect isn't being blocked by browser

---

## ✅ All Set!

Your app now has:
- ✅ **Full offline PWA support** - works completely offline
- ✅ **Automatic mobile redirect** - sends mobile users to optimized app
- ✅ **User preference** - users can choose to stay on web
- ✅ **Smart detection** - won't redirect if already installed as PWA

🎉 Your app is now production-ready with full PWA capabilities!

