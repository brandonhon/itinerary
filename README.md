# Itinerary Builder

A static travel itinerary builder that produces a typeset, print-ready
document. The site is plain HTML, CSS, and JavaScript — nothing to build, no
server, nothing to install. Open `index.html` in a browser, or host the folder
on any static host such as GitHub Pages.

The one exception is the lookup tables in `data/` — airports, airlines and
reference exchange rates — which are generated and committed. Regenerating them
needs Node and a single package; using or hosting the site does not.

Fill in the form on the left; the right side is a live preview of the actual
printed pages. Every page in that preview is a real sheet of paper — US Letter
or A4, whichever you pick — so what you see is what comes out of the printer or
the PDF. Once you have scrolled a
way down, a **↑ Top** button appears in the corner of the preview.

**Live:** https://brandonhon.github.io/itinerary/

---

## Getting started

1. Open `index.html` in any modern browser (or visit the live link above).
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
| **Undo** | Takes back the last delete, or the last action that replaced the whole trip |
| **Copy link** | A self-contained URL with the whole trip gzipped into the fragment — no server involved |
| **Save data** | Downloads the trip as JSON |
| **Load data** | Restores a JSON file |
| **Print** | Sends the paginated pages to the browser's print dialog |
| **Calendar** | Downloads the whole trip as an `.ics`; per-traveler calendars are under **Sharing & export** |
| **Export PDF** | Builds a PDF and opens it in a new tab |
| **Edit this trip** | Phones only, on a shared link — swaps the reading view for the full builder |

## What you can put in a trip

Flights, hotels, rental cars, ground transfers (taxi / rideshare / private car),
transport (train, ferry, bus, coach, shuttle), activities, tours, meals,
entertainment, meetings, and freeform notes.

