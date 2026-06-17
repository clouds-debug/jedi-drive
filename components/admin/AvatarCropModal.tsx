"use client";

import { useEffect, useRef, useState } from "react";
import { useT } from "@/lib/i18n/client";

const BOX = 320;
const OUT = 512;

type Props = {
  file: File;
  onCancel: () => void;
  onConfirm: (blob: Blob) => void | Promise<void>;
};

export function AvatarCropModal({ file, onCancel, onConfirm }: Props) {
  const { t } = useT();
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [scale, setScale] = useState(1);
  const [minScale, setMinScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [busy, setBusy] = useState(false);
  const dragRef = useRef<{ x: number; y: number; px: number; py: number } | null>(null);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setImgUrl(url);
    const im = new Image();
    im.onload = () => {
      const min = Math.max(BOX / im.naturalWidth, BOX / im.naturalHeight);
      setImg(im);
      setMinScale(min);
      setScale(min);
      setPos({ x: 0, y: 0 });
    };
    im.src = url;
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function clampPos(nx: number, ny: number, s: number) {
    if (!img) return { x: nx, y: ny };
    const w = img.naturalWidth * s;
    const h = img.naturalHeight * s;
    const maxX = Math.max(0, (w - BOX) / 2);
    const maxY = Math.max(0, (h - BOX) / 2);
    return {
      x: Math.max(-maxX, Math.min(maxX, nx)),
      y: Math.max(-maxY, Math.min(maxY, ny)),
    };
  }

  function onPointerDown(e: React.PointerEvent) {
    (e.target as Element).setPointerCapture(e.pointerId);
    dragRef.current = { x: e.clientX, y: e.clientY, px: pos.x, py: pos.y };
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.x;
    const dy = e.clientY - dragRef.current.y;
    setPos(clampPos(dragRef.current.px + dx, dragRef.current.py + dy, scale));
  }
  function onPointerUp(e: React.PointerEvent) {
    (e.target as Element).releasePointerCapture(e.pointerId);
    dragRef.current = null;
  }

  function onZoom(v: number) {
    setScale(v);
    setPos((p) => clampPos(p.x, p.y, v));
  }

  async function onSave() {
    if (!img || busy) return;
    setBusy(true);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = OUT;
      canvas.height = OUT;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.imageSmoothingQuality = "high";
      const k = OUT / BOX;
      const srcSize = BOX / scale;
      const srcCx = img.naturalWidth / 2 - pos.x / scale;
      const srcCy = img.naturalHeight / 2 - pos.y / scale;
      const sx = srcCx - srcSize / 2;
      const sy = srcCy - srcSize / 2;
      ctx.drawImage(img, sx, sy, srcSize, srcSize, 0, 0, OUT, OUT);
      void k;
      const mime = file.type === "image/png" ? "image/png" : "image/jpeg";
      const blob: Blob | null = await new Promise((r) =>
        canvas.toBlob((b) => r(b), mime, 0.92),
      );
      if (!blob) return;
      await onConfirm(blob);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label={t("admin.crop.close")}
        onClick={onCancel}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />
      <div className="relative w-full max-w-md bg-navy border border-white/15 rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.5)] p-5">
        <div className="text-[11px] font-mono text-orange tracking-[0.1em] mb-1">
          {t("admin.crop.kicker")}
        </div>
        <h2 className="text-[18px] font-medium text-white mb-1">
          {t("admin.crop.title")}
        </h2>
        <p className="text-[12.5px] text-muted-on-navy mb-4">
          {t("admin.crop.hint")}
        </p>

        <div
          className="relative mx-auto select-none touch-none rounded-full overflow-hidden bg-black/40 border border-white/10"
          style={{ width: BOX, height: BOX, maxWidth: "100%" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {imgUrl && img && (
            <img
              src={imgUrl}
              alt=""
              draggable={false}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: img.naturalWidth * scale,
                height: img.naturalHeight * scale,
                transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px))`,
                pointerEvents: "none",
                userSelect: "none",
                maxWidth: "none",
              }}
            />
          )}
        </div>

        <div className="mt-4 flex items-center gap-3">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-on-navy">
            <circle cx="11" cy="11" r="7" />
            <path d="M8 11h6M11 8v6" />
          </svg>
          <input
            type="range"
            min={minScale}
            max={minScale * 4}
            step={0.001}
            value={scale}
            onChange={(e) => onZoom(Number(e.target.value))}
            className="flex-1 accent-orange"
          />
        </div>

        <div className="mt-5 flex gap-2 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 text-white text-[13px] px-4 py-2 rounded-lg transition-colors"
          >
            {t("admin.crop.cancel")}
          </button>
          <button
            type="button"
            disabled={busy || !img}
            onClick={onSave}
            className="bg-orange hover:bg-[#EA670F] disabled:opacity-50 text-white text-[13px] font-medium px-4 py-2 rounded-lg transition-colors"
          >
            {busy ? t("admin.crop.uploading") : t("admin.crop.save")}
          </button>
        </div>
      </div>
    </div>
  );
}
