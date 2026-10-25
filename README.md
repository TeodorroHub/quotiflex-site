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
| `site/` | The published website: plain HTML, one stylesheet and two small scripts, no framework, no build step |
| `.github/workflows/pages.yml` | Publishes `site/` to GitHub Pages on every push to `main` |

## Rules the site keeps

- No analytics, no trackers, no cookies, nothing loaded from another address. Fonts and images are
  served from this site. The one exception is a YouTube video: on the home page only after the
  visitor presses its play button, on a video page (`site/videos/`) with the page, because Google
  indexes a video only when its player is in the page without a click (see "Videos" below).
- Every asset path is relative, so the same files work under `/quotiflex-site/` and at the root of
  a custom domain.
- Only the fictional demonstration companies of the product's seed data appear on the site. No
  customer names, testimonials, numbers, awards or prices.
- Other companies' systems are named only in the integration section, as examples of widely used
  systems, with the note that the names are trademarks of their owners and imply no affiliation.
  No logos of them.
- No long or medium dashes (U+2014, U+2013) anywhere in the texts.

## Design

The page uses the design of the Quotiflex application (app.quotiflex.com), so the website and the
product read as one line: the colour tokens, the wallpaper with its soft spots and grain
(`site/img/grain.png`), the glass surfaces, the system font stack, the buttons, pills and inputs
come from `frontend/src/index.css` of the application, scaled up where a web page needs it.

| File | What |
|---|---|
| `site/styles.css` | All styles of the page |
| `site/script.js` | The menu on phones, the role tabs, the demo form and the video library |
| `site/videos/*.html` | One page per video (a "watch page" for Google): the player, what the video shows, the transcript, the other videos. GitHub Pages serves `videos/x.html` at `/videos/x` |
| `site/sitemap.xml` | The home page and the video pages, with the video sitemap extension (thumbnail, title, description, player, length, date) |
| `site/fx.js` | Motion only: the highlight under the pointer, blocks that settle in as they appear, the sliding thumb of the role tabs. Blocks are hidden before they appear only when this script runs, so without it the page is complete and static. With reduced motion asked for, nothing moves |

The sections, in order: first screen with a real screen of the application; four benefits; AI
(what the built-in AI proposes and how it is controlled); videos; from the first call to the signed
order (with the team photo); three moments of a quote as they look in the application; integration;
roles; approach; questions; the demo request.

## Images, logo and font

| File | Source | Licence |
|---|---|---|
| `site/img/logo-full.png`, `logo-450.*`, `logo-760.webp`, `logo-mark.png` | The Quotiflex logo files ("Flexible and Precise"), resized for the header and the footer | Owned by Quotiflex; not covered by any open licence |
| `site/favicon.svg`, `site/favicon.ico`, `site/img/apple-touch-icon.png`, `site/img/icon-192.png` | The design's Quotiflex "Q" icon; the PNG and ICO files are drawn from the SVG | Owned by Quotiflex |
| `site/img/og-image.png` | The Quotiflex link preview image (1200 × 630) | Owned by Quotiflex |
| `site/img/team-meeting-*` | Photo "Business meeting 2" supplied by the owner of Quotiflex (October 2026), cut out of its card frame at the photo's edges and resized to 600, 800 and 1200 px | Supplied by the owner for this site |
| `site/img/screen-*` | Real screens of the Quotiflex application with sample data, cut from the clean recordings of the product videos (2880 x 1620): the quote with the deal journal, the accessories of a line, an approval request, the document in two languages | Owned by Quotiflex |
| `site/img/grain.png` | The 128 px grain tile of the application's wallpaper | Owned by Quotiflex |
| `site/fonts/InterVariable-latin.woff2` | Inter 4.1 by Rasmus Andersson, https://github.com/rsms/inter (variable font, subset to Latin) | SIL Open Font License 1.1, see `site/fonts/OFL.txt` |

The people in the photo are not customers or staff of any company. The site does not present
them as such and does not suggest they endorse the product.

The screens show only the product's fictional demonstration data (for example Osterlen Orchards
and quote Q-2026-32). The mouse pointer was taken out of the recordings by the median of still
frames. On the document picture, the Danish heading of line 1 was set to "Linje 1: maskinerne på
ruten", which is what the application prints there; the recording still showed the English name.

