"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * All page animation lives here (GSAP + ScrollTrigger). The page markup only
 * carries data attributes; the layout script adds `js-anim` (never when the
 * visitor prefers reduced motion), so without JS everything stays visible.
 */
export default function Motion() {
  // In-page links (#about, #top, ...) scroll smoothly but never put a hash in the address bar.
  useEffect(() => {
    if (window.location.hash) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const id = decodeURIComponent(a.getAttribute("href")!.slice(1));
      const behavior: ScrollBehavior = reduce.matches ? "auto" : "smooth";
      if (!id || id === "top") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior });
        return;
      }
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior, block: "start" });
      // keep keyboard / screen-reader focus in step with the scroll, without scrolling again
      el.setAttribute("tabindex", "-1");
      el.focus({ preventScroll: true });
    };
    document.addEventListener("click", onClick);

    // Publish the live header height as --hdr so the first screen (hero + ticker) is exactly 100dvh.
    const header = document.querySelector("header");
    const setHdr = () => {
      if (header) document.documentElement.style.setProperty("--hdr", `${header.offsetHeight}px`);
    };
    setHdr();
    const ro = new ResizeObserver(setHdr);
    if (header) ro.observe(header);

    return () => {
      document.removeEventListener("click", onClick);
      ro.disconnect();
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const q = gsap.utils.toArray as <T extends Element>(s: string) => T[];
    const cleanups: (() => void)[] = [];

    const ctx = gsap.context(() => {
      /* ---------- hero entrance ---------- */
      // While the loading screen is up, hold the hero entrance until it lifts.
      const waiting =
        !!document.querySelector("[data-preloader]") &&
        document.documentElement.classList.contains("is-loading");
      const tl = gsap.timeline({ defaults: { ease: "power4.out" }, paused: waiting });
      if (waiting) {
        const go = () => tl.play();
        window.addEventListener("preloader:start-hero", go, { once: true });
        const fallback = window.setTimeout(go, 9500);
        cleanups.push(() => {
          window.removeEventListener("preloader:start-hero", go);
          window.clearTimeout(fallback);
        });
      }
      tl.fromTo("[data-mast]", { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.6 }, 0)
        .fromTo(
          "[data-hero-line]",
          { yPercent: 115, opacity: 1 },
          { yPercent: 0, opacity: 1, duration: 1, stagger: 0.13 },
          0.15
        )
        .fromTo(
          "[data-stamp]",
          { opacity: 0, scale: 3.2, rotation: -34 },
          { opacity: 1, scale: 1, rotation: -9, duration: 0.55, ease: "back.out(1.8)" },
          0.95
        )
        .fromTo(
          "[data-shake]",
          { y: 0 },
          { y: 5, duration: 0.05, repeat: 5, yoyo: true, ease: "none" },
          1.0
        )
        .fromTo(
          "[data-hero] [data-draw]",
          { strokeDashoffset: 1 },
          { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut", stagger: 0.25 },
          1.1
        )
        .fromTo(
          "[data-hero-in]",
          { opacity: 0, y: 36 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 },
          0.7
        )
        .fromTo(
          "[data-cut]",
          { opacity: 0, xPercent: 18, rotation: 5 },
          { opacity: 1, xPercent: 0, rotation: 0, duration: 1.1, ease: "expo.out" },
          0.35
        );

      /* ---------- headlines: line-mask reveal ---------- */
      q<HTMLElement>("[data-h]").forEach((h) => {
        gsap.fromTo(
          h.querySelectorAll("[data-line]"),
          { yPercent: 115, opacity: 1 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power4.out",
            stagger: 0.1,
            scrollTrigger: { trigger: h, start: "top 85%", once: true },
          }
        );
      });

      /* ---------- marker strokes draw themselves ---------- */
      q<SVGPathElement>("[data-draw]").forEach((p) => {
        if (p.closest("[data-hero]")) return;
        gsap.fromTo(
          p,
          { strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            duration: 0.9,
            ease: "power2.inOut",
            scrollTrigger: { trigger: p, start: "top 90%", once: true },
          }
        );
      });

      /* ---------- things "pasted" onto the page ---------- */
      ScrollTrigger.batch("[data-paste]", {
        start: "top 90%",
        once: true,
        onEnter: (els) =>
          gsap.fromTo(
            els,
            { opacity: 0, scale: 1.25, rotation: (i: number) => (i % 2 ? 6 : -6) },
            {
              opacity: 1,
              scale: 1,
              rotation: 0,
              duration: 0.55,
              ease: "back.out(1.6)",
              stagger: 0.09,
            }
          ),
      });

      /* ---------- experience rows ---------- */
      gsap.set("[data-rule]", { scaleX: 0, transformOrigin: "left center" });
      q<HTMLElement>("[data-row]").forEach((row) => {
        const rule = row.querySelector("[data-rule]");
        const tlr = gsap.timeline({
          scrollTrigger: { trigger: row, start: "top 85%", once: true },
        });
        if (rule) tlr.to(rule, { scaleX: 1, duration: 0.8, ease: "power3.inOut" });
        tlr.fromTo(
          row.querySelectorAll("[data-row-in]"),
          { opacity: 0, x: -50 },
          { opacity: 1, x: 0, duration: 0.7, ease: "power3.out", stagger: 0.1 },
          0.15
        );
      });

      /* ---------- counters ---------- */
      q<HTMLElement>("[data-count]").forEach((el) => {
        const target = parseFloat(el.dataset.count || "0");
        const suffix = el.dataset.suffix || "";
        const o = { v: 0 };
        el.textContent = "0" + suffix;
        gsap.to(o, {
          v: target,
          duration: 1.8,
          ease: "power2.out",
          onUpdate: () => (el.textContent = Math.round(o.v) + suffix),
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      });

      /* ---------- ticker: loops forever, speeds up with scroll ---------- */
      const track = document.querySelector<HTMLElement>("[data-ticker]");
      if (track) {
        const loop = gsap.to(track, { xPercent: -50, ease: "none", duration: 34, repeat: -1 });
        ScrollTrigger.create({
          onUpdate: (self) => {
            const dir = self.direction;
            gsap.to(loop, {
              timeScale: dir * (1 + Math.min(Math.abs(self.getVelocity()) / 220, 7)),
              duration: 0.15,
              overwrite: true,
              onComplete: () => {
                gsap.to(loop, { timeScale: dir, duration: 0.9 });
              },
            });
          },
        });
      }

      /* the contact headline stays put: it must line up with the page grid at every width */
    });

    return () => {
      cleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, []);

  return null;
}
