# Website Screenshot Chunk Capture Tool

A polished web app for capturing full websites as high-quality screenshots.

This project lets you paste a website URL, choose a capture mode, and generate crisp PNG screenshots either:
- as **chunked captures** in multiple aspect ratios, or
- as a **single full-page screenshot** from top to bottom.

## Features

- Capture full websites from a URL
- Full-page screenshot mode for one clean top-to-bottom image
- Chunked screenshot mode for long pages
- Preset aspect ratios:
  - 9:16
  - 4:5
  - 1:1
  - 16:9
  - 4:3
- High-resolution PNG export
- Professional screenshot file naming based on page title or heading
- Download individual screenshots
- Download all screenshots automatically, one by one
- Olive dark-green UI theme

## Built With

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Playwright

## How It Works

1. Paste a website link
2. Select a capture mode or preset
3. Click **Submit and capture**
4. The app opens the page in Playwright
5. It captures either:
   - one full-page screenshot, or
   - multiple viewport-based chunks
6. Generated PNG files are shown in the UI with download buttons

## Capture Modes

### Capture Full Page
Creates one high-resolution full-page screenshot from top to bottom.

### Chunked Presets
Useful when you want screenshots in specific output shapes for design, social media, reviews, or presentations.

Available presets:
- Vertical Story, 9:16
- Tall Portrait, 4:5
- Square, 1:1
- Landscape HD, 16:9
- Classic Desktop, 4:3

## File Naming

Screenshots are automatically named in a cleaner format like:

```bash
homepage_screenshot_1.png
homepage_screenshot_2.png
```

The filename prefix is generated from:
1. the page `h1`, or
2. the page title, or
3. the domain name

## Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Run the app

```bash
npm run dev
```

Open:

```bash
http://localhost:3000
```

### 3. Production build

```bash
npm run build
npm run start
```

## Notes

- Screenshots are stored under `public/captures/`
- Playwright installs Chromium automatically after install
- On some Linux systems, Playwright may require additional system libraries

## Use Cases

This tool is useful for:
- developers
- designers
- marketers
- content creators
- QA and review workflows

It works especially well when you need structured webpage captures for:
- social media assets
- design reviews
- documentation
- presentations
- visual archiving

## Future Improvements

Some easy next upgrades could be:
- ZIP download for all screenshots
- PDF export
- screenshot progress indicator
- custom filename prefix input
- thumbnail preview grid

## License

MIT
