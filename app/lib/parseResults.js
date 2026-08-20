// Shared results-sheet parsing used by /api/results and /api/athlete-search.

export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (ch !== "\r") {
      field += ch;
    }
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

const norm = (s) => (s == null ? "" : String(s)).trim();

// Detect event blocks. Anchor on the NAME header (rather than PLACE) because
// some sheets label the place column and others leave that header blank, e.g.
//   ["PLACE","NAME","AGE","TIME"]   and   ["","NAME","AGE","TIME"]
// AGE/TIME columns are located by their own headers, so extra or reordered
// columns still parse. Multiple NAME headers in one row = side-by-side events.
export function parseEvents(rows) {
  const events = [];
  const HEADERS = ["PLACE", "NAME", "AGE", "TIME", "#"];

  for (let r = 0; r < rows.length; r++) {
    const row = rows[r] || [];
    const nameCols = [];
    for (let c = 0; c < row.length; c++) {
      if (norm(row[c]).toUpperCase() === "NAME") nameCols.push(c);
    }

    for (let ni = 0; ni < nameCols.length; ni++) {
      const nameCol = nameCols[ni];
      // Block ends where the next event's columns begin.
      const blockEnd = ni + 1 < nameCols.length ? nameCols[ni + 1] - 1 : row.length - 1;

      // Place column: the cell left of NAME, when it is blank or says PLACE/#.
      let placeCol = -1;
      if (nameCol > 0) {
        const left = norm(row[nameCol - 1]).toUpperCase();
        if (left === "" || left === "PLACE" || left === "#") placeCol = nameCol - 1;
      }

      let ageCol = -1;
      let timeCol = -1;
      for (let c = nameCol + 1; c <= blockEnd; c++) {
        const h = norm(row[c]).toUpperCase();
        if (h === "AGE" && ageCol < 0) ageCol = c;
        else if (h === "TIME" && timeCol < 0) timeCol = c;
      }

      // Event title: nearest non-header text above this block.
      let title = "";
      const from = placeCol >= 0 ? placeCol : nameCol;
      const to = Math.max(timeCol, ageCol, nameCol);
      for (let tr = r - 1; tr >= 0 && tr >= r - 3; tr--) {
        for (let cc = from; cc <= to; cc++) {
          const v = norm(rows[tr] && rows[tr][cc]);
          if (v && !HEADERS.includes(v.toUpperCase())) {
            title = v;
            break;
          }
        }
        if (title) break;
      }

      const entries = [];
      for (let dr = r + 1; dr < rows.length; dr++) {
        const drow = rows[dr] || [];
        const name = norm(drow[nameCol]);
        if (name.toUpperCase() === "NAME") break; // next header block
        const place = placeCol >= 0 ? norm(drow[placeCol]) : "";
        if (!name && !place) {
          if (entries.length) break; // blank row ends the block
          continue;
        }
        if (!name) continue;
        entries.push({
          place: place || String(entries.length + 1),
          name,
          age: ageCol >= 0 ? norm(drow[ageCol]) : "",
          time: timeCol >= 0 ? norm(drow[timeCol]) : "",
        });
      }
      if (!entries.length) continue;
      // A block with no title of its own is a continuation of the previous
      // event (long events wrap into further PLACE/NAME/AGE/TIME groups).
      if (!title && events.length) {
        events[events.length - 1].entries.push(...entries);
      } else {
        events.push({ title: title || "Results", entries });
      }
    }
  }
  return events;
}

// Accept the two Google Sheets link shapes admins actually paste:
//   published to web:  https://docs.google.com/spreadsheets/d/e/<token>/pubhtml
//   normal share link: https://docs.google.com/spreadsheets/d/<id>/edit?usp=sharing
// Share links are read through the CSV export endpoint. Both shapes stay on
// docs.google.com, so the SSRF guard is no wider than before.
const PUBLISHED_RE = /^https:\/\/docs\.google\.com\/spreadsheets\/d\/e\/[\w-]+\/pub/;
// {20,} so this cannot match the literal "e" segment of a /d/e/<token>/ URL.
const SHARED_RE = /^https:\/\/docs\.google\.com\/spreadsheets\/d\/([\w-]{20,})(?:[/?#]|$)/;

export function isPublishedSheet(url) {
  const u = String(url || "");
  return PUBLISHED_RE.test(u) || SHARED_RE.test(u);
}

export function toCsvUrl(url) {
  const u = String(url);
  if (PUBLISHED_RE.test(u)) {
    return u.replace(/\/pub(html)?(\?.*)?$/, "/pub?output=csv");
  }
  const m = u.match(SHARED_RE);
  if (!m) return u;
  // Keep the tab the link points at, when it names one.
  const gid = u.match(/[#?&]gid=(\d+)/);
  return (
    `https://docs.google.com/spreadsheets/d/${m[1]}/export?format=csv` +
    (gid ? `&gid=${gid[1]}` : "")
  );
}
