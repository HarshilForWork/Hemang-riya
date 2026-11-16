# Collect RSVPs in a Google Sheet (optional)

Out of the box, the RSVP form sends each guest's answers to Hemang on WhatsApp. That works with no setup, but with a few hundred guests a spreadsheet is much easier to tally (headcount, who needs a stay, which nights, who's on which train date).

This takes about five minutes and is free. After it's set up, every RSVP lands as a row in a Google Sheet **and** guests can still send the WhatsApp copy.

## 1. Create the sheet and script

1. Create a new Google Sheet, e.g. "Riya & Hemang RSVPs".
2. In the sheet, open **Extensions → Apps Script**.
3. Delete what's there, paste the script below, and click **Save**.

```js
// Receives RSVPs from the wedding website and adds one row per RSVP.
const COLUMNS = [
  "submittedAt", "name", "phone", "side", "events", "guests",
  "fromMumbai", "when", "ticketHelp", "stay", "nights", "stayCount",
  "dietary", "note", "language", "summary",
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("RSVPs") || ss.insertSheet("RSVPs");
    if (sheet.getLastRow() === 0) sheet.appendRow(COLUMNS);
    const d = JSON.parse(e.postData.contents);
    const row = COLUMNS.map((k) => (Array.isArray(d[k]) ? d[k].join(", ") : d[k] ?? ""));
    sheet.appendRow(row);
    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
```

## 2. Publish it as a web app

1. Click **Deploy → New deployment**.
2. Click the gear next to "Select type" and choose **Web app**.
3. Set **Execute as:** *Me*, and **Who has access:** *Anyone*.
4. Click **Deploy**, approve the permissions, and copy the **Web app URL** (it ends in `/exec`).

## 3. Connect the website

In `app.js`, find this line near the top and paste the URL between the quotes:

```js
const RSVP_ENDPOINT = "";
```

Commit and push; Vercel redeploys automatically. New RSVPs will now appear in the "RSVPs" tab of the sheet.

## What each column means

| Column | Meaning |
|---|---|
| side | `riya` or `hemang` |
| events | `sangeet`, `wedding`, or `none` (can't make it) |
| guests | people coming, including the person who filled the form |
| fromMumbai | `yes` / `no` (only asked if attending the wedding) |
| when | `26` (travelling 26 Jan), `27` (reaching 27 Jan) or `unsure` |
| ticketHelp | wants help booking tickets: `yes` / `no` |
| stay | needs accommodation in Nadiad: `yes` / `no` |
| nights | `26`, `27` or both |
| stayCount | how many people need a stay |
| summary | the same text the guest can send on WhatsApp |

If a guest submits twice (for example after editing their answers), you'll see two rows — use the latest one by `submittedAt`.
