// Builds transparent logo assets from the supplied square logo (public/IMG_3542.png).
//   node scripts/make-logo.mjs
// Outputs to public/brand/: mark.png (icon only), logo-dark.png and logo-light.png
// (horizontal lockups for light and dark backgrounds).
import fs from "node:fs";
import sharp from "sharp";

const SRC = "public/IMG_3542.png";
const OUT = "public/brand";
fs.mkdirSync(OUT, { recursive: true });

const { data, info } = await sharp(SRC).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;
const px = (x, y) => (y * W + x) * 3;

// Background colour = average of the four corners.
const corners = [px(5, 5), px(W - 6, 5), px(5, H - 6), px(W - 6, H - 6)];
const bg = [0, 1, 2].map((c) => corners.reduce((s, i) => s + data[i + c], 0) / 4);

// Remove the background: alpha from colour distance, colour un-blended from the background.
const rgba = Buffer.alloc(W * H * 4);
for (let i = 0, j = 0; i < data.length; i += 3, j += 4) {
  const d = Math.hypot(data[i] - bg[0], data[i + 1] - bg[1], data[i + 2] - bg[2]);
  const a = Math.min(1, Math.max(0, (d - 10) / 60));
  for (let c = 0; c < 3; c++) {
    const v = a > 0 ? (data[i + c] - (1 - a) * bg[c]) / a : 0;
    rgba[j + c] = Math.max(0, Math.min(255, Math.round(v)));
  }
  rgba[j + 3] = Math.round(a * 255);
}

// Find horizontal bands of content (icon, then wordmark + "REALTY").
const rowHas = [];
for (let y = 0; y < H; y++) {
  let n = 0;
  for (let x = 0; x < W; x++) if (rgba[(y * W + x) * 4 + 3] > 40) n++;
  rowHas.push(n > 2);
}
const bands = [];
for (let y = 0; y < H; y++) {
  if (rowHas[y] && (y === 0 || !rowHas[y - 1])) bands.push([y, y]);
  if (rowHas[y] && bands.length) bands[bands.length - 1][1] = y;
}
const big = bands.filter(([a, b]) => b - a > 20);
if (big.length < 3) throw new Error(`expected icon + 2 text bands, found ${JSON.stringify(big)}`);
const [iconBand, wordBand, realtyBand] = big;

function cols(y0, y1) {
  let x0 = W, x1 = 0;
  for (let y = y0; y <= y1; y++)
    for (let x = 0; x < W; x++)
      if (rgba[(y * W + x) * 4 + 3] > 40) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); }
  return [x0, x1];
}
const base = sharp(rgba, { raw: { width: W, height: H, channels: 4 } });
async function crop(y0, y1, pad = 4) {
  const [x0, x1] = cols(y0, y1);
  return base.clone()
    .extract({ left: Math.max(0, x0 - pad), top: Math.max(0, y0 - pad), width: Math.min(W, x1 - x0 + 1 + pad * 2), height: Math.min(H, y1 - y0 + 1 + pad * 2) })
    .png().toBuffer();
}

const icon = await crop(...iconBand);
const textBlock = await crop(wordBand[0], realtyBand[1]);

await sharp(icon).resize(512, 512, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(`${OUT}/mark.png`);

// Horizontal lockup: icon | gap | text block, both scaled to the same height.
const LOCK_H = 160;
const iconR = await sharp(icon).resize({ height: LOCK_H }).png().toBuffer();
const textR = await sharp(textBlock).resize({ height: Math.round(LOCK_H * 0.82) }).png().toBuffer();
const [im, tm] = await Promise.all([sharp(iconR).metadata(), sharp(textR).metadata()]);
const GAP = Math.round(LOCK_H * 0.22);
const lockW = im.width + GAP + tm.width;

async function lockup(textBuf, file) {
  await sharp({ create: { width: lockW, height: LOCK_H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([
      { input: iconR, left: 0, top: 0 },
      { input: textBuf, left: im.width + GAP, top: Math.round((LOCK_H - tm.height) / 2) },
    ])
    .png()
    .toFile(file);
}
await lockup(textR, `${OUT}/logo-dark.png`);
// Light version: text recoloured white, alpha kept.
const whiteText = await sharp(textR).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
for (let i = 0; i < whiteText.data.length; i += 4) whiteText.data[i] = whiteText.data[i + 1] = whiteText.data[i + 2] = 255;
const whiteBuf = await sharp(whiteText.data, { raw: whiteText.info }).png().toBuffer();
await lockup(whiteBuf, `${OUT}/logo-light.png`);

console.log(JSON.stringify({ bg: bg.map(Math.round), bands: big, lockup: [lockW, LOCK_H] }));
