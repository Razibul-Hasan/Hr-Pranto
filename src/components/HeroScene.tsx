"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * The CV desk: a stack of résumés on a desk, a big rubber stamp thumps down,
 * the stamped CV is flicked away and the next one slides up.
 * Flat, print-like materials in the page's paper / ink / red palette.
 */

const INK = 0x141414;
const RED = 0xe4202b;
const CARD_W = 2.5;
const CARD_H = 3.3;
const CYCLE = 3.8;
const MARK = { x: 0.35, y: -0.95 }; // stamp position in card-local units

// canvas px per world unit
const CW = 512;
const CH = Math.round((CW * CARD_H) / CARD_W);

const STAMPS = ["HIRED", "SCREENED", "INTERVIEWED", "ONBOARDED"];

const slots = [
  { x: 0, y: 0, z: 0, r: -0.03 },
  { x: 0.1, y: -0.14, z: -0.1, r: 0.06 },
  { x: -0.08, y: -0.26, z: -0.2, r: -0.08 },
  { x: 0.12, y: -0.38, z: -0.3, r: 0.1 },
];

const easeIn = (t: number) => t * t * t;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

type Card = {
  group: THREE.Group;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  tex: THREE.CanvasTexture;
  kind: "pranto" | "other";
  label: string;
  idx: number; // which card of the cycle (0..3)
  exiting: number; // 0 = on stack, >0 = seconds into exit
  px: number;
  py: number;
  pz: number;
  pr: number;
  ox: number;
  oy: number;
  or: number;
};

