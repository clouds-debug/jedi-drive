"use client";

import type { ButtonHTMLAttributes } from "react";

export function SubmitButton({
  pending,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { pending: boolean }) {
  return (
    <button
      {...rest}
      type="submit"
      disabled={pending || rest.disabled}
      className="w-full bg-orange hover:bg-orange/90 disabled:bg-orange/50 disabled:cursor-not-allowed text-white font-medium text-[14px] tracking-[0.01em] rounded-lg px-4 py-2.5 transition-colors flex items-center justify-center gap-2"
    >
      {pending && (
        <span
          className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin"
          aria-hidden
        />
      )}
      {children}
    </button>
  );
}