The photos were resized and converted to WebP, with a JPEG or PNG fallback, before they were
committed.

## Videos

The section `#videos` (after the benefits) is the library of the product videos of the Quotiflex
YouTube channel (https://www.youtube.com/@quotiflex_com): one large player (1150 px wide on a
desktop screen, so that YouTube plays it in 1080p; it chooses the quality by the player's size), under it the topic, title and text of the chosen video, and below the
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
shown in the entry, with the address of its video page in `data-page`; add the video page to the
sentence under the list (`.video-pages`). Then make its video page: copy a file in `site/videos/`,
name it after the subject (words a buyer would search for, for example `discount-approval-workflow.html`)
and change the title, description, canonical address, Open Graph tags, the `VideoObject` in the JSON-LD
(name and description as on YouTube, `uploadDate` with the time zone as YouTube shows it, `duration`,
`embedUrl`, `thumbnailUrl` = `https://quotiflex.com/img/video-N-1280.jpg`), the player, the points, the
transcript and the list of the other videos (add the new one to the other pages too). Last, add the
page with its `<video:video>` entry to `site/sitemap.xml`. The thumbnail address must be the same in
the JSON-LD and in the sitemap. The player above the list shows the first video in the HTML; the entry with
`aria-current="true"` must be that one. Topic labels name the subject, not a number.

## Search engines

- Google Search Console: the domain property `quotiflex.com` (verified by a TXT record at GoDaddy),
  owned by vs@linkport.cz. The sitemap `https://quotiflex.com/sitemap.xml` is submitted there.
- The home page carries `Organization` (Quotiflex, part of LinkPort Systems s.r.o.), `WebSite` and
  `WebPage` in JSON-LD; each video page carries `VideoObject`, `WebPage` and `BreadcrumbList`.
- The `<h1>` of the home page starts with the words people search for ("CPQ software for machine
  manufacturers"); keep them there when the headline changes.
- Title up to 60 characters, meta description up to 155, on every page, each one unique.
- The product message: Quotiflex is built around AI to make quoting faster and simpler, which directly
  increases the number of sales. Say how (more quotes, sent sooner, right the first time); do not claim
  measured results until there are figures that can be shown.

## AI assistants (ChatGPT, Claude, Gemini, Perplexity, Copilot)

- `site/robots.txt` allows every crawler and names the AI search and assistant crawlers explicitly
  (OAI-SearchBot, ChatGPT-User, GPTBot, ClaudeBot, Claude-SearchBot, Claude-User, PerplexityBot,
  Google-Extended, Applebot-Extended, Bingbot and others). Do not block them: ChatGPT and Copilot
  search through Bing, Claude through its own crawlers and Brave, Gemini through Google.
- `site/llms.txt` is the short description of the site for AI assistants (the llms.txt convention),
  ``site/llms-full.txt` the whole product description in plain text`. Keep them in step with the page when a text or a fact changes.
- `site/323dad004b99ba6e889335e7b6417e60.txt` is the IndexNow key. After a change, send the changed addresses to
  `https://api.indexnow.org/indexnow?url=<address>&key=323dad004b99ba6e889335e7b6417e60`; Bing, Seznam and Yandex share them.
- The questions and answers on the home page are also in the JSON-LD as `FAQPage`.
- AI assistants quote plain, complete sentences: every important fact (what the product is, who makes
  it, what the AI does, what it changes for sales) is written out once in plain words in the page and
  in the questions and answers, not only in pictures or in text that a script shows later.

## Change the site

Edit the files in `site/`, open `site/index.html` in a browser to check, commit and push to `main`.
The workflow publishes the new version within a minute or two.

`index.html` loads `styles.css?v=…`, `script.js?v=…` and `fx.js?v=…`, and the screen pictures and
the team photo also carry `?v=…`. After changing such a file, change its `v` value to the first 8
characters of the file's MD5, so browsers that cached the old file load the new one at once:

```
md5sum site/styles.css site/script.js site/fx.js | cut -c1-8
md5sum site/img/screen-*.webp site/img/team-meeting-* | cut -c1-8
```

The old preview address https://quotiflex.com/preview/ only forwards to the home page.
