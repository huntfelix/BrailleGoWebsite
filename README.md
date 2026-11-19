# BrailleGo! website

The website for BrailleGo!, an affordable, open-source Braille printer built by Hunt Robotics for WRO 2026 (Future Innovators).

Live site: https://huntfelix.github.io/BrailleGoWebsite/
Build files and instructions: https://github.com/huntfelix/BrailleGoFiles

## Files

- `index.html` – the home page
- `licence.html` – plain-English summary of the project's licences
- `style.css` – styles, using the Hunt Robotics colours (`#1A0033` purple, `#FF2700` red)
- `script.js` – draws the embossed braille strip and handles missing logos
- `assets/img/` – photos from the project report
- `assets/logos/` – logos
- `404.html` – shown for missing pages

## Publishing

Settings → Pages → Source: "Deploy from a branch", Branch: `main`, folder `/ (root)`.
Every push to `main` updates the live site within a minute or two.

## Licence

This repository holds the website only. The printer itself (hardware, firmware and build guide) is licensed in [BrailleGoFiles](https://github.com/huntfelix/BrailleGoFiles); see `licence.html` for a summary.

| What | Licence |
|------|---------|
| Website code (`*.html`, `style.css`, `script.js`) | [MIT](LICENSE) |
| Website text and project photos in `assets/img/` (except `team.jpg`) | [CC BY-SA 4.0](LICENSES/CC-BY-SA-4.0.txt) |

**Not covered by either licence:** the Hunt Robotics, WRO, STEMpura and RNIB logos in `assets/logos/`, the BrailleGo! and Hunt Robotics names, the quotes in "What people say", and the team photo (`assets/img/team.jpg`). They belong to their respective owners.

Copyright © 2026 Tom Hunt and Felix Hunt (Hunt Robotics).
