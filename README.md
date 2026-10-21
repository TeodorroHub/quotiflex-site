# quotiflex.com

The public website of Quotiflex, the CPQ (configure, price, quote) software for manufacturers.
This repository holds the website only; the product lives elsewhere.

- Website: https://quotiflex.com (www.quotiflex.com and the old preview address
  https://teodorrohub.github.io/quotiflex-site/ redirect to it)
- Product sign-in: https://app.quotiflex.com

The custom domain is set in the repository's Pages settings. Because the site is published by a
GitHub Actions workflow, it needs no CNAME file.

## What is here

| Path | What |
|---|---|
| `site/` | The published website: plain HTML, CSS and a small script, no framework, no build step |
| `.github/workflows/pages.yml` | Publishes `site/` to GitHub Pages on every push to `main` |

## Rules the site keeps

- No analytics, no trackers, no cookies, nothing loaded from another address. Fonts and images are
  served from this site. The one exception is a YouTube video, and only after the visitor presses
  its play button (see "Videos" below).
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

## Videos

The section `#videos` (after the benefits) shows the product videos of the Quotiflex YouTube channel
(https://www.youtube.com/@quotiflex_com). Each video is a link to YouTube with our own poster in
`site/img/video-N-*.{webp,jpg}`, made from the cover frame of the video. Pressing it makes
`script.js` put YouTube's privacy-enhanced player (`youtube-nocookie.com`) in its place; before
that, the page requests nothing from YouTube, and without script the link simply opens YouTube.
The Content-Security-Policy allows frames from `https://www.youtube-nocookie.com` only. The hero
links to the section. The privacy note under the form and the footer say that a video plays from
YouTube once it is pressed.

To add a video: copy an `<article class="video-feature">` block below the last one (every second
card also gets the class `video-feature-flip`, which puts the player on the right), set the YouTube
id in `href` and `data-youtube`, the title, the length and the text, add its poster images, and add
a `VideoObject` script to the JSON-LD in `<head>`. Only one video plays at a time: starting another
puts the poster back on the first.

## Change the site

Edit the files in `site/`, open `site/index.html` in a browser to check, commit and push to `main`.
The workflow publishes the new version within a minute or two.

`index.html` loads `styles.css?v=…` and `script.js?v=…`. After changing either file, change its `v`
value (for example to the first 8 characters of the file's MD5), so browsers that cached the old
file load the new one at once:

```
md5sum site/styles.css site/script.js | cut -c1-8
```
