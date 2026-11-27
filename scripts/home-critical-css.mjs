import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import Beasties from "beasties";

const phone = "(width < 768px)";
const wider = "(min-width: 768px), print";

async function inlineHomeCriticalCss(outDir) {
  const file = join(outDir, "index.html");
  const html = readFileSync(file, "utf8");
  const mainCss = html.match(/<link rel="stylesheet" href="(assets\/site\.css\?v=[a-f0-9]+)">/);
  const adobeCss = '<link rel="stylesheet" href="https://use.typekit.net/swo1kcy.css">';
  if (!mainCss || !html.includes(adobeCss)) {
    throw new Error("Homepage stylesheets were not found");
  }

  // Read the rendered header, menu, hero and opening sections as one document so
  // selectors depending on their ancestors and siblings are kept.
  const trips = html.search(/<section\b[^>]*\bid="trips"/);
  if (trips === -1) throw new Error("Could not find the end of the homepage's opening sections");
  const sample = html.slice(0, trips)
    .replace('<html lang="en-GB">', '<html lang="en-GB" class="js">') + "</main></body></html>";

  const beasties = new Beasties({
    path: outDir,
    include: /assets\/site\.css/,
    pruneSource: false,
    compress: true,
    fonts: false,
    logLevel: "warn",
  });
  const processed = await beasties.process(sample);
  const critical = processed.match(/<style(?:\s[^>]*)?>([\s\S]*?)<\/style>/)?.[1];
  if (!critical?.includes(".hd-wrap")) {
    throw new Error("Could not generate the homepage's first-screen styles");
  }

  // Font family names are set through CSS variables, which Beasties cannot follow.
  const siteCss = readFileSync(join(outDir, "assets", "site.css"), "utf8");
  const fontFaces = (siteCss.match(/@font-face\s*\{[^}]*\}/g) ?? [])
    .join("").replaceAll("url(fonts/", "url(/assets/fonts/");

  function stylesheets(href, priority = "") {
    return `<link rel="stylesheet" href="${href}" media="${wider}">
<link rel="stylesheet" href="${href}" media="print"${priority} onload="this.media='${phone}'">
<noscript><link rel="stylesheet" href="${href}" media="${phone}"></noscript>`;
  }

  writeFileSync(file, html
    .replace(adobeCss, () => `<style media="${phone}">${fontFaces}${critical}</style>\n${stylesheets("https://use.typekit.net/swo1kcy.css")}`)
    .replace(mainCss[0], () => stylesheets(mainCss[1], ' fetchpriority="low"')));
}

export const homeCriticalCss = {
  name: "saphara-home-critical-css",
  hooks: {
    "astro:build:done": ({ dir }) => inlineHomeCriticalCss(fileURLToPath(dir)),
  },
};
