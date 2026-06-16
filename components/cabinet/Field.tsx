"use client";

import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  hint?: string;
};

export function Field({ label, error, hint, id, ...rest }: Props) {
  return (
    <label htmlFor={id} className="block mb-4 last:mb-0">
      <span className="block text-[12px] text-muted-on-navy tracking-[0.04em] mb-1.5">
        {label}
      </span>
      <input
        id={id}
        {...rest}
        className={`w-full bg-white/[0.04] border ${
          error ? "border-orange/60" : "border-white/12"
        } rounded-lg px-3.5 py-2.5 text-[14px] text-white placeholder:text-muted-on-navy/60 focus:outline-none focus:border-orange/70 focus:bg-white/[0.06] transition-colors`}
      />
      {hint && !error && (
        <span className="block mt-1.5 text-[11.5px] text-muted-on-navy">{hint}</span>
      )}
      {error && (
        <span className="block mt-1.5 text-[11.5px] text-orange-soft">{error}</span>
      )}
    </label>
  );
}