The journey orders itself by date and time — you never sort anything by hand,
and where UTC offsets are set it orders by the real instant rather than by the
wall clock (see [Dates and times](#dates-and-times)). It always opens with the
first flight and closes with the last. Whatever the
item, its note prints last, on its own labelled row, so the details above it
stay scannable. Timeline colours
are assigned automatically from the active theme.

Each card in the builder is headed with what it holds — `FLIGHT · United
DEN–LIS · Fri 18` — so a long trip stays scannable without opening every one.

An item you have added but not filled in yet stays out of the document until it
says something. A date or a time on its own doesn't count, so a half-started
card never turns up mid-itinerary as an empty entry.

Alongside the journey you get a reference rail: confirmation numbers, a costed
breakdown, a checklist, and emergency contacts.

Flights take any number of connections — each one an airport and a layover, and
they print on a single Via line. Transport does the same for intermediate stops,
since a train or bus route often has several, and it takes a list of links
rather than one: a timetable, a station map and a booking can all sit on the
same leg.

Transport also names the service — `IC 522`, `Line 2` — which is its
counterpart to a flight number, along with a direction (`towards Cais do
Sodré`), and any stop can be marked as a change rather than a call. A whole
multi-line journey fits on one item: board the Red line, stay on through
Saldanha, change to the Green line at Baixa-Chiado. Stops print one per line
under a single heading rather than running together. The checklist can hold more than one section:
add a section heading and every item below it belongs to that section, and cards
can be dragged to reorder with a mouse, or moved with ↑/↓. On a touch screen
the drag handle is hidden, because HTML5 drag-and-drop never fires from touch —
the arrows do the job there.

### Multiple travelers

Add travelers under **Header**. Each one gets their own pages, and every trip
item is assigned either to a specific traveler or to "Both / all". Turn on the
overview page for a shared-plan cover sheet that summarises everyone's routes.

Give each traveler a home timezone and any item whose UTC offset is known picks
up a second line showing the equivalent time back home — not just flights. It is
left off where the two clocks agree, so a traveler already in the zone sees no
clutter.

### Dates and times

Empty date fields open the calendar on your trip's month rather than on today,
and empty time fields start at 00:00 rather than at whatever the clock happens
to say — browsers differ on both, so the app sets them itself. Tabbing past an
empty field still leaves it empty; nothing is filled in behind your back.

Every timed item can state a **UTC offset** and a **timezone label**, the same
pair a flight leg has always had. The offset is what places the item against
items in other zones, pins it in the calendar export, and works out the
home-time line; the label is only what prints beside the clock — `05:35 HKT`.
Leave both blank on a trip that never changes zone and nothing changes.

Set them and the journey orders itself by the **real instant** rather than by
the wall clock, which matters the moment a trip crosses a zone: a 09:30 shuttle
in Macau really does happen before a 13:00 flight from Hong Kong, and a taxi
from the airport really does come after the flight that lands at 05:05. An item
that states no offset borrows from whichever item that does sits nearest it in
time, so a trip where only the flights are filled in still orders sensibly.

Turn on **Group journey into day headers** and the days are the unit instead:
items are bucketed by their own local date with the days running forwards, and
true chronological order is kept inside each day. Without that, an itinerary
crossing the date line — leave Tokyo on the 3rd, land in Honolulu on the 2nd —
would print its day headings backwards.

A hotel takes a **check-in time**. It decides where the hotel sits in the
journey and prints beside the name; left blank it is assumed to be mid-afternoon
(15:00), which will sit above a flight that lands later that afternoon.

### Money

Enter costs in whichever currency you paid in, and give each traveler a currency
of their own. Their page then shows every cost converted into it, with what was
actually paid noted beside the amount — a rideshare booked in HKD reads as
`$10.00 / paid in HKD` on a traveler set to USD — and the total is in their
currency. Two travelers can read the same trip in different currencies.

You don't have to set rates by hand. `data/rates.json` ships with the site and
is refreshed weekly by `.github/workflows/refresh-rates.yml`, so conversions
work out of the box; the editor shows each reference rate greyed out, with the
date it came from. Type over one to pin your own — a hand-entered rate always
wins, which is what you want if you'd rather use the rate your card charged
than the mid-market one.

A cost with no usable rate keeps its original amount, is left out of the total,
and the total is marked partial rather than being quietly wrong — which is also
what happens if the rates file can't be loaded at all. Shared costs can
optionally be split across travelers.

Rates are reference mid-market figures and are a snapshot, not live: fine for
budgeting a trip, not for reconciling a statement.

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

Output is portrait, at **US Letter (8.5 × 11 in) or A4 (210 × 297 mm)** — set
under Document & display. Each page box is exactly one sheet of whichever you
chose, so the pages tile 1:1 with no scaling and no blank sheets between them.
A4 fits a little more per page, so the same trip may come out a page shorter.

Pick A4 if you might print abroad: it is the standard nearly everywhere outside
North America, and a Letter-shaped document printed on A4 gets scaled or
clipped.

For best results, print at 100% scale with margins set to none — the document
carries its own margins. Background colours are force-flagged, so you do not
need to enable "Print backgrounds"; borders print regardless.

**Export PDF** rasterises one image per page at 2× and assembles them into a
612 × 792 pt document. Text in the exported PDF is therefore not selectable. If
you want selectable text and working links, use **Print** and choose "Save as
PDF" as the destination — that path is vector.

## Calendar

**Calendar** downloads the whole trip as an `.ics` file — import it into Google
Calendar, Apple Calendar, Outlook or anything else that reads the format.

Anything whose UTC offset is known is written as a real instant, so it stays
correct wherever the calendar is read. That includes items that never stated an
offset themselves but sit between two that did — the export uses the same
resolution the printed page uses, so the two can't disagree about when something
happens.

An item on a trip that states no offset anywhere is written as a *floating*
time: no zone, shown at the same clock time whatever zone you are in. That is
the right answer for a trip that never leaves one zone, and it is why offsets
are worth filling in on one that does.

Hotels and rental cars become all-day spans; anything with a time but no end
gets an hour. Because an all-day event can't carry a clock time, a hotel's
check-in time and a car's drop-off time are written into the description
instead. Confirmation numbers, notes, stops, flight numbers, the operator, who a
meeting is with, and links all go into the description too, and the first link
is also attached as a real `URL:` property so calendars render it as something
you can click.

Event UIDs are derived from what the event is — type, date and title — not from
its position in the trip. Re-exporting after adding or removing an item updates
the events you already imported instead of giving you a second copy of the whole
trip. Changing an item's type, date or title does mint a new UID, so that one
item will arrive as a new event.

The toolbar button exports the whole trip. On a multi-traveler trip, **Sharing
& export** also offers one calendar per traveler — their own items plus
everything shared, the same split their printed pages use — so each person can
import a file without the other's flights in it.

A shared event keeps the same identity in every file it appears in, so
importing one traveler's calendar alongside another's, or alongside the whole
trip, updates those events rather than making a second copy.

## Sharing

**Copy link** gzips the trip, base64url-encodes it, and puts it in the URL
fragment. The fragment never leaves the browser, so nothing is uploaded
anywhere. Anyone who opens the link gets the full editable trip.

Links from another person are treated as untrusted input: all fields are HTML
escaped, item links are restricted to `http`, `https`, `mailto`, `tel`, and
`geo` so a `javascript:` URL cannot ride in on someone else's itinerary, and
anything malformed falls back to the sample trip rather than breaking the page.

Opened on a phone, a shared link shows the itinerary rather than the builder —
whoever you sent it to almost certainly wants to read the trip, not edit it.
**Edit this trip** brings the full builder back. The same link on a desktop
opens the builder as normal.

## On a phone

The form is fully usable on a phone: the two panes stack and the fields fill the
width. The preview is the awkward part, because a page is a fixed sheet of US
Letter — shrunk to fit a 390px screen it renders 11px print type at about 4.5px,
which no amount of responsive CSS can rescue.

So below 700px the pages collapse behind a **View pages** toggle and are shown
at natural size instead of scaled down, which leaves them legible and lets the
browser's own pinch-zoom work on real text. The page count stays visible while
they are collapsed.

---

## Requirements and dependencies

Runs from `file://` for everything except the bundled JSON tables under `data/`,
which are fetched over HTTP: airport prefill and the reference exchange rates.
Both fail quietly off disk — prefill goes inert and the editor asks you to enter
rates by hand. Everything else — editing, preview, print, PDF, share links —
works straight off disk. Tested in current Chrome.

To serve it locally, `make` (or `make serve`) starts a static server on
http://localhost:8138/; `PORT=8199 make serve` moves it. It binds `127.0.0.1`
deliberately, since a saved trip in the repo folder holds real travel details.
`make help` lists the targets.

Two things load from a CDN at runtime, both optional:

- **IBM Plex** (Google Fonts) for typography. Offline, it falls back to
  Helvetica/Arial; pagination still measures correctly because it waits on font
  loading either way.
- **jsPDF + html2canvas** (cdnjs), fetched on first use of **Export PDF** only,
  and pinned by SRI hash — a tampered or altered response is refused by the
  browser. Without a network connection, Export PDF falls back to the print
  dialog. **Print** never needs the network.

Nothing else is fetched, and the page loads no third-party JavaScript. Separately
from all of this, `package.json` pins one package used only to regenerate
`data/` — see below. It never reaches the browser.

## Project layout

```
Makefile        `make serve` — the local server used for testing
index.html      markup shell + the print stylesheet held as inert text
css/app.css     styles for the builder UI (form + preview chrome)
js/app.js       state, form rendering, pagination, and print/PDF/share plumbing
favicon.svg     the mark; favicon.ico is the fallback for browsers without SVG
data/           airport, airline and exchange-rate tables (generated, committed)
scripts/        build-data.mjs and build-rates.mjs, regenerate data/
package.json    the one build-time dependency; the site itself uses none
.github/        workflows that refresh data/ — airports twice a year, rates weekly
```

- `index.html` also carries `#itin-css`, a `<script type="text/plain">` block
  holding the generated document's stylesheet. It's kept inline (not a linked
  `.css`) because `js/app.js` reads it as text and injects it into each
  generated document — this keeps it working identically from `file://` and
  over HTTP with no extra fetch.
- Inside `js/app.js`, `PAGINATOR` is the pagination script that is serialized
  into, and runs *inside*, each generated document. Preview, print, and PDF all
  consume the same paginated result.

Paths are relative, so the folder can be served from any subdirectory (as
GitHub Pages does) without configuration.

## Airport and airline data

Typing an airport code fills in the city, the UTC offset and the timezone; the
first two characters of the flight number fill in the carrier. It fires as soon
as the third character of the code lands — no need to leave the field.

The offset is worked out for that flight's own date. If you haven't set one yet
it falls back to the trip start, then to today, and corrects itself the moment a
date is entered — so a brand-new flight still fills in straight away.

Timezone shows a real abbreviation where one exists (`MDT`) and a compact offset
where it doesn't (`UTC+1`). Most of the world has no standard abbreviation, and
a plain offset beats both a blank field and a wrong guess.

Prefill only fills blanks, and it will replace a value it filled itself but
never one you typed. So changing the airport code updates the city it guessed,
while a city you wrote by hand stays put.

The tables live in `data/` and are committed rather than fetched at runtime, so
the page depends on no third-party host while it runs. Regenerate them with:

```sh
npm install && node scripts/build-data.mjs
```

That is the only thing in this repo with a dependency, and it is build-time
only — the published site is still plain HTML, CSS and JavaScript.

`.github/workflows/refresh-airport-data.yml` does this on 1 January and 1 July,
and a separate weekly job refreshes the exchange rates.
It is worth running: new airports open, and daylight-saving rule changes are
handled by the browser's own timezone database rather than by these files. A
stale table means a prefill doesn't happen, never a wrong itinerary.

> Note: GitHub disables scheduled workflows in a repository with no activity for
> 60 days, which a six-monthly job can trip over. If a refresh never appears,
> re-enable it from the Actions tab, or run it there by hand.

Airport data from [OurAirports](https://ourairports.com/data/), released into
the public domain, with each timezone resolved from the airport's own
coordinates at build time via [tz-lookup](https://www.npmjs.com/package/tz-lookup).
Airline names from [OpenFlights](https://openflights.org/data.html), used under
the [Open Database License](https://opendatacommons.org/licenses/odbl/1-0/).