export default function HeroScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.touchAction = "pan-y";
    renderer.domElement.style.cursor = "pointer";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0.2, 13);

    scene.add(new THREE.AmbientLight(0xffffff, 1.4));
    const key = new THREE.DirectionalLight(0xffffff, 1.8);
    key.position.set(-3, 6, 9);
    scene.add(key);

    const world = new THREE.Group();
    world.rotation.x = -0.42; // look down at the desk
    scene.add(world);

    const disposables: { dispose: () => void }[] = [];
    const track = <T extends { dispose: () => void }>(o: T) => {
      disposables.push(o);
      return o;
    };

    /* ---------- fonts for the paper texture ---------- */
    const cssVar = (name: string, fallback: string) => {
      const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      return v || fallback;
    };
    let fDisplay = "Impact, sans-serif";
    let fHand = "cursive";
    let fBody = "Arial, sans-serif";
    const readFonts = () => {
      fDisplay = cssVar("--font-display", fDisplay);
      fHand = cssVar("--font-marker", fHand);
      fBody = cssVar("--font-body", fBody);
    };
    readFonts();

    /* ---------- portrait for Pranto's CV ---------- */
    const portrait = new Image();
    let portraitReady = false;
    portrait.src = "/portrait-cut.png";

    /* ---------- drawing the paper ---------- */
    const drawCard = (c: Card, stamp: string | null) => {
      const g = c.ctx;
      g.clearRect(0, 0, CW, CH);
      g.fillStyle = "#F1EADB";
      g.fillRect(0, 0, CW, CH);

      if (c.kind === "pranto") {
        // photo
        g.fillStyle = "#E4202B";
        g.fillRect(36, 40, 190, 236);
        if (portraitReady) {
          const ih = 236;
          const iw = (portrait.naturalWidth / portrait.naturalHeight) * ih;
          g.save();
          g.beginPath();
          g.rect(36, 40, 190, 236);
          g.clip();
          g.drawImage(portrait, 36 + (190 - iw) / 2, 40, iw, ih);
          g.restore();
        }
        g.strokeStyle = "#141414";
        g.lineWidth = 7;
        g.strokeRect(36, 40, 190, 236);
        // name
        g.fillStyle = "#141414";
        g.textBaseline = "alphabetic";
        g.font = `64px ${fDisplay}`;
        g.fillText("MOHSHIN", 254, 96);
        g.fillText("IMAM", 254, 160);
        g.fillText("PRANTO", 254, 224);
        g.fillStyle = "#E4202B";
        g.font = `28px ${fHand}`;
        g.fillText("HR Generalist", 254, 268);
      } else {
        g.fillStyle = "#CFC6AE";
        g.fillRect(36, 40, 190, 236);
        g.fillStyle = "#8F8774";
        g.beginPath();
        g.arc(131, 130, 38, 0, Math.PI * 2);
        g.fill();
        g.beginPath();
        g.ellipse(131, 262, 74, 80, 0, Math.PI, 0);
        g.fill();
        g.strokeStyle = "#141414";
        g.lineWidth = 7;
        g.strokeRect(36, 40, 190, 236);
        g.fillStyle = "#141414";
        g.fillRect(254, 60, 200, 22);
        g.fillRect(254, 100, 150, 22);
        g.fillStyle = "#E4202B";
        g.fillRect(254, 150, 110, 16);
        g.fillStyle = "#8F8774";
        g.font = `18px ${fBody}`;
        g.fillText("CANDIDATE", 254, 214);
      }

      // section rules (shared)
      g.fillStyle = "#141414";
      g.font = `26px ${fDisplay}`;
      g.fillText("EXPERIENCE", 36, 336);
      g.fillRect(36, 346, 440, 4);
      const bars = [380, 300, 400, 250, 340];
      bars.forEach((w, i) => {
        g.fillStyle = "#E4202B";
        g.fillRect(36, 374 + i * 34, 10, 10);
        g.fillStyle = i % 2 ? "#BDB59F" : "#8F8774";
        g.fillRect(60, 372 + i * 34, w, 14);
      });
      g.fillStyle = "#141414";
      g.font = `26px ${fDisplay}`;
      g.fillText("SKILLS", 36, 580);
      g.fillRect(36, 590, 440, 4);
      [0, 1, 2].forEach((i) => {
        g.fillStyle = "#BDB59F";
        g.fillRect(36 + i * 150, 612, 130, 22);
      });

      // border
      g.strokeStyle = "#141414";
      g.lineWidth = 12;
      g.strokeRect(0, 0, CW, CH);

      // the stamp mark
      if (stamp) {
        const mx = (MARK.x / CARD_W + 0.5) * CW - 10;
        const my = (0.5 - MARK.y / CARD_H) * CH - 70;
        g.save();
        g.translate(mx, my);
        g.rotate(-0.2);
        g.globalAlpha = 0.93;
        g.strokeStyle = "#E4202B";
        g.fillStyle = "#E4202B";
        let size = 72;
        g.font = `${size}px ${fDisplay}`;
        const maxW = 320;
        const w = g.measureText(stamp).width;
        if (w > maxW) {
          size = Math.floor((size * maxW) / w);
          g.font = `${size}px ${fDisplay}`;
        }
        const tw = g.measureText(stamp).width;
        g.lineWidth = 9;
        g.beginPath();
        g.roundRect(-tw / 2 - 26, -size * 0.78, tw + 52, size * 1.28, 8);
        g.stroke();
        g.textAlign = "center";
        g.textBaseline = "alphabetic";
        g.fillText(stamp, 0, 0);
        g.restore();
      }
      c.tex.needsUpdate = true;
    };

    /* ---------- cards ---------- */
    const cardGeo = track(new THREE.BoxGeometry(CARD_W, CARD_H, 0.05));
    const sideMat = track(new THREE.MeshBasicMaterial({ color: INK }));
    const shadowGeo = track(new THREE.PlaneGeometry(CARD_W, CARD_H));
    const shadowMat = track(
      new THREE.MeshBasicMaterial({ color: INK, transparent: true, opacity: 0.85 })
    );

    const cards: Card[] = STAMPS.map((label, idx) => {
      const canvas = document.createElement("canvas");
      canvas.width = CW;
      canvas.height = CH;
      const ctx = canvas.getContext("2d")!;
      const tex = track(new THREE.CanvasTexture(canvas));
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 4;
      const face = track(new THREE.MeshBasicMaterial({ map: tex }));
      const mesh = new THREE.Mesh(cardGeo, [sideMat, sideMat, sideMat, sideMat, face, sideMat]);
      const shadow = new THREE.Mesh(shadowGeo, shadowMat);
      shadow.position.set(0.16, -0.16, -0.05);
      const group = new THREE.Group();
      group.add(shadow, mesh);
      world.add(group);
      const s = slots[idx];
      group.position.set(s.x, s.y, s.z);
      group.rotation.z = s.r;
      return {
        group,
        canvas,
        ctx,
        tex,
        kind: idx === 0 ? "pranto" : "other",
        label,
        idx,
        exiting: 0,
        px: s.x,
        py: s.y,
        pz: s.z,
        pr: s.r,
        ox: 0,
        oy: 0,
        or: 0,
      } as Card;
    });
    cards.forEach((c) => drawCard(c, null));

    // redraw when the real fonts / portrait are ready
    const redrawAll = () => {
      readFonts();
      cards.forEach((c) => drawCard(c, c.exiting > 0 || c === order[0] && stamped ? c.label : null));
    };
    portrait.onload = () => {
      portraitReady = true;
      redrawAll();
    };
    document.fonts?.ready.then(redrawAll);

    // order[0] is the top of the stack
    const order: Card[] = [...cards];
    let stamped = false;

    /* ---------- the stamp ---------- */
    const stamp = new THREE.Group();
    const inkMat = track(new THREE.MeshStandardMaterial({ color: INK, roughness: 0.6 }));
    const redMat = track(new THREE.MeshStandardMaterial({ color: RED, roughness: 0.55 }));
    const outlineMat = track(new THREE.MeshBasicMaterial({ color: INK, side: THREE.BackSide }));

    const plateGeo = track(new THREE.BoxGeometry(1.5, 0.78, 0.07));
    const plate = new THREE.Mesh(plateGeo, redMat);
    plate.position.z = 0.035;
    const bodyGeo = track(new THREE.BoxGeometry(1.6, 0.88, 0.2));
    const body = new THREE.Mesh(bodyGeo, inkMat);
    body.position.z = 0.17;
    const neckGeo = track(new THREE.CylinderGeometry(0.17, 0.22, 0.75, 20));
    const neck = new THREE.Mesh(neckGeo, inkMat);
    neck.rotation.x = Math.PI / 2;
    neck.position.z = 0.65;
    const knobGeo = track(new THREE.SphereGeometry(0.36, 28, 20));
    const knob = new THREE.Mesh(knobGeo, redMat);
    knob.position.z = 1.15;
    const knobHull = new THREE.Mesh(knobGeo, outlineMat);
    knobHull.scale.setScalar(1.09);
    knob.add(knobHull);
    const bodyHull = new THREE.Mesh(bodyGeo, outlineMat);
    bodyHull.scale.set(1.04, 1.08, 1.2);
    body.add(bodyHull);
    stamp.add(plate, body, neck, knob);
    world.add(stamp);

    // soft contact shadow of the stamp on the paper
    const stampShadowGeo = track(new THREE.PlaneGeometry(1.6, 0.88));
    const stampShadowMat = track(
      new THREE.MeshBasicMaterial({ color: INK, transparent: true, opacity: 0.28 })
    );
    const stampShadow = new THREE.Mesh(stampShadowGeo, stampShadowMat);
    world.add(stampShadow);

    // ink ring on impact
    const ringGeo = track(new THREE.RingGeometry(0.55, 0.68, 48));
    const ringMat = track(
      new THREE.MeshBasicMaterial({ color: RED, transparent: true, opacity: 0, side: THREE.DoubleSide })
    );
    const ring = new THREE.Mesh(ringGeo, ringMat);
    world.add(ring);

    /* ---------- sizing ---------- */
    const layout = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      // fit the desk in both directions: width-bound in tall boxes, height-bound in wide/short ones
      const needW = 7.4;
      const needH = 6.4;
      const fovRad = THREE.MathUtils.degToRad(camera.fov);
      const tanHalf = Math.tan(fovRad / 2);
      camera.position.z = Math.max(
        12,
        needW / (2 * tanHalf * camera.aspect),
        needH / (2 * tanHalf)
      );
      camera.updateProjectionMatrix();
      // the portrait stands on the right on wide layouts, so slide the desk left
      world.position.x = -1.0;
      world.position.y = 0.2;
    };
    layout();
    const ro = new ResizeObserver(() => {
      layout();
      if (reduceMotion) renderer.render(scene, camera);
    });
    ro.observe(mount);

    /* ---------- animation ---------- */
    const markWorld = (c: Card) => {
      const cos = Math.cos(c.pr);
      const sin = Math.sin(c.pr);
      return {
        x: c.px + MARK.x * cos - MARK.y * sin,
        y: c.py + MARK.x * sin + MARK.y * cos,
        z: c.pz + 0.03,
      };
    };

    const HOVER_Z = 3.6;
    let phase = 0;
    let impacted = false;
    let shake = 0;
    let ringT = 1;
    const sp = new THREE.Vector3(0.35, 0.9, HOVER_Z);
    const tilt = new THREE.Vector2();

    const startStampNow = () => {
      if (phase < 0.7) phase = 0.7;
    };

    const onMove = (e: PointerEvent) => {
      const r = mount.getBoundingClientRect();
      tilt.set(((e.clientX - r.left) / r.width) * 2 - 1, -(((e.clientY - r.top) / r.height) * 2 - 1));
    };
    window.addEventListener("pointermove", onMove);
    renderer.domElement.addEventListener("pointerdown", startStampNow);

    const applyStamp = (z: number, mark: { x: number; y: number; z: number }) => {
      stamp.position.set(sp.x, sp.y, z);
      stamp.rotation.z = -0.2;
      const lift = Math.max(0, z - mark.z);
      stampShadow.position.set(sp.x + lift * 0.18, sp.y - lift * 0.22, mark.z + 0.02);
      stampShadow.rotation.z = -0.2;
      stampShadow.scale.setScalar(1 + lift * 0.05);
      stampMatOpacity(lift);
    };
    const stampMatOpacity = (lift: number) => {
      stampShadowMat.opacity = Math.max(0.1, 0.34 - lift * 0.05);
    };

    const stepTo = (dt: number) => {
      phase += dt;
      if (phase >= CYCLE) phase -= CYCLE;
    };

    const top = () => order[0];

    const update = (dt: number) => {
      const prev = phase;
      stepTo(dt);
      const c = top();
      const mark = markWorld(c);

      // stamp follows the top card horizontally while it hovers
      const tx = mark.x;
      const ty = mark.y;
      const k = 1 - Math.exp(-dt * 7);
      sp.x += (tx - sp.x) * k;
      sp.y += (ty - sp.y) * k;

      let z = HOVER_Z + Math.sin(phase * 2.2) * 0.12;
      if (phase >= 0.7 && phase < 1.15) {
        z = THREE.MathUtils.lerp(HOVER_Z, mark.z, easeIn((phase - 0.7) / 0.45));
      } else if (phase >= 1.15 && phase < 1.45) {
        z = mark.z;
      } else if (phase >= 1.45 && phase < 1.95) {
        z = THREE.MathUtils.lerp(mark.z, HOVER_Z, easeOut((phase - 1.45) / 0.5));
      }

      // impact
      if (prev < 1.15 && phase >= 1.15) {
        stamped = true;
        drawCard(c, c.label);
        shake = 1;
        ringT = 0;
        ring.position.set(mark.x, mark.y, mark.z + 0.05);
      }
      // flick the stamped CV away
      if (prev < 1.95 && phase >= 1.95) {
        c.exiting = 0.0001;
        c.ox = c.px;
        c.oy = c.py;
        c.or = c.pr;
        order.shift();
        order.push(c);
        stamped = false;
      }
      // recycle the card once it is off the desk
      if (c.exiting > 0) {
        /* handled below for any exiting card */
      }

      cards.forEach((cd) => {
        if (cd.exiting > 0) {
          cd.exiting += dt;
          const t = clamp01(cd.exiting / 0.6);
          const e = easeIn(t);
          cd.px = cd.ox + e * 9;
          cd.py = cd.oy + e * 2.4;
          cd.pr = cd.or - e * 0.9;
          cd.pz = 0.4;
          if (t >= 1) {
            cd.exiting = 0;
            drawCard(cd, null);
            const s = slots[3];
            cd.px = s.x;
            cd.py = s.y;
            cd.pz = s.z - 0.1;
            cd.pr = s.r;
          }
        }
      });
      // cards still on the stack glide to their slots
      const k2 = 1 - Math.exp(-dt * 9);
      order.forEach((cd, i) => {
        if (cd.exiting > 0) return;
        const s = slots[i];
        cd.px += (s.x - cd.px) * k2;
        cd.py += (s.y - cd.py) * k2;
        cd.pz += (s.z - cd.pz) * k2;
        cd.pr += (s.r - cd.pr) * k2;
      });
      cards.forEach((cd) => {
        cd.group.position.set(cd.px, cd.py, cd.pz);
        cd.group.rotation.z = cd.pr;
      });

      applyStamp(z, mark);

      // ring
      if (ringT < 1) {
        ringT = Math.min(1, ringT + dt / 0.55);
        const s = 0.5 + easeOut(ringT) * 1.7;
        ring.scale.setScalar(s);
        ringMat.opacity = 0.75 * (1 - ringT);
      } else {
        ringMat.opacity = 0;
      }

      // screen shake on impact
      shake *= Math.pow(0.0008, dt);
      world.position.y = 0.2 + Math.sin(phase * 90) * 0.1 * shake;
      impacted = shake > 0.01;
      void impacted;
    };

    let raf = 0;
    let last = performance.now();
    let visible = true;
    const io = new IntersectionObserver(([en]) => (visible = en.isIntersecting));
    io.observe(mount);

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!visible) return;
      update(dt);
      world.rotation.y += (tilt.x * 0.22 - world.rotation.y) * 0.05;
      world.rotation.x += (-0.42 - tilt.y * 0.1 - world.rotation.x) * 0.05;
      renderer.render(scene, camera);
    };

    if (reduceMotion) {
      // still frame: Pranto's CV, already stamped
      const c = top();
      stamped = true;
      drawCard(c, c.label);
      const m = markWorld(c);
      sp.set(m.x, m.y, 0);
      applyStamp(HOVER_Z, m);
      renderer.render(scene, camera);
    } else {
      raf = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      renderer.domElement.removeEventListener("pointerdown", startStampNow);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0"
      role="img"
      aria-label="Animated 3D desk: a rubber stamp marks résumés as screened, interviewed, hired and onboarded. Click to stamp."
    />
  );
}
