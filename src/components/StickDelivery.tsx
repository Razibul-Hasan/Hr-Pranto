"use client";

/**
 * "Nervous catcher" button animation.
 *
 * Adapted from StickMan by Ahmed Shamim (https://stick-man-ui.vercel.app/,
 * "Nervous catcher" / heavy-download mission). The pose data and the
 * time-based SVG animation approach come from that demo; this version is
 * scoped to a React component, restyled for this page, has no sound, and
 * respects reduced motion.
 *
 * Important behaviour: the REAL download starts the instant the button is
 * clicked (it is a normal <a download>). The animation is a visual flourish
 * only; it never delays or fakes the download.
 */

import { useCallback, useEffect, useRef } from "react";

const DURATION = 9.5;

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (x: number) => {
  x = clamp(x);
  return x * x * (3 - 2 * x);
};
const interval = (t: number, a: number, b: number) => clamp((t - a) / (b - a));

type P = [number, number];
// head, neck, hip, left elbow/hand, right elbow/hand, knees/feet
const poses: Record<string, P[]> = {
  peek: [[-5,-42],[-3,-31],[0,-15],[-13,-24],[-18,-40],[8,-22],[15,-39],[-10,-8],[-16,0],[7,-8],[15,0]],
  stand: [[0,-67],[0,-56],[0,-29],[-8,-43],[-8,-31],[9,-43],[10,-32],[-5,-14],[-10,0],[6,-14],[11,0]],
  ready: [[0,-68],[0,-56],[0,-29],[-19,-49],[-28,-65],[19,-49],[28,-65],[-9,-14],[-17,0],[9,-14],[17,0]],
  left: [[-6,-67],[-4,-55],[0,-28],[-22,-48],[-29,-65],[14,-47],[25,-64],[-15,-17],[-26,0],[6,-13],[17,0]],
  right: [[6,-67],[4,-55],[0,-28],[-14,-47],[-25,-64],[22,-48],[29,-65],[-6,-13],[-17,0],[15,-17],[26,0]],
  confident: [[0,-70],[0,-58],[0,-30],[-20,-56],[-27,-72],[20,-56],[27,-72],[-8,-15],[-17,0],[8,-15],[17,0]],
  panic: [[0,-63],[0,-51],[0,-26],[-21,-60],[-24,-82],[21,-60],[24,-82],[-16,-14],[-26,0],[16,-14],[26,0]],
  squashed: [[0,-13],[0,-9],[0,-5],[-12,-7],[-20,-5],[12,-7],[20,-5],[-19,-5],[-30,0],[19,-5],[30,0]],
  lift: [[0,-39],[0,-28],[0,-15],[-22,-22],[-23,-46],[22,-22],[23,-46],[-16,-8],[-25,0],[16,-8],[25,0]],
  carry: [[0,-55],[0,-43],[0,-24],[-25,-39],[-24,-67],[25,-39],[24,-67],[-11,-12],[-18,0],[11,-12],[18,0]],
  stepL: [[-3,-54],[-2,-42],[0,-24],[-27,-38],[-26,-66],[23,-38],[22,-66],[-14,-14],[-24,0],[8,-9],[15,-3]],
  stepR: [[3,-54],[2,-42],[0,-24],[-23,-38],[-22,-66],[27,-38],[26,-66],[-8,-9],[-15,-3],[14,-14],[24,0]],
  push: [[9,-57],[7,-45],[13,-26],[-12,-49],[-33,-63],[-7,-38],[-32,-51],[0,-14],[-14,0],[22,-14],[29,0]],
  spent: [[-8,-49],[-3,-37],[3,-23],[-12,-23],[-15,-14],[8,-23],[12,-13],[-5,-11],[-13,0],[12,-11],[20,0]],
  proud: [[0,-64],[0,-52],[0,-27],[-12,-39],[-13,-28],[14,-48],[18,-62],[-6,-14],[-13,0],[7,-14],[14,0]],
};

