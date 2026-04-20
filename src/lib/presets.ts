export type CapturePreset = {
  id: string;
  name: string;
  width: number;
  height: number;
  label: string;
  note: string;
  captureMode?: "chunked" | "full-page";
  hideLabel?: boolean;
  deviceScaleFactor?: number;
};

export const capturePresets: CapturePreset[] = [
  {
    id: "full-page-standard",
    name: "Capture Full Page",
    width: 2000,
    height: 1400,
    label: "Standard Full Page",
    note: "Captures the full website from top to bottom in a cleaner, crisper high-resolution format.",
    captureMode: "full-page",
    hideLabel: true,
    deviceScaleFactor: 2,
  },
  {
    id: "story-1080x1920",
    name: "Vertical Story",
    width: 1080,
    height: 1920,
    label: "9:16 · 1080 × 1920",
    note: "Perfect for stories, reels, and shorts cover previews.",
    captureMode: "chunked",
    deviceScaleFactor: 1,
  },
  {
    id: "portrait-1440x1800",
    name: "Tall Portrait",
    width: 1440,
    height: 1800,
    label: "4:5 · 1440 × 1800",
    note: "Clean high-resolution portrait crop for social posts.",
    captureMode: "chunked",
    deviceScaleFactor: 1,
  },
  {
    id: "square-1600x1600",
    name: "Square",
    width: 1600,
    height: 1600,
    label: "1:1 · 1600 × 1600",
    note: "Balanced square export with strong clarity.",
    captureMode: "chunked",
    deviceScaleFactor: 1,
  },
  {
    id: "landscape-1920x1080",
    name: "Landscape HD",
    width: 1920,
    height: 1080,
    label: "16:9 · 1920 × 1080",
    note: "Nice for presentations, hero sections, and desktop previews.",
    captureMode: "chunked",
    deviceScaleFactor: 1,
  },
  {
    id: "desktop-1600x1200",
    name: "Classic Desktop",
    width: 1600,
    height: 1200,
    label: "4:3 · 1600 × 1200",
    note: "Solid standard capture for docs and design reviews.",
    captureMode: "chunked",
    deviceScaleFactor: 1,
  },
];

export const presetMap = Object.fromEntries(capturePresets.map((preset) => [preset.id, preset]));
