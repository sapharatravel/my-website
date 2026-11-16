// Saphara Travel site (Astro). Static output; one .html file per page so URLs and relative links match the prototype.
import { defineConfig } from "astro/config";
import { readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

// After the build, write sitemap.xml from the pages that were actually built, at the clean addresses the host serves
// (privacy.html is served at /privacy, guides/index.html at /guides/). 404 and thank-you are left out.
const sitemap = {
  name: "saphara-sitemap",
  hooks: {
    "astro:build:done": ({ dir }) => {
      const root = fileURLToPath(dir);
      const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
      const urls = walk(root)
        .map((f) => relative(root, f).split("\\").join("/"))
        .filter((f) => f.endsWith(".html") && !["404.html", "thank-you.html"].includes(f))
        .map((f) => f.replace(/(^|\/)index\.html$/, "$1").replace(/\.html$/, ""))
        .sort()
        .map((p) => `  <url><loc>https://sapharatravel.co.uk/${p}</loc></url>`);
      writeFileSync(join(root, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`);
    },
  },
};

export default defineConfig({
  output: "static",
  build: { format: "preserve", assets: "assets/_astro", inlineStylesheets: "never" },
  trailingSlash: "ignore",
  compressHTML: false,
  devToolbar: { enabled: false },
  integrations: [sitemap],
});
