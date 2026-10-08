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

## Change the site

Edit the files in `site/`, open `site/index.html` in a browser to check, commit and push to `main`.
The workflow publishes the new version within a minute or two.
