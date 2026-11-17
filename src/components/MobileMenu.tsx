"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

type Item = { href: string; label: string };

/**
 * Phone / small-tablet menu: a hamburger that opens a full-screen (100dvh)
 * overlay. It is rendered in a portal on <body> so it can never be trapped
 * inside the animated header. Page scroll is locked while it is open; it
 * closes on link tap, Escape, the X button, or when the screen grows to the
 * desktop layout. Links reuse the page's hash-free smooth scroll.
 */
export default function MobileMenu({
  items,
  phone,
  phoneLabel,
  email,
}: {
  items: Item[];
  phone: string;
  phoneLabel: string;
  email: string;
}) {
  const [open, setOpen] = useState(false);
  // false on the server and during hydration, true afterwards: the portal needs document.body
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const openBtnRef = useRef<HTMLButtonElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = useCallback((returnFocus = false) => {
    setOpen(false);
    if (returnFocus) openBtnRef.current?.focus();
  }, []);

  // lock page scroll, move focus into the menu, and wire up keys while open
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    closeBtnRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close(true);
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const f = panelRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    const mq = window.matchMedia("(min-width: 768px)");
    const onMq = () => mq.matches && close();
    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => {
      html.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
    };
  }, [open, close]);

  const panel = (
    <div
      ref={panelRef}
      id="mobile-menu"
      data-open={open}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      aria-hidden={!open}
      className="mm fixed inset-0 z-[150] flex h-dvh flex-col bg-paper md:hidden"
    >
      <div className="halftone pointer-events-none absolute inset-x-0 top-0 h-40 opacity-[0.07]" aria-hidden />

      <div className="relative flex items-center justify-between border-b-[5px] border-double border-ink px-4 py-2.5 sm:px-8">
        <span className="font-display text-3xl leading-none tracking-wide sm:text-4xl">M.I. PRANTO</span>
        <button
          ref={closeBtnRef}
          type="button"
          aria-label="Close menu"
          onClick={() => close(true)}
          className="relative h-11 w-11 border-[3px] border-ink bg-paper"
          tabIndex={open ? 0 : -1}
        >
          <span className="absolute left-1/2 top-1/2 block h-[3px] w-5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-ink" />
          <span className="absolute left-1/2 top-1/2 block h-[3px] w-5 -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-ink" />
        </button>
      </div>

      {/* links: 24px from the top bar, 24px rows of breathing room, 8px-grid rhythm */}
      <nav
        aria-label="Mobile"
        className="relative flex min-h-0 flex-1 flex-col overflow-y-auto px-5 py-6 sm:px-8"
      >
        {/* my-auto centres the list when there is room and falls back to top-aligned + scrollable when not */}
        <ul className="my-auto">
          {items.map((n, i) => (
            <li
              key={n.href}
              className="mm-item border-b-[3px] border-ink first:border-t-[3px]"
              style={{ ["--i" as string]: i }}
            >
              <a
                href={n.href}
                onClick={() => close()}
                tabIndex={open ? 0 : -1}
                className="font-display -mx-5 flex items-center justify-between gap-4 px-5 py-5 text-[clamp(2.25rem,12vw,4.5rem)] uppercase leading-none transition-colors active:bg-marker sm:-mx-8 sm:px-8 [@media(max-height:560px)]:py-3"
              >
                <span>{n.label}</span>
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  className="h-7 w-7 shrink-0 text-red"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="square"
                >
                  <path d="M7 7l10 10M17 8v9H8" />
                </svg>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* call-to-action block: ruled off from the links, 24px side/bottom padding (+ phone safe area) */}
      <div className="relative border-t-[3px] border-ink px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5 sm:px-8">
        <p className="mm-item font-hand mb-4 text-lg leading-none text-red" style={{ ["--i" as string]: items.length }}>
          don&apos;t just scroll, say hi.
        </p>
        <div className="mm-item grid gap-3 sm:grid-cols-2" style={{ ["--i" as string]: items.length + 1 }}>
          <a
            href={`tel:${phone}`}
            tabIndex={open ? 0 : -1}
            className="btn min-h-14 bg-ink text-[0.8125rem] font-extrabold min-[360px]:text-base sm:text-lg [--px:0.75rem] uppercase tracking-[0.06em] text-paper [--hover-bg:var(--marker)] [--hover-text:#141414]"
          >
            <span className="btn-label">Call {phoneLabel}</span>
          </a>
          <a
            href={`mailto:${email}`}
            tabIndex={open ? 0 : -1}
            className="btn min-h-14 bg-red text-[0.8125rem] font-extrabold min-[360px]:text-base sm:text-lg [--px:0.75rem] uppercase tracking-[0.06em] text-white [--hover-bg:var(--ink)] [--hover-text:#ffffff]"
          >
            <span className="btn-label">Send an email</span>
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <div className="md:hidden">
      <button
        ref={openBtnRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className="flex h-11 w-11 flex-col items-center justify-center gap-[5px] border-[3px] border-ink bg-paper"
      >
        <span className="block h-[3px] w-5 bg-ink" />
        <span className="block h-[3px] w-5 bg-ink" />
        <span className="block h-[3px] w-5 bg-ink" />
      </button>
      {mounted ? createPortal(panel, document.body) : null}
    </div>
  );
}
