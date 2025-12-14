// Create proper-sized PNG icons that Chrome will accept
// Run with: node create-proper-icons.cjs

const fs = require("fs");
const path = require("path");

const iconsDir = path.join(__dirname, "icons");
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Create a proper PNG icon using a simple approach
// We'll create a colored square with the SafeNet colors
const sizes = [16, 48, 128];

// Create a proper PNG file structure
// This creates a valid PNG with the specified dimensions and color
function createColoredPNG(size, r, g, b) {
  // Create a proper PNG file
  // PNG format: signature + IHDR + IDAT + IEND chunks

  const width = size;
  const height = size;

  // PNG signature (8 bytes)
  const signature = Buffer.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
  ]);

  // Create IHDR chunk (Image Header)
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 2; // color type (RGB)
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace

  const ihdrCRC = crc32(Buffer.concat([Buffer.from("IHDR"), ihdrData]));
  const ihdrChunk = Buffer.concat([
    Buffer.from([0, 0, 0, 13]), // length
    Buffer.from("IHDR"),
    ihdrData,
    Buffer.from([
      (ihdrCRC >>> 24) & 0xff,
      (ihdrCRC >>> 16) & 0xff,
      (ihdrCRC >>> 8) & 0xff,
      ihdrCRC & 0xff,
    ]),
  ]);

  // Create IDAT chunk (Image Data)
  // For a solid color, we create minimal data
  const rowSize = width * 3 + 1; // RGB + filter byte
  const imageData = Buffer.alloc(height * rowSize);

  for (let y = 0; y < height; y++) {
    const rowStart = y * rowSize;
    imageData[rowStart] = 0; // filter byte (none)
    for (let x = 0; x < width; x++) {
      const offset = rowStart + 1 + x * 3;
      imageData[offset] = r;
      imageData[offset + 1] = g;
      imageData[offset + 2] = b;
    }
  }

  // Compress the image data (simple deflate - for production use zlib)
  // For now, use minimal compression
  const compressed = deflateSimple(imageData);

  const idatCRC = crc32(Buffer.concat([Buffer.from("IDAT"), compressed]));
  const idatChunk = Buffer.concat([
    Buffer.from([
      (compressed.length >>> 24) & 0xff,
      (compressed.length >>> 16) & 0xff,
      (compressed.length >>> 8) & 0xff,
      compressed.length & 0xff,
    ]),
    Buffer.from("IDAT"),
    compressed,
    Buffer.from([
      (idatCRC >>> 24) & 0xff,
      (idatCRC >>> 16) & 0xff,
      (idatCRC >>> 8) & 0xff,
      idatCRC & 0xff,
    ]),
  ]);

  // IEND chunk (Image End)
  const iendCRC = crc32(Buffer.from("IEND"));
  const iendChunk = Buffer.concat([
    Buffer.from([0, 0, 0, 0]), // length
    Buffer.from("IEND"),
    Buffer.from([
      (iendCRC >>> 24) & 0xff,
      (iendCRC >>> 16) & 0xff,
      (iendCRC >>> 8) & 0xff,
      iendCRC & 0xff,
    ]),
  ]);

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Simple CRC32 implementation
function crc32(data) {
  const table = [];
  for (let i = 0; i < 256; i++) {
    let crc = i;
    for (let j = 0; j < 8; j++) {
      crc = crc & 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
    }
    table[i] = crc;
  }

  let crc = 0xffffffff;
  for (let i = 0; i < data.length; i++) {
    crc = table[(crc ^ data[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

// Simple deflate (for production, use zlib)
function deflateSimple(data) {
  // For a quick fix, we'll use a minimal approach
  // In production, use require('zlib').deflateSync
  try {
    const zlib = require("zlib");
    return zlib.deflateSync(data);
  } catch (e) {
    // Fallback: return uncompressed (not ideal but works)
    return data;
  }
}

console.log("Creating proper icon files...\n");

sizes.forEach((size) => {
  // Use SafeNet brand color: #667eea (RGB: 102, 126, 234)
  const png = createColoredPNG(size, 102, 126, 234);
  const iconPath = path.join(iconsDir, `icon${size}.png`);
  fs.writeFileSync(iconPath, png);
  console.log(`✓ Created ${iconPath} (${size}x${size})`);
});

console.log("\n✓ All icons created successfully!");
console.log("The extension should now load without errors.");
