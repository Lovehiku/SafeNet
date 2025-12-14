// Simple icon generator using canvas (if available) or creates minimal icons
// Install canvas: npm install canvas
// Then run: node create-icons-simple.js

const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

let canvas;
try {
  canvas = require('canvas');
  console.log('Using canvas library for icon generation...');
} catch (e) {
  console.log('Canvas library not found. Creating minimal placeholder icons...');
  console.log('Install with: npm install canvas');
  createMinimalIcons();
  process.exit(0);
}

const sizes = [16, 48, 128];

sizes.forEach(size => {
  const canvasEl = canvas.createCanvas(size, size);
  const ctx = canvasEl.getContext('2d');

  // Draw shield background (purple gradient)
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#667eea');
  gradient.addColorStop(1, '#764ba2');
  ctx.fillStyle = gradient;
  
  // Draw shield shape
  ctx.beginPath();
  ctx.moveTo(size * 0.5, size * 0.1);
  ctx.lineTo(size * 0.2, size * 0.2);
  ctx.lineTo(size * 0.2, size * 0.6);
  ctx.lineTo(size * 0.5, size * 0.9);
  ctx.lineTo(size * 0.8, size * 0.6);
  ctx.lineTo(size * 0.8, size * 0.2);
  ctx.closePath();
  ctx.fill();

  // Draw checkmark
  ctx.strokeStyle = 'white';
  ctx.lineWidth = Math.max(1, size * 0.08);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(size * 0.35, size * 0.5);
  ctx.lineTo(size * 0.45, size * 0.6);
  ctx.lineTo(size * 0.65, size * 0.35);
  ctx.stroke();

  // Save as PNG
  const buffer = canvasEl.toBuffer('image/png');
  const iconPath = path.join(iconsDir, `icon${size}.png`);
  fs.writeFileSync(iconPath, buffer);
  console.log(`✓ Created ${iconPath}`);
});

console.log('\n✓ All icons generated successfully!');

function createMinimalIcons() {
  // Create minimal 1x1 transparent PNGs as placeholders
  const minimalPNG = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    'base64'
  );
  
  sizes.forEach(size => {
    const iconPath = path.join(iconsDir, `icon${size}.png`);
    fs.writeFileSync(iconPath, minimalPNG);
    console.log(`Created placeholder ${iconPath}`);
  });
  
  console.log('\n⚠️  Placeholder icons created. Please use create-icons.html for proper icons.');
}

