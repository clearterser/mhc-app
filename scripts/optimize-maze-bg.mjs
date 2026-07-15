// Изометр maze хээг вебийн дэвсгэрт зориулж AVIF + WebP болгож оптимайзчилна.
// Эх зураг: design-assets/maze-source.(png|jpg|jpeg) — Next үүнийг serve хийхгүй.
// Ашиглах:
//   node scripts/optimize-maze-bg.mjs
// Гаралт: public/maze-bg.avif, public/maze-bg.webp
import sharp from "sharp";
import { existsSync, statSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const pub = path.join(root, "public");
const names = ["maze-source.png", "maze-source.jpg", "maze-source.jpeg"];
// Эхлээд design-assets/ (serve хийгддэггүй), дараа нь public/-оос хайна.
const searchDirs = [path.join(root, "design-assets"), pub];
const src = searchDirs
  .flatMap((d) => names.map((f) => path.join(d, f)))
  .find(existsSync);

if (!src) {
  console.error(
    "Эх зураг олдсонгүй. design-assets/maze-source.png (эсвэл .jpg) нэрээр хийнэ үү.",
  );
  process.exit(1);
}

// Дэвсгэр нь бага opacity-тай, cover горимоор харагдах тул 1100px өргөн хангалттай.
const WIDTH = 1100;

const avifOut = path.join(pub, "maze-bg.avif");
const webpOut = path.join(pub, "maze-bg.webp");

const base = sharp(src)
  .resize({ width: WIDTH, withoutEnlargement: true })
  .grayscale(); // зураг саарал шугаман тул grayscale хэмжээг бууруулна

await base.clone().avif({ quality: 42, effort: 6 }).toFile(avifOut);
await base.clone().webp({ quality: 62 }).toFile(webpOut);

const kb = (p) => (statSync(p).size / 1024).toFixed(1) + " KB";
console.log(`✓ ${path.basename(avifOut)} — ${kb(avifOut)}`);
console.log(`✓ ${path.basename(webpOut)} — ${kb(webpOut)}`);
