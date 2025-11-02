#!/bin/bash

# PWA Icon Generator Script
# This script generates all required PWA icons from the SVG template

echo "Generating PWA icons..."

# Define icon sizes
sizes=(16 32 72 96 128 144 152 192 384 512)

# Create icons directory if it doesn't exist
mkdir -p icons

# Generate PNG icons from SVG template (using transparent version)
# Use icon-template-transparent.svg if it exists, otherwise use regular template
SVG_TEMPLATE="icon-template.svg"
if [ -f "icon-template-transparent.svg" ]; then
  SVG_TEMPLATE="icon-template-transparent.svg"
  echo "Using transparent icon template"
fi

for size in "${sizes[@]}"; do
    echo "Generating icon-${size}x${size}.png..."
    # Use -background transparent to ensure no black borders
    # Use -density to ensure high quality rendering
    # Use -gravity center to center the image
    # Use -alpha set to ensure transparency
    # Force RGBA color type (6 = RGBA with alpha channel)
    # Strip any unwanted metadata and background color chunks
    convert "${SVG_TEMPLATE}" \
      -background transparent \
      -density 300 \
      -resize ${size}x${size} \
      -gravity center \
      -extent ${size}x${size} \
      -alpha set \
      -alpha on \
      -define png:color-type=6 \
      -strip \
      icons/icon-${size}x${size}.png
    
    # Remove black background chunk using ImageMagick itself if pngcrush is not available
    # This removes the bKGD chunk that causes black background
    convert icons/icon-${size}x${size}.png \
      -define png:exclude-chunk=bKGD \
      icons/icon-${size}x${size}.png
    
    # Final pass to ensure no background chunks remain
    convert icons/icon-${size}x${size}.png \
      -alpha set \
      -alpha on \
      -background none \
      -define png:exclude-chunk=bKGD,caSter,text \
      icons/icon-${size}x${size}.png
    
    # Alternative: Use pngcrush if available (more thorough)
    if command -v pngcrush >/dev/null 2>&1; then
      pngcrush -rem bKGD icons/icon-${size}x${size}.png icons/icon-${size}x${size}_temp.png 2>/dev/null && mv icons/icon-${size}x${size}_temp.png icons/icon-${size}x${size}.png || true
    fi
done

echo "All PWA icons generated successfully!"
echo "Generated icons:"
ls -la icons/

# Verify all required icons exist
required_sizes=(72 96 128 144 152 192 384 512)
missing_icons=()

for size in "${required_sizes[@]}"; do
    if [ ! -f "icons/icon-${size}x${size}.png" ]; then
        missing_icons+=($size)
    fi
done

if [ ${#missing_icons[@]} -eq 0 ]; then
    echo "✅ All required PWA icons are present!"
else
    echo "❌ Missing icons for sizes: ${missing_icons[*]}"
    exit 1
fi
