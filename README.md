# Saphara Travel site (Astro)

Replaces the Python generator in `tools/` (kept until the switch is approved). Same pages, same URLs, same markup.

## Build
Run these commands from the repository root:
```
npm ci
npm run build      # outputs dist/ (one .html file per page)
npm run dev        # local preview with live reload
npm run preview    # preview the production build locally
```

The build is also checked by GitHub Actions. The workflow checks the shared browser scripts, builds the site, and runs a small smoke test against the generated homepage, Price Check page and trip enquiry page.

## Where things live
- `src/data/hotel-questions.json`: the homepage "Pack light." list of questions we ask hotels. Edit the questions, then rebuild.
- `src/data/content.json`: all page content (destinations, guides, trip pages, FAQs, legal text, icons, flags, skyline). Exported from the Python source on 14 Nov 2026; edit here from now on.
- `src/lib/site.js`: shared blocks (header, phone menu, footer, sticky bar, cards, panels) and the `PROTOTYPE` switch.
- `src/lib/pages.js`: what goes on each page.
- `src/components/home/*.html`: the homepage, one file per section, in page order.
- `src/layouts/Base.astro`: head, metadata, noindex, header, footer and the shared script on every page.
- `src/pages/`: one file per route (trips, destinations and guides use dynamic routes). Files starting with `_` aren't built (Travel essentials is hidden that way until its affiliate links exist).
- `public/assets/site.css`, `public/assets/site.js`: styles and script (source of truth now).
- `public/img/`: images.

## Search engines
Internal links are rewritten to clean addresses (`/privacy`, `/guides/`) after each page is built (`cleanLinks` in `src/lib/site.js`), so preview with a server that serves `privacy.html` at `/privacy`, like Cloudflare does. Structured data (TravelAgency, WebSite, BreadcrumbList, Article) is added in `Base.astro`.
`PROTOTYPE` in `src/lib/site.js` is `false` for launch. `true` adds `noindex, nofollow` to every page and makes `robots.txt` disallow everything (use it only for a private preview build). 404 and thank-you stay noindex either way. `sitemap.xml` is written after every build (see `astro.config.mjs`). `public/_redirects` and `public/_headers` are Cloudflare's redirect and header files.

## Checking a change against the previous build
```
python3 -I tools/qa/compare_builds.py <old build> astro/dist   # tags, attributes and text, page by page
python3 -I tools/qa/pixdiff.py <old shots> <new shots>          # pixel comparison of screenshots
```
