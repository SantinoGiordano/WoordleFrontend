"use client";

interface SkipButtonProps {
  onSkip: () => void;
  disabled?: boolean;
}

export default function SkipButton({ onSkip, disabled }: SkipButtonProps) {
  return (
    <button
      onClick={onSkip}
      disabled={disabled}
      className="btn btn-warning px-6"
    >
      Skip
    </button>
  );
}
