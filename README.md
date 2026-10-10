# Pune Has a Secret Mode

The complete ChargeKr campaign website, ready for GitHub Pages. Plain HTML, CSS, and JavaScript; no install, build, server, database, or API key is required.

## Publish on GitHub Pages

1. Extract `chargekr-pune-secret-mode-source.zip`.
2. Create a GitHub repository, for example `pune-secret-mode`. A public repository supports GitHub Pages on GitHub Free.
3. Upload the **contents** of the extracted folder to the repository's `main` branch. `index.html` must be at the repository root, not inside another folder. Include `.nojekyll` if using Git.
4. Open the repository's **Settings → Pages**.
5. Under **Build and deployment**, select **Deploy from a branch**.
6. Select **main** and **/(root)**, then click **Save**.
7. Once deployment finishes, use the published address shown under Pages. For the example repository, it is normally `https://YOUR_USERNAME.github.io/pune-secret-mode/`.

Pushing future updates to `main` republishes the website. Asset paths are relative, so it also works under a repository subpath. The share button automatically uses the current page URL.

GitHub's instructions: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

### Optional: upload with Git

Run these commands from the extracted folder. Replace `YOUR_USERNAME` and the repository name with your own values. Create an empty repository first, without adding a README or license on GitHub.

```sh
git init -b main
git add .
git commit -m "Add Pune Secret Mode campaign"
git remote add origin https://github.com/YOUR_USERNAME/pune-secret-mode.git
git push -u origin main
```

Then enable Pages using steps 4–7 above.

## Run locally

Open `index.html` in your browser to try the game, or run a local static server from this folder:

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000`. Native sharing and clipboard availability depend on the browser and secure context; a selectable link is provided as a fallback.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | First screen, puzzle interface, ChargeKr reveal, and links |
| `style.css` | Responsive layout, colours, typography, and animation |
| `app.js` | Game flow, interactions, reveal, sound, and sharing |
| `engine.js` | Two introductory levels and endless puzzle generator |
| `chargekr-logo.png` | Original supplied ChargeKr logo |
| `signal-bold.ttf` | Bundled DejaVu Sans Condensed Bold font |
| `.nojekyll` | Serves these static files without Jekyll processing |
| `tests/game.test.cjs` | Puzzle and UI flow checks; no test dependencies |
| `licenses/DejaVu-font-license.txt` | Copyright and license notices for the bundled font |

## Experience

- First screen: **Follow the signal.**
- Level 1: Shaniwar Wada, 3×3 grid.
- Level 2: Aga Khan Palace, 4×4 grid.
- Completing level 2 automatically reveals ChargeKr with the supplied logo.
- **Continue playing** starts level 3 and keeps generating 4×4 and 5×5 puzzles with Pune neighbourhood names. There is no final content level.
- Includes hints, reset, optional sound, reduced-motion support, replay, and spoiler-free sharing.

There is no account system, analytics, leaderboard, or saved progress. Progress resets when the page reloads. Endless puzzles are generated locally; routes can recur over many plays. The game represents an imagined network, not actual charger locations or availability.

## Tests

With Node.js installed, run from this folder:

```sh
node tests/game.test.cjs
```

Checks cover 1,040 solvable puzzles, high level numbers, required relays, automatic reveal after exactly two levels, endless progression, reset, pause/resume, replay, and sharing from a GitHub Pages-style subpath. UI checks use a minimal DOM; they are not a real browser or device test.

## Editing

- Update campaign copy and the ChargeKr destination links in `index.html`.
- Update colours and spacing in `style.css`.
- Change introductory puzzles and neighbourhood names in `engine.js`.
- Adjust reveal timing and sharing copy in `app.js`.
- Replace `chargekr-logo.png` with your logo if needed, preserving its aspect ratio.
- After changing JavaScript or CSS, bump the `?v=pune-1` query strings in `index.html` to encourage browsers to load the new files.

## Poster QR

The existing poster QR opens:

https://touch-tomorrow.briny-harp-4308.chatgpt.site

Publishing this code on GitHub does not change that QR. Once your GitHub Pages URL is live, use it to generate a new QR for posters that should open your GitHub-hosted copy. The poster artwork is a separate deliverable and is not required by this website.

## Export

Runtime files match the published Pune campaign source at commit `05fb69cf030a6e04671c7b5253b608c21f686a69`. Only the export folder layout, documentation, test paths, and hosting support files were adjusted. Hosting credentials, deployment metadata, and repository history are not included.

The bundled font's notices are in `licenses/DejaVu-font-license.txt`.
# chargekr-marketing
