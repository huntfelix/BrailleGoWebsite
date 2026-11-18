# BrailleGo! website

The website for BrailleGo!, an affordable, open-source Braille printer built by Hunt Robotics for WRO 2026 (Future Innovators).

Live site: https://huntfelix.github.io/BrailleGoWebsite/
Build files and instructions: https://github.com/huntfelix/BrailleGoFiles

## Files

- `index.html` – the page
- `style.css` – styles, using the Hunt Robotics colours (`#1A0033` purple, `#FF2700` red)
- `script.js` – draws the embossed braille strip and handles missing logos
- `assets/img/` – photos from the project report
- `assets/logos/` – logos
- `404.html` – shown for missing pages

## Adding the partner logos

Upload these files to `assets/logos/` (PNG with a transparent background works best):

| File name       | Logo                 |
|-----------------|----------------------|
| `wro.png`       | World Robot Olympiad |
| `stempura.png`  | Stempura             |
| `rnib.png`      | RNIB                 |

Until a file is there, the site shows the organisation's name in its place, so nothing looks broken.

## Publishing

Settings → Pages → Source: "Deploy from a branch", Branch: `main`, folder `/ (root)`.
Every push to `main` updates the live site within a minute or two.
