#!/bin/bash
# Fix icon background by completely removing bKGD chunk
for icon in icons/icon-*.png; do
  if [ -f "$icon" ]; then
    # Use ImageMagick to convert and explicitly remove background
    convert "$icon" \
      -alpha set \
      -alpha on \
      -background none \
      -define png:exclude-chunk=bKGD,caSter,text \
      "$icon"
    
    # Try using optipng if available
    if command -v optipng >/dev/null 2>&1; then
      optipng -quiet -o2 "$icon" 2>/dev/null || true
    fi
  fi
done
echo "✅ Fixed all icon backgrounds"