// time, pose, x, y, alpha
const keys: [number, string, number, number, number][] = [
  [0,"peek",402,335,0],[.25,"peek",420,328,1],[.55,"stand",448,328,1],
  [.85,"ready",467,328,1],[1.18,"left",447,328,1],[1.40,"ready",447,328,1],
  [1.75,"right",500,328,1],[1.95,"ready",500,328,1],
  [2.20,"left",476,328,1],[2.45,"confident",484,328,1],
  [2.85,"confident",484,328,1],[3.08,"panic",484,328,1],
  [3.22,"panic",484,328,1],[3.36,"squashed",484,328,1],
  [4.05,"squashed",484,328,1],[4.45,"lift",484,328,1],
  [4.85,"carry",484,328,1],[5.15,"stepL",476,328,1],
  [5.43,"stepR",465,328,1],[5.71,"stepL",454,328,1],
  [5.98,"stepR",443,328,1],[6.22,"carry",437,328,1],
  [6.52,"push",437,328,1],[6.82,"spent",443,328,1],
  [7.24,"spent",443,328,1],[7.52,"proud",443,328,1],
  [8.92,"proud",443,328,1],[9.45,"peek",408,337,0],
];

function poseAt(t: number) {
  let a = keys[0];
  let b = keys[1];
  for (let i = 0; i < keys.length - 1; i++) {
    a = keys[i];
    b = keys[i + 1];
    if (t <= b[0]) break;
  }
  const f = smooth(interval(t, a[0], b[0]));
  const points = poses[a[1]].map((p, i) =>
    p.map((v, j) => mix(v, poses[b[1]][i][j], f))
  ) as P[];
  const shake = t > 4.05 && t < 4.85 ? Math.sin(t * 65) * 0.7 : 0;
  return {
    points,
    x: mix(a[2], b[2], f) + shake,
    y: mix(a[3], b[3], f),
    alpha: mix(a[4], b[4], f),
  };
}

const limbPath = (a: P, b: P, c: P, bend = 1) =>
  `M${a} Q${(a[0] + b[0]) / 2 + bend} ${(a[1] + b[1]) / 2} ${b} Q${(b[0] + c[0]) / 2 - bend} ${(b[1] + c[1]) / 2} ${c}`;

function fileAt(t: number, pose: ReturnType<typeof poseAt>) {
  if (t < 2.85)
    return { x: 484 + Math.sin(t * 4) * 8, y: 60 + smooth(interval(t, 0.7, 2.85)) * 33, angle: Math.sin(t * 4) * 5 };
  if (t < 3.36) {
    const f = interval(t, 2.85, 3.36);
    return { x: 484, y: 93 + 177 * f * f, angle: 0 };
  }
  if (t < 4.05) return { x: 484, y: 270, angle: 0 };
  if (t < 6.22) {
    const hand = pose.points[4];
    return {
      x: pose.x + (hand[0] + 24),
      y: pose.y + hand[1] - 56,
      angle: t > 4.85 ? Math.sin(t * 13) * 4 : 0,
    };
  }
  const f = smooth(interval(t, 6.22, 6.78));
  return { x: mix(437, 355, f), y: mix(205, 294, f) - Math.sin(f * Math.PI) * 25, angle: Math.sin(f * Math.PI) * -18 };
}

type Props = {
  href: string;
  label: string;
  className?: string;
};

