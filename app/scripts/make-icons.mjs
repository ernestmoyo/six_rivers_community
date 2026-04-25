// Generates PWA PNG icons from public/icons/icon.svg using sharp.
// Run: node scripts/make-icons.mjs
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const ICONS_DIR = path.join(ROOT, "public", "icons");
const SVG_PATH = path.join(ICONS_DIR, "icon.svg");

// Maskable variant gets extra ~10% transparent padding so Android mask shapes
// (circle, squircle, teardrop) don't clip the waves.
const MASKABLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" fill="#EC5C2B"/>
  <g transform="translate(51.2,51.2) scale(0.8)">
    <rect width="512" height="512" rx="96" ry="96" fill="#EC5C2B"/>
    <g fill="none" stroke="#FFFFFF" stroke-width="18" stroke-linecap="round">
      <path d="M112 192 Q 176 152 240 192 T 368 192 T 400 192" />
      <path d="M112 248 Q 176 208 240 248 T 368 248 T 400 248" />
      <path d="M112 304 Q 176 264 240 304 T 368 304 T 400 304" />
      <path d="M112 360 Q 176 320 240 360 T 368 360 T 400 360" />
    </g>
  </g>
</svg>`;

async function generate() {
  const svg = await readFile(SVG_PATH);

  const targets = [
    { size: 192, name: "icon-192.png", src: svg },
    { size: 384, name: "icon-384.png", src: svg },
    { size: 512, name: "icon-512.png", src: svg },
    { size: 180, name: "apple-touch-icon.png", src: svg },
    { size: 512, name: "maskable-512.png", src: Buffer.from(MASKABLE_SVG) },
  ];

  for (const { size, name, src } of targets) {
    const out = path.join(ICONS_DIR, name);
    await sharp(src).resize(size, size).png().toFile(out);
    console.log(`wrote ${out}`);
  }
}

generate().catch((error) => {
  console.error(error);
  process.exit(1);
});
