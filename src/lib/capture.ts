import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import { presetMap } from "@/lib/presets";
import { sanitizeFileStem, slugify } from "@/lib/utils";

const outputRoot = path.join(process.cwd(), "public", "captures");

export type CaptureRequest = {
  url: string;
  presetId: string;
};

export type CaptureChunk = {
  index: number;
  path: string;
  width: number;
  height: number;
  offsetY: number;
  fileSize: number;
  filename: string;
  downloadName: string;
};

export type CaptureResult = {
  targetUrl: string;
  presetId: string;
  presetLabel: string;
  totalHeight: number;
  chunkHeight: number;
  chunks: CaptureChunk[];
  outputDir: string;
  titlePrefix: string;
};

export async function captureWebsite({ url, presetId }: CaptureRequest): Promise<CaptureResult> {
  const preset = presetMap[presetId];

  if (!preset) {
    throw new Error("Unknown capture preset.");
  }

  await fs.mkdir(outputRoot, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: preset.width, height: preset.height },
    deviceScaleFactor: preset.deviceScaleFactor ?? 1,
  });

  const page = await context.newPage();

  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 120000 });
    await page.evaluate(() => {
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    });
    await page.waitForTimeout(700);

    const pageMeta = await page.evaluate(() => {
      const title = document.title?.trim() || "";
      const h1 = document.querySelector("h1")?.textContent?.trim() || "";
      const body = document.body;
      const html = document.documentElement;
      const totalHeight = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight,
      );
      return { title, h1, totalHeight };
    });

    const titlePrefix = sanitizeFileStem(pageMeta.h1 || pageMeta.title || new URL(url).hostname);
    const totalHeight = pageMeta.totalHeight;

    const runId = `${Date.now()}-${slugify(new URL(url).hostname)}`;
    const relativeOutputDir = path.posix.join("captures", runId);
    const absoluteOutputDir = path.join(outputRoot, runId);
    await fs.mkdir(absoluteOutputDir, { recursive: true });

    const chunks: CaptureChunk[] = [];
    const chunkHeight = preset.height;

    if (preset.captureMode === "full-page") {
      const filename = `${titlePrefix}_screenshot_1.png`;
      const absoluteFilePath = path.join(absoluteOutputDir, filename);
      const relativeFilePath = path.posix.join("/", relativeOutputDir, filename);

      await page.screenshot({
        path: absoluteFilePath,
        type: "png",
        fullPage: true,
      });

      const stat = await fs.stat(absoluteFilePath);

      chunks.push({
        index: 1,
        path: relativeFilePath,
        width: preset.width * (preset.deviceScaleFactor ?? 1),
        height: totalHeight * (preset.deviceScaleFactor ?? 1),
        offsetY: 0,
        fileSize: stat.size,
        filename,
        downloadName: filename,
      });
    } else {
      const maxScrollTop = Math.max(totalHeight - chunkHeight, 0);
      const scrollStops = new Set<number>();

      for (let offsetY = 0; offsetY <= maxScrollTop; offsetY += chunkHeight) {
        scrollStops.add(offsetY);
      }
      scrollStops.add(maxScrollTop);

      const orderedStops = [...scrollStops].sort((a, b) => a - b);

      for (const [index, offsetY] of orderedStops.entries()) {
        await page.evaluate((scrollY) => {
          window.scrollTo({ top: scrollY, behavior: "instant" as ScrollBehavior });
        }, offsetY);
        await page.waitForTimeout(350);

        const clipHeight = Math.min(chunkHeight, Math.max(totalHeight - offsetY, 1));
        const sequence = index + 1;
        const filename = `${titlePrefix}_screenshot_${sequence}.png`;
        const absoluteFilePath = path.join(absoluteOutputDir, filename);
        const relativeFilePath = path.posix.join("/", relativeOutputDir, filename);

        await page.screenshot({
          path: absoluteFilePath,
          type: "png",
          clip: {
            x: 0,
            y: 0,
            width: preset.width,
            height: clipHeight,
          },
        });

        const stat = await fs.stat(absoluteFilePath);

        chunks.push({
          index: sequence,
          path: relativeFilePath,
          width: preset.width,
          height: clipHeight,
          offsetY,
          fileSize: stat.size,
          filename,
          downloadName: filename,
        });
      }
    }

    return {
      targetUrl: url,
      presetId: preset.id,
      presetLabel: preset.label,
      totalHeight,
      chunkHeight,
      chunks,
      outputDir: `/${relativeOutputDir}`,
      titlePrefix,
    };
  } finally {
    await context.close();
    await browser.close();
  }
}
