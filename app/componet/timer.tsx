"use client";

export default function TimerProgress({ progress }: { progress: number }) {
  return (
    <div className="flex flex-col items-center gap-2 w-full max-w-xs">
      <div
        className="radial-progress"
        style={{ ["--value" as any]: progress } as React.CSSProperties}
        aria-valuenow={progress}
        role="progressbar"
      >
        <span className="text-xs font-semibold">{Math.round(progress)}%</span>
      </div>
    </div>
  );
}
