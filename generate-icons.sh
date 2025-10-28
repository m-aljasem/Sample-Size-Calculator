#!/bin/bash

echo "🎨 Generating PWA Icons for  Sample Size Calculator"
echo "============================================================="

# Create icons directory
mkdir -p public/icons

# Create a simple SVG icon
cat > public/icons/icon.svg << 'EOF'
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#007BFF;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0056B3;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="512" height="512" rx="80" fill="url(#bg)"/>
  
  <!-- DNA Helix -->
  <g fill="white" opacity="0.9">
    <!-- Left strand -->
    <path d="M150 100 Q200 150 150 200 Q100 250 150 300 Q200 350 150 400 Q100 450 150 500" 
          stroke="white" stroke-width="8" fill="none" opacity="0.7"/>
    
    <!-- Right strand -->
    <path d="M362 100 Q312 150 362 200 Q412 250 362 300 Q312 350 362 400 Q412 450 362 500" 
          stroke="white" stroke-width="8" fill="none" opacity="0.7"/>
    
    <!-- Connecting lines -->
    <line x1="150" y1="100" x2="362" y2="100" stroke="white" stroke-width="4" opacity="0.6"/>
    <line x1="150" y1="200" x2="362" y2="200" stroke="white" stroke-width="4" opacity="0.6"/>
    <line x1="150" y1="300" x2="362" y2="300" stroke="white" stroke-width="4" opacity="0.6"/>
    <line x1="150" y1="400" x2="362" y2="400" stroke="white" stroke-width="4" opacity="0.6"/>
    <line x1="150" y1="500" x2="362" y2="500" stroke="white" stroke-width="4" opacity="0.6"/>
  </g>
  
  <!-- Calculator symbol -->
  <rect x="200" y="180" width="112" height="152" rx="8" fill="white" opacity="0.2"/>
  <rect x="210" y="190" width="92" height="132" rx="4" fill="white" opacity="0.3"/>
  
  <!-- Calculator buttons -->
  <rect x="220" y="200" width="18" height="18" rx="2" fill="white" opacity="0.4"/>
  <rect x="245" y="200" width="18" height="18" rx="2" fill="white" opacity="0.4"/>
  <rect x="270" y="200" width="18" height="18" rx="2" fill="white" opacity="0.4"/>
  <rect x="295" y="200" width="18" height="18" rx="2" fill="white" opacity="0.4"/>
  
  <rect x="220" y="225" width="18" height="18" rx="2" fill="white" opacity="0.4"/>
  <rect x="245" y="225" width="18" height="18" rx="2" fill="white" opacity="0.4"/>
  <rect x="270" y="225" width="18" height="18" rx="2" fill="white" opacity="0.4"/>
  <rect x="295" y="225" width="18" height="18" rx="2" fill="white" opacity="0.4"/>
  
  <!-- Display -->
  <rect x="220" y="250" width="72" height="24" rx="4" fill="white" opacity="0.5"/>
  <rect x="225" y="255" width="62" height="14" rx="2" fill="white" opacity="0.7"/>
</svg>
EOF

echo "✅ SVG icon created"

# Check if ImageMagick is available
if command -v convert &> /dev/null; then
    echo "📐 Converting SVG to PNG icons..."
    
    # Generate different sizes
    convert public/icons/icon.svg -resize 16x16 public/icons/icon-16x16.png
    convert public/icons/icon.svg -resize 32x32 public/icons/icon-32x32.png
    convert public/icons/icon.svg -resize 72x72 public/icons/icon-72x72.png
    convert public/icons/icon.svg -resize 96x96 public/icons/icon-96x96.png
    convert public/icons/icon.svg -resize 128x128 public/icons/icon-128x128.png
    convert public/icons/icon.svg -resize 144x144 public/icons/icon-144x144.png
    convert public/icons/icon.svg -resize 152x152 public/icons/icon-152x152.png
    convert public/icons/icon.svg -resize 192x192 public/icons/icon-192x192.png
    convert public/icons/icon.svg -resize 384x384 public/icons/icon-384x384.png
    convert public/icons/icon.svg -resize 512x512 public/icons/icon-512x512.png
    
    echo "✅ All PNG icons generated successfully"
else
    echo "⚠️  ImageMagick not found. Please install ImageMagick to generate PNG icons."
    echo "   On Ubuntu/Debian: sudo apt-get install imagemagick"
    echo "   On macOS: brew install imagemagick"
    echo "   On Windows: Download from https://imagemagick.org/script/download.php"
    echo ""
    echo "📝 You can manually convert the SVG icon at public/icons/icon.svg to PNG format"
    echo "   using any image editor or online converter."
fi

echo ""
echo "🎉 Icon generation complete!"
echo "📁 Icons are located in: public/icons/"
echo ""
echo "Next steps:"
echo "1. Run: npm install"
echo "2. Run: npm run serve"
echo "3. Test PWA installation in your browser"
