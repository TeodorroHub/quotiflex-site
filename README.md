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

The section `#videos` (after the benefits) is the library of the product videos of the Quotiflex
YouTube channel (https://www.youtube.com/@quotiflex_com): one large player (1180 px wide, so that
YouTube plays it in 1080p), under it the topic, title and text of the chosen video, and below the
list of all videos (picture, topic, title, length). Choosing a video in the list puts it in the
player and starts it, and the address gets its anchor, for example
`https://quotiflex.com/#video-accessory-rules`; such a link opens the section with that video in
the player, which is how a single video is sent to someone. Only one video plays at a time.

Each video is a link to YouTube with our own poster in `site/img/video-N-{640,1280,1920}.webp` and
`video-N-1280.jpg`, made from the cover frame of the video. Pressing it makes `script.js` put
YouTube's privacy-enhanced player (`youtube-nocookie.com`) in its place; before that, the page
requests nothing from YouTube, and without script every poster and list entry simply opens YouTube.
The Content-Security-Policy allows frames from `https://www.youtube-nocookie.com` only. The hero
links to the section. The privacy note under the form and the footer say that a video plays from
YouTube once it is pressed.

To add a video: add its posters; add a `<span class="video-anchor" id="video-...">` (the topic in
words) next to the others at the top of the library, where the browser scrolls a link with that
anchor; copy a `<li>` of `<ol class="video-list">` and set the same anchor in `data-anchor`, the
YouTube id in `href` and `data-youtube`, the poster base in `data-poster`, the length in
`data-length` and `data-length-label`, the text in `data-desc`, and the topic, title and length
shown in the entry; then add a `VideoObject` script to the JSON-LD in `<head>`. The player above the list shows the first video in the HTML; the entry with
`aria-current="true"` must be that one. Topic labels name the subject, not a number.

## Change the site

Edit the files in `site/`, open `site/index.html` in a browser to check, commit and push to `main`.
The workflow publishes the new version within a minute or two.

`index.html` loads `styles.css?v=…` and `script.js?v=…`. After changing either file, change its `v`
value (for example to the first 8 characters of the file's MD5), so browsers that cached the old
file load the new one at once:

```
md5sum site/styles.css site/script.js | cut -c1-8
```
