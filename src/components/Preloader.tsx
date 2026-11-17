"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Loading screen: a dark, full-screen headline reel. One giant word per beat
 * (the HR pipeline), a real progress counter that waits for fonts and assets,
 * a red flash at 100%, then the screen lifts away. The hero entrance in
 * Motion.tsx waits for the "preloader:start-hero" event.
 */

const MIN_MS = 1900; // long enough to read the reel
const WORDS = ["Screen.", "Interview.", "Hire.", "Onboard.", "Keep."];
const COLORS = ["#f1eadb", "#ffe600", "#f1eadb", "#ffe600", "#e4202b"];

export default function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const underRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLParagraphElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const under = underRef.current;
    if (!root || !under) return;
    const html = document.documentElement;

    // While loading, keep the page pinned to the top (the scrollbar stays visible, so no layout jump).
    // "instant" matters: the page has smooth scrolling, which would otherwise let it drift while pinned.
    const pin = () => window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    const hide = () => {
      window.removeEventListener("scroll", pin);
      root.style.display = "none";
      under.style.display = "none";
      html.classList.remove("is-loading");
    };

    // Reduced motion (or animation gate off): no loader at all.
    if (!html.classList.contains("js-anim")) {
      hide();
      window.dispatchEvent(new Event("preloader:start-hero"));
      return;
    }

    window.addEventListener("scroll", pin, { passive: true });

    // React (dev / StrictMode) mounts effects twice. Anything async below must stop when this
    // run is cleaned up, otherwise two copies fight over the same DOM and the words flicker.
    let cancelled = false;

    const ctx = gsap.context(() => {
      const o = { p: 0 };
      let wordIdx = -1;
      let finished = false;

      // Words hard-cut with a small scale "pop". Opacity never drops, so nothing blinks.
      const showWord = (i: number, pop = true) => {
        const el = wordRef.current;
        if (!el) return;
        el.textContent = WORDS[i];
        el.style.color = COLORS[i];
        if (!pop) return;
        gsap.fromTo(
          el,
          { scale: 1.12, yPercent: 6 },
          { scale: 1, yPercent: 0, duration: 0.2, ease: "power4.out", overwrite: true }
        );
      };

      // The server-rendered first word stays hidden until the real font is ready, then appears
      // in place (no fallback-font flash, no fade-out/fade-in blink).
      const revealFirst = () => {
        if (wordRef.current) wordRef.current.style.visibility = "visible";
      };
      Promise.race([
        document.fonts?.ready ?? Promise.resolve(),
        new Promise<void>((res) => setTimeout(res, 800)),
      ]).then(() => {
        if (!cancelled) requestAnimationFrame(revealFirst);
      });

      const render = () => {
        if (countRef.current) countRef.current.textContent = String(Math.round(o.p));
        if (barRef.current) barRef.current.style.transform = `scaleX(${o.p / 100})`;
        const idx = Math.min(WORDS.length - 1, Math.floor(o.p / 20));
        if (idx !== wordIdx) {
          const first = wordIdx === -1;
          wordIdx = idx;
          showWord(idx, !first);
        }
      };

      render();
      gsap.to(o, { p: 88, duration: 1.8, ease: "none", onUpdate: render });

      const loaded = new Promise<void>((res) => {
        if (document.readyState === "complete") res();
        else window.addEventListener("load", () => res(), { once: true });
      });
      const fonts = document.fonts?.ready ?? Promise.resolve();
      const minTime = new Promise<void>((res) => setTimeout(res, MIN_MS));
      const cap = new Promise<void>((res) => setTimeout(res, 6000)); // never hang on a slow asset

      Promise.race([Promise.all([loaded, fonts, minTime]), cap]).then(() => {
        if (cancelled || finished) return;
        finished = true;
        gsap.killTweensOf(o);
        gsap.to(o, {
          p: 100,
          duration: 0.4,
          ease: "power2.out",
          onUpdate: render,
          onComplete: () => {
            const tl = gsap.timeline({ onComplete: hide });
            // punch: flip to red, hold, then lift both curtains and release the hero
            tl.to(root, { backgroundColor: "#e4202b", duration: 0.12, ease: "none" })
              .to(wordRef.current, { color: "#141414", duration: 0.12, ease: "none" }, "<")
              .to({}, { duration: 0.4 })
              .to(root, { yPercent: -100, duration: 0.9, ease: "power4.inOut" }, "lift")
              .to(under, { yPercent: -100, duration: 0.9, ease: "power4.inOut" }, "lift+=0.1")
              .call(() => window.dispatchEvent(new Event("preloader:start-hero")), [], "lift+=0.45");
          },
        });
      });
    });

    return () => {
      cancelled = true;
      window.removeEventListener("scroll", pin);
      ctx.revert();
    };
  }, []);

  return (
    <>
      {/* paper-coloured curtain sits behind and lifts a beat later */}
      <div ref={underRef} data-preloader-under aria-hidden className="preloader-curtain bg-paper" />
      <div
        ref={rootRef}
        data-preloader
        role="status"
        aria-live="polite"
        aria-label="Loading the portfolio"
        className="preloader-curtain flex-col justify-between bg-ink text-paper"
      >
        <div className="flex items-start justify-between gap-4 p-5 sm:p-8">
          <p className="font-display whitespace-nowrap text-2xl leading-none tracking-wide sm:text-3xl">
            M.I. PRANTO
          </p>
          <p className="font-hand text-sm text-paper/60 sm:text-base">HR Generalist</p>
        </div>

        <div className="grid flex-1 place-items-center overflow-hidden px-2" aria-hidden>
          <p
            ref={wordRef}
            className="font-display select-none whitespace-nowrap text-center text-[clamp(3.6rem,22vw,19rem)] uppercase leading-[0.85]"
            style={{ color: COLORS[0], visibility: "hidden" }}
          >
            {WORDS[0]}
          </p>
        </div>

        <div className="p-5 sm:p-8">
          <div className="mb-3 flex items-end justify-between">
            <p className="font-hand text-base text-paper/60 sm:text-lg">loading the rulebook…</p>
            <p className="font-display text-5xl leading-none sm:text-7xl">
              <span ref={countRef}>0</span>
              <span className="text-marker">%</span>
            </p>
          </div>
          <div className="h-2 w-full bg-paper/15">
            <span ref={barRef} className="block h-full origin-left scale-x-0 bg-marker" />
          </div>
        </div>
      </div>
    </>
  );
}
