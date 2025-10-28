#!/bin/bash

# PWA Icon Generator Script
# This script generates all required PWA icons from the SVG template

echo "Generating PWA icons..."

# Define icon sizes
sizes=(16 32 72 96 128 144 152 192 384 512)

# Create icons directory if it doesn't exist
mkdir -p icons

# Generate PNG icons from SVG template
for size in "${sizes[@]}"; do
    echo "Generating icon-${size}x${size}.png..."
    convert icon-template.svg -resize ${size}x${size} icons/icon-${size}x${size}.png
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
