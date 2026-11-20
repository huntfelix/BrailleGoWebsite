# BrailleGo! website

The website for BrailleGo!, an affordable, open-source Braille printer built by Hunt Robotics for WRO 2026 (Future Innovators).

Live site: https://huntfelix.github.io/BrailleGoWebsite/
Build files and instructions: https://github.com/huntfelix/BrailleGoFiles

## Files

- `index.html` – the home page
- `licence.html` – plain-English summary of the project's licences
- `stories.html` – contributor stories page (stories come from `stories.json`)
- `stories.json` – the published contributor stories
- `style.css` – styles, using the Hunt Robotics colours (`#1A0033` purple, `#FF2700` red)
- `script.js` – the animated Braille title, the Braille translator, the photo reel, and the stories list
- `assets/img/` – photos from the project report
- `assets/logos/` – logos
- `assets/stories/` – photos for contributor stories

## Publishing a contributor story

Contributors can't post directly. They send a build report by email (the "Submit a build report" button on the Stories page emails both of us with a template). To publish one you've approved:

1. Make sure they said **yes** to publishing in their email.
2. Resize their photos to about 1200 px wide and upload them to `assets/stories/`, for example `assets/stories/2026-12-school-library-1.jpg`.
3. Add an entry to `stories.json`. Stories are shown newest first, by `date`.

```json
[
  {
    "title": "A BrailleGo! for our school library",
    "date": "2026-12-01",
    "author": "Sam Taylor",
    "location": "Bristol, UK",
    "tags": ["Build", "Firmware"],
    "body": [
      "First paragraph of the story.",
      "Second paragraph."
    ],
    "photos": [
      { "src": "assets/stories/2026-12-school-library-1.jpg", "alt": "Describe what the photo shows" }
    ],
    "link": "https://github.com/someone/their-fork",
    "linkText": "See their build log"
  }
]
```

`tags`, `photos`, `link` and `linkText` are optional, and up to four photos are shown. Separate stories with a comma. Check the file is valid JSON (for example at jsonlint.com) before committing, or the page will show "No stories yet".

## Publishing

Settings → Pages → Source: "Deploy from a branch", Branch: `main`, folder `/ (root)`.
Every push to `main` updates the live site within a minute or two.

## Licence

This repository holds the website only. The printer itself (hardware, firmware and build guide) is licensed in [BrailleGoFiles](https://github.com/huntfelix/BrailleGoFiles); see `licence.html` for a summary.

| What | Licence |
|------|---------|
| Website code (`*.html`, `style.css`, `script.js`) | [MIT](LICENSE) |
| Website text and project photos in `assets/img/` (except `team.jpg`) | [CC BY-SA 4.0](LICENSES/CC-BY-SA-4.0.txt) |

**Not covered by either licence:** the Hunt Robotics, WRO, STEMpura and RNIB logos in `assets/logos/`, the BrailleGo! and Hunt Robotics names, the quotes in "What people say", the team photo (`assets/img/team.jpg`), and the posters in `assets/img/posters/`. They belong to their respective owners.

Copyright © 2026 Tom Hunt and Felix Hunt (Hunt Robotics).