export default function StickDelivery({ href, label, className = "" }: Props) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const frameRef = useRef(0);
  const runningRef = useRef(false);

  const stop = useCallback(() => {
    cancelAnimationFrame(frameRef.current);
    runningRef.current = false;
    const stage = stageRef.current;
    if (stage) stage.style.visibility = "hidden";
    const wrap = wrapRef.current;
    if (wrap) wrap.style.transform = "";
  }, []);

  useEffect(() => stop, [stop]);

  const play = useCallback(() => {
    // The browser starts the real download on its own (normal <a download>).
    if (runningRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const svg = svgRef.current;
    const stage = stageRef.current;
    const wrap = wrapRef.current;
    if (!svg || !stage || !wrap) return;

    const $ = <T extends Element = SVGElement>(sel: string) => svg.querySelector(sel) as T;
    const person = $("[data-person]");
    const headGroup = $("[data-head-group]");
    const head = $("[data-head]");
    const face = $("[data-face]");
    const thumb = $("[data-thumb]");
    const cape = $("[data-cape]");
    const capeFold = $("[data-cape-fold]");
    const body = $("[data-body]");
    const armL = $("[data-arm-left]");
    const armR = $("[data-arm-right]");
    const legL = $("[data-leg-left]");
    const legR = $("[data-leg-right]");
    const palmL = $("[data-palm-left]");
    const palmR = $("[data-palm-right]");
    const footL = $("[data-foot-left]");
    const footR = $("[data-foot-right]");
    const eyes = $("[data-eyes]");
    const brows = $("[data-brows]");
    const mouth = $("[data-mouth]");
    const cheeks = $("[data-cheeks]");
    const sweat = $("[data-sweat]");
    const effort = $("[data-effort]");
    const file = $("[data-file]");
    const impact = $("[data-impact]");
    const set = (el: Element, k: string, v: string | number) => el.setAttribute(k, String(v));

    const render = (t: number) => {
      const p = poseAt(t);
      const v = p.points;
      const approval = smooth(interval(t, 7.28, 7.6)) * (1 - smooth(interval(t, 8.92, 9.14)));
      const tilt = t < 2.85 ? -9 : t < 3.36 ? 0 : t < 6.7 ? 7 : mix(13, -8, smooth(interval(t, 7.24, 7.6)));
      set(headGroup, "transform", `rotate(${tilt} ${v[0][0]} ${v[0][1]})`);
      set(thumb, "opacity", approval);
      set(thumb, "transform", `translate(${v[6][0]} ${v[6][1]}) scale(${0.8 + 0.2 * approval})`);

      set(person, "transform", `translate(${p.x} ${p.y})`);
      set(person, "opacity", p.alpha);
      set(head, "cx", v[0][0]);
      set(head, "cy", v[0][1]);
      const neck = v[1];
      const hip = v[2];
      const previous = poseAt(Math.max(0, t - 0.14));
      const drift = clamp((previous.x - p.x) * 1.4, -13, 13);
      const flutter = Math.sin(t * 8 - 1) * (t > 4.05 && t < 6.7 ? 3 : 1.3);
      const tail = hip[0] - 24 + drift;
      set(cape, "d", `M${neck[0] - 2} ${neck[1] + 2} Q${neck[0] - 16 + drift} ${neck[1] + 8} ${tail} ${hip[1] + 8 + flutter} Q${tail + 8} ${hip[1] + 5} ${tail + 12} ${hip[1] + 12} Q${hip[0] - 3} ${hip[1] + 8} ${neck[0] + 3} ${neck[1] + 3} Z`);
      set(capeFold, "d", `M${neck[0] - 4} ${neck[1] + 7} Q${hip[0] - 12 + drift / 2} ${hip[1] - 2} ${tail + 10} ${hip[1] + 7 + flutter / 2}`);
      set(body, "d", `M${neck} Q${neck[0] + 4} ${(neck[1] + hip[1]) / 2} ${hip}`);
      set(armL, "d", limbPath(neck, v[3], v[4], -2));
      set(armR, "d", limbPath(neck, v[5], v[6], 2));
      set(legL, "d", limbPath(hip, v[7], v[8], -1.8));
      set(legR, "d", limbPath(hip, v[9], v[10], 1.8));
      const sides: [Element, Element, P, P, number][] = [
        [palmL, footL, v[4], v[8], -1],
        [palmR, footR, v[6], v[10], 1],
      ];
      sides.forEach(([palm, foot, hand, ft, dir], i) => {
        set(palm, "d", `M${hand[0] - 3} ${hand[1] + 2} q-2 -5 1 -5 q2 -1 3 2 l2 -1 q3 1 0 4 q-3 2 -6 0`);
        set(palm, "opacity", i === 1 ? 1 - approval : 1);
        set(foot, "d", `M${ft[0] - dir * 2} ${ft[1] - 3} q${dir * 4} -1 ${dir * 8} 2 q${dir * 2} 2 -1 2 h${-dir * 9} Z`);
      });

      const surprised = t > 2.92 && t < 3.4;
      const strained = t >= 3.4 && t < 6.7;
      const embarrassed = t >= 6.7;
      set(face, "transform", `translate(${v[0][0]} ${v[0][1] + (t < 2.92 ? -2 : 0)})`);
      set(eyes, "d", strained ? "M-6 -2l3 2-3 1 M3 -2l-3 2 3 1" : surprised ? "M-5 -3v3 M2 -3v3" : "M-5 -1v.8 M2 -1v.8");
      set(brows, "d", surprised ? "M-8 -6q3 -3 5 -1 M0 -7q3 -2 5 1" : strained ? "M-8 -5l5 2 M0 -3l5 -2" : embarrassed ? "M-8 -4q3 -2 5 0 M0 -5l5 2" : "M-8 -5q3 -2 5 0 M0 -6q3 -1 5 1");
      set(mouth, "d", surprised ? "M-2 4q-3 0 -2 4q2 3 4 0q1 -4 -2 -4Z" : strained ? "M-5 6q4 -5 8 0l-1 2h-6Z" : embarrassed ? `M-5 5q4 ${mix(-1, 5, approval)} 8 -1` : "M-4 5q3 2 6 -1");
      set(cheeks, "opacity", embarrassed ? 0.65 : 0);
      set(sweat, "opacity", surprised || (strained && t > 4.1) ? 0.85 : 0);
      set(sweat, "d", `M${v[0][0] + 16} ${v[0][1] - 4}q5 4 1 7m4 1q3 3 0 5`);
      const load = smooth(interval(t, 4.05, 4.3)) * (1 - smooth(interval(t, 6.15, 6.5)));
      set(effort, "opacity", load * 0.65);
      set(effort, "d", `M${v[8][0] - 10} -2l-5 -3m7 8h-9 M${v[10][0] + 10} -2l5 -3m-7 8h9`);

      const f = fileAt(t, p);
      set(file, "opacity", smooth(interval(t, 0.65, 0.95)));
      set(file, "transform", `translate(${f.x} ${f.y}) rotate(${f.angle} 0 28)`);
      const hit = t >= 3.3 && t < 3.58;
      const delivered = t >= 6.62 && t < 6.96;
      set(impact, "opacity", hit ? Math.sin(interval(t, 3.3, 3.58) * Math.PI) : delivered ? Math.sin(interval(t, 6.62, 6.96) * Math.PI) : 0);
      set(impact, "transform", hit ? "translate(484 325)" : "translate(355 282)");

      // the button gets shoved when the file lands in it
      let sx = 1;
      let sy = 1;
      if (delivered) {
        const ff = interval(t, 6.62, 6.96);
        sx += Math.sin(ff * Math.PI * 2) * 0.06 * (1 - ff);
        sy -= Math.sin(ff * Math.PI * 2) * 0.1 * (1 - ff);
      }
      wrap.style.transform = `scale(${sx},${sy})`;
    };

    // size the overlay so the scene's button area (x 220..420, y 280..328) lands on the real button
    const btn = wrap.querySelector("a");
    if (btn) {
      const r = btn.getBoundingClientRect();
      // 1.35x so the little hero is easy to see, but never wider than the screen allows:
      // his furthest reach is ~210 scene units right of the button's centre.
      const unit = r.width / 200;
      const room = window.innerWidth - 12 - (r.left + r.width / 2);
      const s = Math.max(0.55, Math.min(unit * 1.35, room / 210));
      stage.style.width = `${640 * s}px`;
      stage.style.height = `${380 * s}px`;
      // scene x=320 is the button's centre; the ground line (y=328) is its bottom edge
      stage.style.left = `${r.width / 2 - 320 * s}px`;
      stage.style.top = `${r.height - 328 * s}px`;
    }

    runningRef.current = true;
    stage.style.visibility = "visible";
    const start = performance.now();
    const tick = (now: number) => {
      if (!runningRef.current) return;
      const t = (now - start) / 1000;
      render(Math.min(t, DURATION));
      if (t < DURATION) frameRef.current = requestAnimationFrame(tick);
      else stop();
    };
    frameRef.current = requestAnimationFrame(tick);
  }, [stop]);

  return (
    <span ref={wrapRef} className="relative block origin-bottom sm:inline-block">
      <a
        href={href}
        download
        onClick={play}
        className={`btn w-full bg-paper text-lg font-extrabold uppercase tracking-[0.06em] text-ink [--hover-bg:var(--marker)] [--hover-text:#141414] [--px:2.1rem] [--py:1.15rem] max-sm:text-base max-sm:[--px:0.5rem]! max-sm:[--py:0.9rem]! sm:w-auto sm:text-xl ${className}`}
      >
        <span className="btn-label">{label}</span>
      </a>

      {/* animation overlay: purely visual, never blocks clicks */}
      <div
        ref={stageRef}
        aria-hidden
        className="pointer-events-none absolute z-30"
        style={{ visibility: "hidden" }}
      >
        <svg
          ref={svgRef}
          viewBox="0 0 640 380"
          fill="none"
          className="absolute inset-0 h-full w-full overflow-visible text-ink"
        >
          <defs>
            <clipPath id="sd-file-clip">
              <rect x="0" y="0" width="640" height="280" />
              <rect x="420" y="0" width="220" height="380" />
            </clipPath>
          </defs>
          <g data-person opacity="0" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <path data-cape fill="#e4202b" stroke="#141414" strokeWidth="1.5" />
            <path data-cape-fold stroke="#141414" strokeWidth="1" />
            <path data-body strokeWidth="3" />
            <path data-arm-left strokeWidth="2.5" />
            <path data-arm-right strokeWidth="2.8" />
            <path data-leg-left strokeWidth="2.8" />
            <path data-leg-right strokeWidth="2.5" />
            <path data-foot-left fill="currentColor" strokeWidth="1.3" />
            <path data-foot-right fill="currentColor" strokeWidth="1.3" />
            <path data-palm-left fill="#f1eadb" strokeWidth="1.5" />
            <path data-palm-right fill="#f1eadb" strokeWidth="1.5" />
            <g data-head-group>
              <circle data-head r="12" fill="#f1eadb" strokeWidth="2.5" />
              <g data-face>
                <path data-eyes strokeWidth="2.1" />
                <path data-brows strokeWidth="1.4" />
                <path data-mouth strokeWidth="1.4" />
                <path data-cheeks d="M-8 3l2 1m10-1 2 1" stroke="#e4202b" strokeWidth="2.3" opacity="0" />
              </g>
            </g>
            <g data-thumb opacity="0" strokeWidth="1.2">
              <path d="M-3 2V-6L1-11V-18Q1-21 4-20Q7-19 6-15L5-10H12Q15-10 14-6L12 1Q12 3 9 3H1L-3 2Z" fill="currentColor" stroke="currentColor" />
              <path d="M0-5V1M7-6H12" stroke="#f1eadb" />
            </g>
            <path data-sweat opacity="0" strokeWidth="1.3" />
            <path data-effort opacity="0" strokeWidth="1.2" />
          </g>
          <g clipPath="url(#sd-file-clip)">
            <g data-file opacity="0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M-24 0H9l15 15v41h-48z" fill="#f1eadb" />
              <path d="M9 0v15h15M-13 31H12M-13 39H4" />
              <path d="M-14 8h12" stroke="#e4202b" strokeWidth="3" />
            </g>
          </g>
          <g data-impact opacity="0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="m-35-9-8-5m8 13-10 2m80-10 8-5m-8 13 10 2" />
          </g>
        </svg>
      </div>
    </span>
  );
}
