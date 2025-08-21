"use client";

import { useEffect, useState } from "react";

export default function TimerProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const totalTime = 180; // 3 minutes
    let timeElapsed = 0;

    const interval = setInterval(() => {
      timeElapsed++;
      const percent = Math.min((timeElapsed / totalTime) * 100, 100);
      setProgress(percent);

      if (timeElapsed >= totalTime) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center gap-2 w-full max-w-xs">
      {/* DaisyUI progress bar */}
      <div
        className="radial-progress"
        style={{ ["--value" as any]: progress } as React.CSSProperties}
        aria-valuenow={progress}
        role="progressbar"
      >
        <span className="text-sm font-semibold">{Math.round(progress)}%</span>
      </div>
    </div>
  );
}
