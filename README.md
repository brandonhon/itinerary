# Itinerary Builder

A single-file travel itinerary builder that produces a typeset, print-ready
document. Open `itinerary-builder.html` in a browser — there is no build step,
no server, and no install.

Fill in the form on the left; the right side is a live preview of the actual
printed pages. Every page in that preview is a real sheet of US Letter, so what
you see is what comes out of the printer or the PDF.

---

## Getting started

1. Open `itinerary-builder.html` in any modern browser.
2. Click **Load sample** to see a filled-in ten-day, two-traveler trip.
3. Click **New / blank** to start your own.

Your work is saved to the browser's local storage as you type, so closing the
tab won't lose it.

## Toolbar

| Button | What it does |
| --- | --- |
| **Theme** | Six typographic colour schemes: Classic, Warm, Monochrome, Slate, Forest, Berry |
| **Load sample** | Replaces everything with the demo trip |
| **New / blank** | Clears everything (asks first) |
| **Copy link** | A self-contained URL with the whole trip gzipped into the fragment — no server involved |
| **Save data** | Downloads the trip as JSON |
| **Load data** | Restores a JSON file |
| **Print** | Sends the paginated pages to the browser's print dialog |
| **Export PDF** | Builds a PDF and opens it in a new tab |

## What you can put in a trip

Flights, hotels, rental cars, ground transfers (taxi / rideshare / private car),
transport (train, ferry, bus, coach, shuttle), activities, tours, meals,
entertainment, meetings, and freeform notes.

The journey orders itself by date and time — you never sort anything by hand.
It always opens with the first flight and closes with the last. Timeline colours
are assigned automatically from the active theme.

Alongside the journey you get a reference rail: confirmation numbers, a costed
breakdown, a pre-departure checklist, and emergency contacts.

### Multiple travelers

Add travelers under **Header**. Each one gets their own pages, and every trip
item is assigned either to a specific traveler or to "Both / all". Turn on the
overview page for a shared-plan cover sheet that summarises everyone's routes.

Give each traveler a home timezone and flight times pick up a second line
showing the equivalent time back home.

### Money

Enter costs in whichever currency you paid in. Set an exchange rate per currency
and the totals convert into your base currency; anything missing a rate is
flagged rather than silently dropped. Shared costs can optionally be split
across travelers.

---

## How pagination works

The generated document paginates itself. A script embedded in the output waits
for the webfonts to settle, measures the real rendered height of every journey
leg and rail block, and packs them into fixed-height page boxes.

The consequence that matters: **nothing is ever cut in half.** A leg either fits
on a page or starts the next one intact. Long checklists and cost tables are the
one exception — those split by row, since a 40-item list would otherwise strand
most of a page. When a section is carried over, its day header or rail heading
repeats with `(cont.)`, and continuation pages get a slim running head instead
of the full masthead. Every page is numbered `Page n of m`.

Preview, print, and PDF export all consume the same paginated result, so they
cannot disagree with each other.

If a single item is taller than an entire page it cannot be broken cleanly, and
its tail is clipped. The preview says so explicitly rather than losing the text
quietly — shorten the note when you see that warning.

## Printing

Output is US Letter portrait (8.5 × 11 in). Each page box is exactly one sheet,
so the pages tile 1:1 with no scaling and no blank sheets between them.

For best results, print at 100% scale with margins set to none — the document
carries its own margins. Background colours are force-flagged, so you do not
need to enable "Print backgrounds"; borders print regardless.

**Export PDF** rasterises one image per page at 2× and assembles them into a
612 × 792 pt document. Text in the exported PDF is therefore not selectable. If
you want selectable text and working links, use **Print** and choose "Save as
PDF" as the destination — that path is vector.

## Sharing

**Copy link** gzips the trip, base64url-encodes it, and puts it in the URL
fragment. The fragment never leaves the browser, so nothing is uploaded
anywhere. Anyone who opens the link gets the full editable trip.

Links from another person are treated as untrusted input: all fields are HTML
escaped, and item links are restricted to `http`, `https`, `mailto`, `tel`, and
`geo` so a `javascript:` URL cannot ride in on someone else's itinerary.

---

## Requirements and dependencies

Runs from `file://` — no server needed. Tested in current Chrome.

Two things load from a CDN, both optional:

- **IBM Plex** (Google Fonts) for typography. Offline, it falls back to
  Helvetica/Arial; pagination still measures correctly because it waits on font
  loading either way.
- **jsPDF + html2canvas** (cdnjs), fetched on first use of **Export PDF** only.
  Without a network connection, Export PDF falls back to the print dialog.
  **Print** never needs the network.

## Layout of the file

Everything is in `itinerary-builder.html`:

- `#itin-css` — the print stylesheet, held as inert text and injected into the
  generated document
- `PAGINATOR` — the pagination script that runs *inside* the generated document
- builder UI styles, state, form rendering, and the print/PDF/share plumbing
