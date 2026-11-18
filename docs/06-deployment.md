# 06 · Deployment

## GitHub

- Repo: `HarshilForWork/Hemang-riya`, branch `main`.
- Remote uses Hemang's personal SSH key through the `github-personal` host alias (defined in `~/.ssh/config` on his Mac):
  ```bash
  git remote -v   # origin  git@github-personal:HarshilForWork/Hemang-riya.git
  ```
- **Commit identity:** this repo's local git config is set to Hemang's personal GitHub identity (the global git config on that Mac is his work identity, which must not be used here). Check before committing:
  ```bash
  git config user.name    # HarshilForwork
  ```
- Commit messages end with a `Co-Authored-By:` line when written with Claude.

## Vercel

- Project imported from the GitHub repo; framework preset **Other**, no build command, output directory = repo root.
- Every push to `main` deploys automatically (usually within seconds). Live URL: https://hemang-riya.vercel.app
- `.vercelignore` keeps `docs/`, `tools/`, and Markdown files out of the deployment.
- `vercel.json`: assets cached for a day (`stale-while-revalidate` a week), `X-Robots-Tag: noindex, nofollow`, `nosniff`, referrer policy, clean URLs.

## Sibling sites (same setup)

| Site | Folder | Repo | Vercel |
|---|---|---|---|
| Short invite | `lite-site/` | `git@github-personal:HarshilForWork/riya-hemang-invite.git` (private) | https://riya-hemang-invite.vercel.app (imported by Hemang on 18 Nov 2026; auto-deploys on push) |
| Sangeet-only | `sangeet-site/` | `git@github-personal:HarshilForWork/Hemang-riya-sangeet.git` (public) | not imported yet: Vercel → Add New → Project → import the repo, preset **Other**, no build command |

Each repo's local git config uses the same personal identity (`HarshilForwork`). Each has its own `?v=N` counter, so bump it in that site's `index.html`.

## GitHub CLI accounts on Hemang's Mac

`gh` is signed in to two accounts: **HarshilForWork** (personal, owns all three repos; active since 18 Nov 2026) and **harshilbhanushali-rgb** (work). Pushing uses the `github-personal` SSH alias either way, but creating repos with `gh repo create` needs HarshilForWork active:
```bash
gh auth status                                   # which account is active
gh auth switch --user HarshilForWork            # personal (wedding repos)
gh auth switch --user harshilbhanushali-rgb     # back to work
```
There is no Vercel CLI on that Mac; Vercel projects are imported in the browser by Hemang.

## Releasing a change

1. Edit, then bump `?v=N` for `styles.css` / `app.js` in `index.html` if either changed.
2. Test (docs/05) at phone, tablet and desktop sizes.
3. Commit and push to `main`.
4. Confirm the live site serves the new version, e.g.:
   ```bash
   curl -s https://hemang-riya.vercel.app/ | grep -o 'app.js?v=[0-9]*'
   ```
5. Optionally run the harness against the live URL.

## Google Sheet for RSVPs (superseded)

RSVPs now go to the couple's own Google Form (`RSVP_FORM_URL` in app.js), so this is no longer needed. Kept for reference. Decided at the time: do it in Hemang's **personal Gmail** (his work Google account may not allow public Apps Script web apps, and guest data shouldn't live there). Steps are in docs/rsvp-google-sheet.md; once he has the `/exec` URL, set `RSVP_ENDPOINT` in app.js, bump `?v`, test, push. A sheet created earlier in the work Drive was moved to trash.
