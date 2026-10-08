# quotiflex.com

The public website of Quotiflex, the CPQ (configure, price, quote) software for manufacturers.
This repository holds the website only; the product lives elsewhere.

- Preview: https://teodorrohub.github.io/quotiflex-site/
- Product sign-in: https://app.quotiflex.com

## What is here

| Path | What |
|---|---|
| `site/` | The published website: plain HTML, CSS and a small script, no framework, no build step |
| `.github/workflows/pages.yml` | Publishes `site/` to GitHub Pages on every push to `main` |

## Rules the site keeps

- No analytics, no trackers, no cookies, nothing loaded from another address. Fonts and images are
  served from this site.
- Every asset path is relative, so the same files work under `/quotiflex-site/` and at the root of
  a custom domain.
- Only the fictional demonstration companies of the product's seed data appear on the site. No
  customer names, testimonials, numbers, awards or prices.

## Images, logo and font

| File | Source | Licence |
|---|---|---|
| `site/img/logo-full.png`, `logo-450.*`, `logo-760.webp`, `logo-mark.png` | The Quotiflex logo files ("Flexible and Precise"), resized for the header and the footer | Owned by Quotiflex; not covered by any open licence |
| `site/favicon.svg`, `site/favicon.ico`, `site/img/apple-touch-icon.png`, `site/img/icon-192.png` | The design's Quotiflex "Q" icon; the PNG and ICO files are drawn from the SVG | Owned by Quotiflex |
| `site/img/og-image.png` | The Quotiflex link preview image (1200 × 630) | Owned by Quotiflex |
| `site/img/team-*` | Photo "A Group of People Looking at the Laptop" by Yan Krukau, https://www.pexels.com/photo/a-group-of-people-looking-at-the-laptop-7691708/, cropped to a wide strip | Pexels License (free for commercial use, no attribution required): https://www.pexels.com/license/ |
| `site/fonts/InterVariable-latin.woff2` | Inter 4.1 by Rasmus Andersson, https://github.com/rsms/inter (variable font, subset to Latin) | SIL Open Font License 1.1, see `site/fonts/OFL.txt` |

The people in the photo are models from a stock photo. The site does not present them as
customers or staff and does not suggest they endorse the product.

The quote screen in the hero is drawn in HTML and CSS as an illustration with sample data. The
names in it (Malar Valley Greenhouses, the product TP-24, the initials ML) come from the product's
fictional demonstration data.

The photos were resized and converted to WebP, with a JPEG or PNG fallback, before they were
committed.

## Change the site

Edit the files in `site/`, open `site/index.html` in a browser to check, commit and push to `main`.
The workflow publishes the new version within a minute or two.
