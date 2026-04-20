"use client";

import { useEffect, useMemo, useState } from "react";
import { capturePresets } from "@/lib/presets";
import { formatBytes } from "@/lib/utils";

type CaptureChunk = {
  index: number;
  path: string;
  width: number;
  height: number;
  offsetY: number;
  fileSize: number;
  filename: string;
  downloadName: string;
};

type CaptureResult = {
  targetUrl: string;
  presetId: string;
  presetLabel: string;
  totalHeight: number;
  chunkHeight: number;
  chunks: CaptureChunk[];
  outputDir: string;
  titlePrefix: string;
};

const defaultPresetId = capturePresets[0]?.id ?? "";

export function CaptureForm() {
  const [url, setUrl] = useState("");
  const [presetId, setPresetId] = useState(defaultPresetId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CaptureResult | null>(null);

  const activePreset = useMemo(
    () => capturePresets.find((preset) => preset.id === presetId) ?? capturePresets[0],
    [presetId],
  );

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/captures", {
      method: "DELETE",
      signal: controller.signal,
    }).catch(() => {
      // Silent cleanup attempt on fresh load.
    });

    setResult(null);

    return () => controller.abort();
  }, []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, presetId }),
      });

      const payload = (await response.json()) as CaptureResult | { error: string };

      if (!response.ok) {
        throw new Error("error" in payload ? payload.error : "Capture failed.");
      }

      setResult(payload as CaptureResult);
    } catch (captureError) {
      setError(captureError instanceof Error ? captureError.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function downloadChunk(chunk: CaptureChunk) {
    const link = document.createElement("a");
    link.href = chunk.path;
    link.download = chunk.downloadName;
    document.body.append(link);
    link.click();
    link.remove();
  }

  async function downloadAllChunks() {
    if (!result?.chunks.length) return;
    setIsDownloadingAll(true);

    try {
      for (const chunk of result.chunks) {
        downloadChunk(chunk);
        await new Promise((resolve) => window.setTimeout(resolve, 350));
      }
    } finally {
      setIsDownloadingAll(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
      <section className="rounded-[28px] border border-[#c2d696]/18 bg-[#26361e]/84 p-6 shadow-[0_32px_120px_rgba(16,24,12,0.58)] backdrop-blur-xl sm:p-8">
        <div className="space-y-3">
          <span className="inline-flex rounded-full border border-[#b0c97a]/35 bg-[#b0c97a]/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-[#eff9d7]">
            🌿 Website Screenshot Chunk Capture Tool
          </span>
          <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl">
            Website Screenshot Capture Tool
          </h1>
          <div className="max-w-3xl space-y-3 text-sm leading-7 text-[#e0eacf] sm:text-base">
            <p>Capture any website as high-quality, chunked screenshots with custom aspect ratios.</p>
            <p className="font-semibold text-white">✨ This tool allows you to:</p>
            <ul className="space-y-2 text-[#dbe6c9]">
              <li>🧩 Capture full web pages in multiple viewport chunks</li>
              <li>📐 Choose from preset aspect ratios (9:16, 4:5, 1:1, 16:9, 4:3)</li>
              <li>🖼️ Export clean, high-resolution PNG images</li>
              <li>⬇️ Download individual sections or all chunks at once</li>
              <li>🚀 Generate screenshots optimized for social media, presentations, and design review</li>
            </ul>
            <p>💼 Perfect for developers, designers, marketers, and content creators who need structured, high-quality webpage captures.</p>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          <div className="space-y-2">
            <label htmlFor="url" className="text-sm font-semibold text-[#f3f7eb]">
              🔗 Website link
            </label>
            <input
              id="url"
              type="text"
              placeholder="https://example.com"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              className="w-full rounded-2xl border border-[#c2d696]/14 bg-[#182214]/92 px-4 py-4 text-sm text-white outline-none transition focus:border-[#b0c97a]/85 focus:ring-2 focus:ring-[#b0c97a]/20"
              required
            />
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-sm font-semibold text-[#f3f7eb]">📐 Aspect ratio and resolution</p>
              <p className="mt-1 text-xs text-[#c5d1b6]">Pick a chunked format or use Capture Full Page for one clean top-to-bottom screenshot.</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {capturePresets.map((preset) => {
                const selected = preset.id === presetId;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setPresetId(preset.id)}
                    className={[
                      "rounded-3xl border px-4 py-4 text-left transition",
                      selected
                        ? "border-[#d7ecaa]/85 bg-[#b0c97a]/14 shadow-[0_18px_45px_rgba(71,91,43,0.34)]"
                        : "border-[#c2d696]/10 bg-[#182214]/76 hover:border-[#c2d696]/24 hover:bg-[#23301c]/88",
                    ].join(" ")}
                  >
                    <div>
                      <p className="text-base font-bold text-white">✨ {preset.name}</p>
                      {preset.hideLabel ? null : (
                        <p className="mt-1 text-xs font-medium uppercase tracking-[0.24em] text-[#eff9d7]">
                          {preset.label}
                        </p>
                      )}
                    </div>
                    <p className="mt-3 text-sm leading-6 text-[#c5d1b6]">{preset.note}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex min-w-[220px] items-center justify-center rounded-2xl bg-[#b0c97a] px-6 py-4 text-sm font-bold text-[#10150d] transition hover:bg-[#c7dda1] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "⏳ Capturing screenshots..." : "🚀 Submit and capture"}
          </button>

          {error ? <p className="text-sm font-medium text-[#ffb4b4]">⚠️ {error}</p> : null}
        </form>
      </section>

      <section className="rounded-[28px] border border-[#c2d696]/12 bg-[#1b2715]/80 p-6 backdrop-blur-xl sm:p-8">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#c5d1b6]">🪄 Selected output</p>
          <h2 className="text-2xl font-black text-white">{activePreset?.hideLabel ? activePreset?.name : activePreset?.label}</h2>
          <p className="text-sm leading-6 text-[#d2dcc2]">{activePreset?.note}</p>
        </div>

        <div className="mt-6 grid gap-4 rounded-3xl border border-[#c2d696]/10 bg-[#24311d]/84 p-5">
          <div className="flex items-center justify-between text-sm text-[#e0eacf]">
            <span>📏 Capture size</span>
            <span className="font-semibold text-white">
              {activePreset?.hideLabel ? "Auto high-resolution full page" : `${activePreset?.width} × ${activePreset?.height}`}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm text-[#e0eacf]">
            <span>🖼️ Output quality</span>
            <span className="font-semibold text-white">PNG, crisp, lossless</span>
          </div>
          <div className="flex items-center justify-between text-sm text-[#e0eacf]">
            <span>🧩 Capture mode</span>
            <span className="font-semibold text-white">
              {activePreset?.id === "full-page-standard" ? "Single full-page screenshot" : "Full page in stacked chunks"}
            </span>
          </div>
        </div>

        {result ? (
          <div className="mt-6 space-y-5">
            <div className="rounded-3xl border border-[#b0c97a]/20 bg-[#b0c97a]/10 p-5">
              <p className="text-sm font-semibold text-[#f0f8de]">✅ Capture complete</p>
              <p className="mt-2 text-sm leading-6 text-[#f9fdf2]">
                {result.targetUrl} was captured into {result.chunks.length} screenshot{result.chunks.length === 1 ? "" : "s"}.
              </p>
              <p className="mt-2 text-xs text-[#e6f0cf]">🏷️ Naming prefix: {result.titlePrefix}</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={downloadAllChunks}
                disabled={isDownloadingAll}
                className="inline-flex items-center justify-center rounded-2xl bg-[#e0efbb] px-5 py-3 text-sm font-bold text-[#151b11] transition hover:bg-[#edf8d0] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDownloadingAll ? "⏳ Downloading all..." : "⬇️ Download all"}
              </button>
              <a
                href={result.chunks[0]?.path}
                download={result.chunks[0]?.downloadName}
                className="inline-flex items-center justify-center rounded-2xl border border-[#c2d696]/14 bg-[#24311d] px-5 py-3 text-sm font-semibold text-[#f0f8de] transition hover:border-[#c2d696]/30 hover:bg-[#2c3a24]"
              >
                🖼️ Download first screenshot
              </a>
            </div>

            <div className="space-y-3">
              {result.chunks.map((chunk) => (
                <div
                  key={chunk.path}
                  className="rounded-3xl border border-[#c2d696]/10 bg-[#24311d]/82 p-4 transition hover:border-[#b0c97a]/34 hover:bg-[#2c3a24]"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-bold text-white">📄 {chunk.filename}</p>
                      <p className="mt-1 text-xs text-[#c5d1b6]">
                        {chunk.width} × {chunk.height} px, starts at Y {chunk.offsetY}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right text-xs text-[#dce7cb]">
                        <p>{formatBytes(chunk.fileSize)}</p>
                        <p className="mt-1 text-[#eff9d7]">📸 Screenshot {chunk.index}</p>
                      </div>
                      <a
                        href={chunk.path}
                        download={chunk.downloadName}
                        className="inline-flex items-center justify-center rounded-2xl bg-[#b0c97a] px-4 py-2.5 text-xs font-bold text-[#11170f] transition hover:bg-[#c7dda1]"
                      >
                        ⬇️ Download
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-3xl border border-dashed border-[#c2d696]/12 bg-[#202d19]/72 p-6 text-sm leading-7 text-[#d2dcc2]">
            📂 Once you run a capture, your generated screenshot files will show up here with direct download actions.
          </div>
        )}
      </section>
    </div>
  );
}
