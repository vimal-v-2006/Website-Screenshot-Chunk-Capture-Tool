import { CaptureForm } from "@/components/capture-form";

export default function Home() {
  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[#dfeabf]">🌿 Website Screenshot Chunk Capture Tool</p>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-[#d9e4cb]">
            📸 <span className="font-semibold text-white">Full Page Website Screenshot Chunker</span>
            <br />
            Capture any website as high-quality, chunked screenshots with custom aspect ratios.
          </p>
        </div>
      </div>

      <CaptureForm />
    </main>
  );
}
