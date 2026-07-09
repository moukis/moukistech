import { useState, useRef, useCallback, useEffect } from "react";
import { MoveHorizontal } from "lucide-react";

export function BeforeAfterSlider({ before, after, beforeLabel, afterLabel, caption, hint }) {
  const [pos, setPos] = useState(50);
  const [dragging, setDragging] = useState(false);
  const ref = useRef(null);

  const setFromClientX = useCallback((clientX) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, pct)));
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const move = (e) => setFromClientX(e.touches ? e.touches[0].clientX : e.clientX);
    const up = () => setDragging(false);
    window.addEventListener("mousemove", move);
    window.addEventListener("touchmove", move);
    window.addEventListener("mouseup", up);
    window.addEventListener("touchend", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchend", up);
    };
  }, [dragging, setFromClientX]);

  return (
    <div className="group">
      <div
        ref={ref}
        data-testid="before-after-slider"
        className="relative h-72 sm:h-80 w-full overflow-hidden rounded-2xl border border-white/10 cursor-ew-resize select-none"
        onMouseDown={(e) => { setDragging(true); setFromClientX(e.clientX); }}
        onTouchStart={(e) => { setDragging(true); setFromClientX(e.touches[0].clientX); }}
      >
        {/* After (base) */}
        <img src={after} alt={afterLabel} draggable={false} className="absolute inset-0 h-full w-full object-cover" />
        <span className="absolute top-3 right-3 z-10 rounded-full bg-[#0055FF] px-3 py-1 font-mono-tech text-[10px] uppercase tracking-wider text-white">{afterLabel}</span>

        {/* Before (clipped) */}
        <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
          <img src={before} alt={beforeLabel} draggable={false} className="absolute inset-0 h-full w-full object-cover" style={{ width: ref.current?.offsetWidth || "100%", maxWidth: "none" }} />
          <span className="absolute top-3 left-3 z-10 rounded-full bg-black/70 px-3 py-1 font-mono-tech text-[10px] uppercase tracking-wider text-white">{beforeLabel}</span>
        </div>

        {/* Handle */}
        <div className="absolute inset-y-0 z-20" style={{ left: `${pos}%`, transform: "translateX(-50%)" }}>
          <div className="h-full w-0.5 bg-[#00E5FF]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-[#00E5FF] grid place-items-center text-black shadow-lg">
            <MoveHorizontal size={18} />
          </div>
        </div>

        {hint && <span className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 font-mono-tech text-[10px] uppercase tracking-wider text-white/60 opacity-100 group-hover:opacity-0 transition-opacity">{hint}</span>}
      </div>
      {caption && <p className="mt-3 font-mono-tech text-xs uppercase tracking-[0.2em] text-white/50">{caption}</p>}
    </div>
  );
}
