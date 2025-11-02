// Device detection utility for mobile redirect

/**
 * Detects if the current device is a mobile device
 * @returns {boolean} True if mobile device, false otherwise
 */
export const isMobileDevice = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera
  
  // Check for common mobile device patterns
  const mobilePatterns = [
    /android/i,
    /webos/i,
    /iphone/i,
    /ipad/i,
    /ipod/i,
    /blackberry/i,
    /windows phone/i,
    /mobile/i
  ]
  
  // Check if any mobile pattern matches
  const isMobile = mobilePatterns.some(pattern => pattern.test(userAgent))
  
  // Also check screen width (secondary check)
  const isSmallScreen = window.innerWidth <= 768
  
  // Consider it mobile if either condition is true
  return isMobile || isSmallScreen
}

/**
 * Checks if the app is already running in standalone mode (already installed as PWA)
 * @returns {boolean} True if in standalone mode
 */
export const isStandaloneMode = () => {
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone === true ||
         document.referrer.includes('android-app://')
}

/**
 * Redirects to mobile app URL if device is mobile and not in standalone mode
 * @param {string} mobileAppUrl - URL of the mobile app
 * @returns {boolean} True if redirect was attempted
 */
export const redirectToMobileApp = (mobileAppUrl) => {
  // Don't redirect if already in standalone mode
  if (isStandaloneMode()) {
    return false
  }
  
  // Check if device is mobile
  if (!isMobileDevice()) {
    return false
  }
  
  // Check if we should redirect (avoid infinite redirects)
  const redirectKey = 'mobile-redirect-attempted'
  const redirectAttempted = sessionStorage.getItem(redirectKey)
  
  if (redirectAttempted) {
    return false
  }
  
  // Check if user dismissed redirect
  const dismissed = localStorage.getItem('mobile-redirect-dismissed')
  if (dismissed) {
    return false
  }
  
  // Validate URL
  if (!mobileAppUrl || mobileAppUrl === window.location.origin || mobileAppUrl === window.location.href) {
    return false
  }
  
  try {
    // Mark redirect as attempted
    sessionStorage.setItem(redirectKey, 'true')
    
    // Redirect to mobile app
    window.location.href = mobileAppUrl
    return true
  } catch (error) {
    console.error('Failed to redirect to mobile app:', error)
    return false
  }
}

/**
 * Gets user's preference for mobile redirect
 * @returns {boolean} True if user wants to stay on web app
 */
export const shouldStayOnWebApp = () => {
  return localStorage.getItem('prefer-web-app') === 'true'
}

