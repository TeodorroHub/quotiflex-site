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
| `site/img/logo-*.png`, `logo-wordmark.webp`, favicons, `og-image.png` | The Quotiflex logo files ("Flexible and Precise") | Owned by Quotiflex; not covered by any open licence |
| `site/img/quote-screen-*` | Screenshot of the Quotiflex quote screen, taken on a local copy of the product with its fictional demonstration data (the company OrchardTec Engineering and its customer Malar Valley Greenhouses are invented) | Owned by Quotiflex |
| `site/img/team-*` | Photo "A Group of People Looking at the Laptop" by Yan Krukau, https://www.pexels.com/photo/a-group-of-people-looking-at-the-laptop-7691708/ | Pexels License (free for commercial use, no attribution required): https://www.pexels.com/license/ |
| `site/fonts/InterVariable-latin.woff2` | Inter 4.1 by Rasmus Andersson, https://github.com/rsms/inter (variable font, subset to Latin) | SIL Open Font License 1.1, see `site/fonts/OFL.txt` |

The people in the photo are models from a stock photo. The site does not present them as
customers or staff and does not suggest they endorse the product.

The images were resized and converted to WebP (with a JPEG or PNG fallback) before they were
committed; the screenshot was taken at a device scale factor of 2.

## Change the site

Edit the files in `site/`, open `site/index.html` in a browser to check, commit and push to `main`.
The workflow publishes the new version within a minute or two.
