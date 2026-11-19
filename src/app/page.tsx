import Image from "next/image";
import HeroScene from "@/components/HeroScene";
import Btn from "@/components/Btn";
import StickDelivery from "@/components/StickDelivery";
import MobileMenu from "@/components/MobileMenu";
import Preloader from "@/components/Preloader";
import Motion from "@/components/Motion";

const EMAIL = "mohshinimampranto@gmail.com";
const PHONE = "+8801622710529";
const PHONE_DISPLAY = "+880 1622-710529";
const FACEBOOK = "https://www.facebook.com/mohshin.imam.pranto";
const LINKEDIN = "https://www.linkedin.com/in/mohshin-imam-pranto-982343247";

const nav = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Jobs" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

const ticker = [
  "Recruitment",
  "Onboarding",
  "Payroll inputs",
  "KPI tracking",
  "HR policies & SOPs",
  "ISO QMS & EMS",
  "Attendance & leave",
  "HR reporting",
];

const stats = [
  { n: 3, suffix: "+", label: "years in HR" },
  { n: 150, suffix: "+", label: "people covered by the SOPs I wrote" },
  { n: 3, suffix: "", label: "worlds: software, corporate, factory" },
];

const jobs = [
  {
    role: "HR Generalist, People & Culture",
    org: "WPXPO",
    time: "Feb 2026 – now",
    points: [
      "Run daily HR operations: attendance, leave, employee records and documentation.",
      "Support full-cycle recruitment, from screening and interviews to onboarding.",
      "Write and roll out HR policies, SOPs and admin processes.",
      "Prepare monthly payroll inputs by verifying attendance and leave records.",
      "Track KPIs and disciplinary records, and report to management.",
    ],
  },
  {
    role: "Executive, HR & Admin",
    org: "Fitment Craft",
    time: "Feb 2025 – Feb 2026",
    points: [
      "Implemented ISO-based HR systems (QMS and EMS) across corporate and factory operations.",
      "Developed HR policies and SOPs that standardized processes for 150+ employees.",
      "Managed recruitment, onboarding and KPI-driven performance evaluations.",
      "Ran monthly payroll processing, attendance checks and salary administration.",
      "Delivered training and employee engagement programs.",
    ],
  },
  {
    role: "Management Trainee Officer",
    org: "Daffodil Family",
    time: "Jan 2024 – Jan 2025",
    points: [
      "Assisted with salary setting and compensation activities.",
      "Built admission, operational and management reports in Excel and Google Sheets.",
      "Maintained employee and student records with accurate documentation.",
    ],
  },
  {
    role: "HR Intern",
    org: "Real Capita Group",
    time: "Feb 2023 – Jun 2023",
    points: [
      "Assisted with recruitment, onboarding and HR documentation.",
      "Monitored performance, attendance and target achievement.",
      "Supported policy drafting and HR reporting.",
    ],
  },
  {
    role: "Radio Jockey",
    org: "Jago FM 94.4",
    time: "2017 – 2019",
    points: [
      "Presented on air and worked as a voice artist.",
      "Directed music and supported event operations.",
    ],
  },
];

const skills = [
  {
    title: "HR operations",
    text: "Employee records, attendance, leave management, HR documentation, process coordination.",
  },
  {
    title: "Hiring",
    text: "Candidate screening, interview scheduling, recruitment coordination, onboarding.",
  },
  {
    title: "Performance tracking",
    text: "KPI tracking, evaluation support, disciplinary records, management reporting.",
  },
  {
    title: "Policy and compliance",
    text: "HR policy and SOP development, administrative guidelines, ISO systems (QMS and EMS).",
  },
  {
    title: "Payroll and attendance",
    text: "Attendance verification, payroll processing support, salary administration, data accuracy.",
  },
  {
    title: "The people side",
    text: "Employee engagement, training coordination, HR analytics, team coordination, clear communication.",
  },
];

const education = [
  { degree: "BBA in HRM", school: "Stamford University Bangladesh", time: "2018 – 2023" },
  { degree: "ACCA Foundation", school: "Chartered University College", time: "2016 – 2017" },
  { degree: "HSC, Commerce", school: "Ideal Commerce College", time: "2013 – 2015" },
  { degree: "SSC, Commerce", school: "N.M High School", time: "2011 – 2013" },
];

const tools = [
  "Rysenova HRIS",
  "Odoo HRMS-ERP",
  "Microsoft 365",
  "Google Workspace",
  "Microsoft Excel",
  "Google Sheets",
];

/* ---------- small hand-drawn marker SVGs (they draw themselves via GSAP) ---------- */
function Scribble({
  d,
  className = "",
  viewBox,
  stroke = "var(--red)",
  width = 5,
}: {
  d: string;
  className?: string;
  viewBox: string;
  stroke?: string;
  width?: number;
}) {
  return (
    <svg viewBox={viewBox} preserveAspectRatio="none" className={className} aria-hidden fill="none">
      <path
        d={d}
        data-draw
        pathLength={1}
        stroke={stroke}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

const CIRCLE = "M30,64 C8,22 118,2 196,22 C262,40 258,98 150,108 C56,116 6,96 24,44 C30,26 60,16 92,12";
const UNDERLINE = "M4,14 C50,5 120,18 180,8 C210,4 236,10 252,6";

/** one headline line inside a reveal mask */
function Line({ children, hero = false }: { children: React.ReactNode; hero?: boolean }) {
  return (
    <span className="mask block">
      <span data-line {...(hero ? { "data-hero-line": true } : {})} className="block">
        {children}
      </span>
    </span>
  );
}

export default function Home() {
  return (
    <>
      <Preloader />
      <Motion />

      {/* MASTHEAD / MENU */}
      <header className="sticky top-0 z-40 border-b-[5px] border-double border-ink bg-paper">
        <div
          data-in
          data-mast
          className="mx-auto flex max-w-[88rem] items-center justify-between gap-4 px-4 py-2.5 sm:px-8"
        >
          <a href="#top" className="font-display inline-flex min-h-11 items-center text-3xl leading-none tracking-wide sm:text-4xl">
            M.I. PRANTO
          </a>
          <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
            {nav.map((n) => (
              <a key={n.href} href={n.href} className="nav-link font-display inline-flex min-h-11 items-center text-xl uppercase">
                <span className="relative z-10">{n.label}</span>
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Btn
              href={FACEBOOK}
              external
              label="Hire me"
              tone="red"
              className="hidden min-h-11 [--px:1.1rem] [--py:0.5rem] sm:inline-flex"
            />
            <MobileMenu items={nav} phone={PHONE} phoneLabel={PHONE_DISPLAY} email={EMAIL} />
          </div>
        </div>
      </header>

      <main id="top">
        {/*
          FIRST SCREEN: hero + ticker fill exactly 100dvh together with the header (--hdr is measured live in
          Motion.tsx). dvh follows the phone address bar, so it is right on every device. On narrow screens the
          stacked content is taller than the screen, so this is a minimum height and the content may extend below.
        */}
        <div className="flex min-h-[calc(100dvh-var(--hdr,4.3rem))] flex-col">
        {/* HERO: page-one headline */}
        <section data-hero className="relative flex flex-1 flex-col justify-center overflow-hidden py-8 sm:py-10">
          <div className="halftone pointer-events-none absolute inset-x-0 top-0 h-40 opacity-[0.07]" />
          <div className="mx-auto grid w-full max-w-[88rem] flex-1 grid-rows-[auto_minmax(240px,1fr)] items-center gap-6 px-4 sm:gap-4 sm:px-8 lg:flex-none lg:grid-cols-[1.12fr_0.88fr] lg:grid-rows-1">
            <div className="relative min-w-0 pb-6" data-shake>
              <p
                data-in
                data-hero-in
                className="hero-label font-display mb-5 inline-block border-y-[3px] border-ink py-1 text-base uppercase tracking-[0.18em] sm:mb-5 sm:text-xl"
              >
                Page one · Exclusive report
              </p>

              <h1 className="font-display text-[clamp(2.6rem,min(13vw,8dvh),6.5rem)] uppercase leading-[1.08] sm:leading-[0.96] sm:text-[clamp(3rem,min(12vw,7.5dvh),6.5rem)] lg:text-[clamp(3.4rem,min(6.6vw,10.5dvh),7rem)] lg:leading-[0.92]">
                <Line hero>HR guy writes</Line>
                <Line hero>rulebook for</Line>
                <Line hero>
                  <span className="relative inline-block">
                    <span className="text-red">150+</span>
                    <Scribble
                      d={CIRCLE}
                      viewBox="0 0 270 120"
                      className="pointer-events-none absolute -inset-x-[14%] -inset-y-[12%] h-[124%] w-[128%]"
                      width={6}
                      stroke="var(--ink)"
                    />
                  </span>{" "}
                  people.
                </Line>
              </h1>

              <p
                data-in
                data-hero-in
                className="hero-lead mt-5 hidden max-w-xl text-lg font-medium leading-snug sm:block sm:text-xl lg:mt-7 lg:text-2xl"
              >
                <span className="font-bold">What happened next:</span> Mohshin Imam Pranto joined
                WPXPO, where he now runs people operations. Read the full story below.
              </p>

              <div
                data-in
                data-hero-in
                className="hero-cta mt-7 grid grid-cols-2 gap-3 sm:mt-9 sm:flex sm:flex-wrap sm:items-center sm:gap-4"
              >
                <Btn href={`mailto:${EMAIL}`} label="Hire Pranto" size="lg" className="w-full max-sm:text-base max-sm:[--px:0.5rem]! max-sm:[--py:0.9rem]! sm:w-auto" />
                <StickDelivery href="/MI-Pranto-Resume.pdf" label="Resume (PDF)" />
              </div>
            </div>

            {/* collage: org chart behind, cut-out portrait in front */}
            <div className="relative mx-auto w-full [container-type:size] max-w-[26rem] self-stretch sm:max-w-[34rem] md:max-w-[40rem] lg:h-[clamp(380px,64dvh,680px)] lg:max-w-[34rem] lg:self-center" data-depth="0">
              <div
                data-in
                data-hero-in
                className="halftone-red absolute inset-x-0 bottom-0 mx-auto aspect-square w-[min(94cqw,88cqh)] rounded-full opacity-70"
                data-depth="-18"
                aria-hidden
              />
              <div data-in data-hero-in className="absolute inset-0" data-depth="-10">
                <HeroScene />
              </div>
              <div
                data-in
                data-cut
                data-depth="22"
                className="pointer-events-none absolute bottom-0 right-[-4%] h-[74%] w-[46%] [clip-path:inset(-24px_-24px_0_-24px)] sm:right-0"
              >
                <Image
                  src="/portrait-cut.png"
                  alt="Mohshin Imam Pranto, smiling with arms crossed"
                  fill
                  priority
                  sizes="(min-width: 1024px) 380px, 60vw"
                  className="object-contain object-bottom [filter:drop-shadow(3px_0_0_#f1eadb)_drop-shadow(-3px_0_0_#f1eadb)_drop-shadow(0_-3px_0_#f1eadb)_drop-shadow(6px_8px_0_rgba(20,20,20,0.9))]"
                />
              </div>

              {/* annotations */}
              <div
                data-in
                data-stamp
                className="font-display pointer-events-none absolute left-[2%] top-[6%] z-10 border-[5px] border-red px-4 py-1 text-3xl uppercase leading-none tracking-wider text-red sm:text-4xl"
              >
                Exclusive
              </div>
            </div>
          </div>
        </section>

        {/* TICKER */}
        <div className="shrink-0 overflow-hidden border-y-[4px] border-ink bg-ink py-3 text-paper" aria-hidden>
          <div data-ticker className="flex w-max">
            {[0, 1].map((k) => (
              <div key={k} className="flex shrink-0 items-center">
                {ticker.map((t) => (
                  <span key={t + k} className="font-display flex items-center text-2xl uppercase sm:text-3xl">
                    <span className="px-7">{t}</span>
                    <span className="text-red">{"//"}</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
        </div>

        {/* ABOUT */}
        <section id="about" className="relative py-20 sm:py-28">
          <div className="mx-auto grid max-w-[88rem] gap-14 px-4 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="relative mx-auto w-full max-w-md self-start">
              <div data-in data-paste>
                <figure className="relative -rotate-[2.5deg] bg-white p-3 pb-5 shadow-[10px_12px_0_rgba(20,20,20,0.85)]">
                  <span className="tape absolute -top-4 left-6 h-7 w-24 -rotate-6" aria-hidden />
                  <span className="tape absolute -right-3 -top-3 h-7 w-20 rotate-[28deg]" aria-hidden />
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image
                      src="/hero.png"
                      alt="Mohshin Imam Pranto in a modern office"
                      fill
                      sizes="(min-width: 1024px) 400px, 90vw"
                      className="object-cover object-[84%_20%]"
                    />
                  </div>
                  <figcaption className="font-hand mt-3 text-center text-lg leading-tight">
                    Pranto, building people who build the company.
                  </figcaption>
                </figure>
              </div>
            </div>

            <div>
              <h2 data-h className="font-display text-[clamp(2.6rem,6.2vw,5.4rem)] uppercase leading-[0.95]">
                <Line>Who&apos;s behind</Line>
                <Line>the spreadsheets?</Line>
              </h2>
              <p className="font-hand mt-4 -rotate-1 text-xl text-red sm:text-2xl">spoiler: a person.</p>

              <p className="mt-8 max-w-2xl text-xl leading-relaxed [&::first-letter]:font-display [&::first-letter]:float-left [&::first-letter]:mr-3 [&::first-letter]:text-[5.2rem] [&::first-letter]:leading-[0.8] [&::first-letter]:text-red">
                A people person with a process brain. Pranto has worked across recruitment,
                onboarding, attendance, payroll inputs, performance and KPI tracking, policy and
                SOP development, and reporting, in software, corporate and factory settings. He
                cares most about accurate records and clear processes that support the business
                and the people in it.
              </p>

              <dl className="mt-12 grid gap-8 border-t-[3px] border-ink pt-8 sm:grid-cols-3">
                {stats.map((s) => (
                  <div key={s.label}>
                    <dt className="relative inline-block">
                      <span
                        data-count={s.n}
                        data-suffix={s.suffix}
                        className="font-display text-[5.5rem] leading-none"
                      >
                        {s.n}
                        {s.suffix}
                      </span>
                      <Scribble
                        d={UNDERLINE}
                        viewBox="0 0 256 20"
                        className="absolute -bottom-1 left-0 h-3 w-full"
                        width={5}
                      />
                    </dt>
                    <dd className="mt-3 text-lg font-semibold leading-snug">{s.label}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* EXPERIENCE */}
        <section id="experience" className="bg-ink py-20 text-paper sm:py-28">
          <div className="mx-auto max-w-[88rem] px-4 sm:px-8">
            <h2 data-h className="font-display text-[clamp(2.6rem,6.2vw,5.4rem)] uppercase leading-[0.95]">
              <Line>5 jobs.</Line>
              <Line>
                All about <span className="text-marker">people.</span>
              </Line>
            </h2>

            <ol className="mt-14">
              {jobs.map((j) => (
                <li key={j.org} data-row className="group relative py-9">
                  <span
                    data-rule
                    className="absolute inset-x-0 top-0 h-[3px] bg-paper/80"
                    aria-hidden
                  />
                  <div className="grid gap-5 lg:grid-cols-[13rem_1fr_1.1fr] lg:gap-10">
                    <p data-in data-row-in className="text-lg font-bold tracking-wide text-marker tabular-nums">
                      {j.time}
                    </p>
                    <div data-in data-row-in>
                      <h3 className="font-display text-4xl uppercase leading-[1] transition-transform duration-300 group-hover:translate-x-2 sm:text-5xl">
                        {j.role}
                      </h3>
                      <p className="mt-2 text-xl font-bold text-red">{j.org}</p>
                    </div>
                    <ul data-in data-row-in className="space-y-2 text-lg leading-snug text-paper/90">
                      {j.points.map((p) => (
                        <li key={p} className="flex gap-3">
                          <span aria-hidden className="mt-2.5 h-[3px] w-4 shrink-0 bg-red" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* SKILLS: a listicle, so the numbers are real */}
        <section id="skills" className="py-20 sm:py-28">
          <div className="mx-auto max-w-[88rem] px-4 sm:px-8">
            <h2 data-h className="font-display text-[clamp(2.6rem,6.2vw,5.4rem)] uppercase leading-[0.95]">
              <Line>6 things i&apos;ll take</Line>
              <Line>off your plate</Line>
            </h2>
            <p className="mt-4 text-xl font-bold text-red sm:text-2xl">
              Number 4 saves the most headaches.
            </p>

            <ol className="mt-14 grid gap-x-16 gap-y-12 md:grid-cols-2">
              {skills.map((s, i) => (
                <li key={s.title} data-in data-paste className="flex gap-6 border-t-[3px] border-ink pt-6">
                  <span className="font-display w-[3.25rem] shrink-0 text-[5.5rem] leading-[0.8] text-red sm:w-[4.25rem]">{i + 1}</span>
                  <div>
                    <h3 className="font-display text-3xl uppercase leading-none sm:text-4xl">
                      {s.title}
                    </h3>
                    <p className="mt-3 max-w-md text-lg leading-snug">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* EDUCATION + TOOLS: classified ads */}
        <section className="border-y-[4px] border-ink bg-paper-dark py-20 sm:py-24">
          <div className="mx-auto grid max-w-[88rem] gap-14 px-4 sm:px-8 lg:grid-cols-2">
            <div data-in data-paste>
              <h2 className="font-display text-5xl uppercase leading-none">School records</h2>
              <ul className="mt-6 border-[3px] border-dashed border-ink">
                {education.map((e) => (
                  <li
                    key={e.degree}
                    className="flex flex-col gap-1 border-b-[3px] border-dashed border-ink px-5 py-4 last:border-b-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-x-6"
                  >
                    <div>
                      <p className="font-display text-2xl uppercase leading-none">{e.degree}</p>
                      <p className="mt-1 font-medium">{e.school}</p>
                    </div>
                    <p className="text-base font-bold tracking-wide text-red tabular-nums">{e.time}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div data-in data-paste>
              <h2 className="font-display text-5xl uppercase leading-none">Tools of the trade</h2>
              <ul className="mt-6 flex flex-wrap gap-x-3 gap-y-3 border-[3px] border-dashed border-ink p-6">
                {tools.map((t, i) => (
                  <li key={t} className="font-display flex items-center gap-3 text-2xl uppercase">
                    {t}
                    {i < tools.length - 1 && <span className="text-red">/</span>}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="relative overflow-hidden bg-red py-20 text-paper sm:py-28">
          <div className="halftone pointer-events-none absolute inset-0 opacity-[0.09]" />
          <div className="relative mx-auto max-w-[88rem] px-4 sm:px-8">
            <p className="font-hand text-2xl text-marker sm:text-3xl">don&apos;t scroll past this.</p>
            <h2
              data-big
              className="font-display mt-3 text-[clamp(4rem,19vw,15rem)] uppercase leading-[0.88] sm:whitespace-nowrap sm:text-[clamp(4.5rem,17vw,15rem)]"
            >
              Talk to me.
            </h2>

            <div className="mt-12 grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-end">
              <div>
                <a
                  href={`mailto:${EMAIL}`}
                  className="font-display flex min-h-11 items-center text-[clamp(1.5rem,3.3vw,3rem)] leading-tight underline decoration-[5px] underline-offset-[8px] transition-colors [overflow-wrap:anywhere] hover:text-marker"
                >
                  {EMAIL}
                </a>
                <p className="mt-4 text-xl font-semibold">
                  <a
                    href={`tel:${PHONE}`}
                    className="inline-flex min-h-11 items-center underline decoration-2 underline-offset-4 hover:text-marker"
                    aria-label={`Call ${PHONE_DISPLAY}`}
                  >
                    {PHONE_DISPLAY}
                  </a>{" "}
                  · Mohammadpur, Dhaka, Bangladesh
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap lg:justify-end">
                <Btn href={`tel:${PHONE}`} label="Call now" tone="ink" size="lg" className="w-full sm:w-auto" />
                <Btn href={`mailto:${EMAIL}`} label="Send an email" tone="paper" size="lg" className="w-full sm:w-auto" />
                <Btn href={LINKEDIN} label="LinkedIn" tone="paper" size="lg" external className="w-full sm:w-auto" />
              </div>
            </div>
          </div>
        </section>

        <footer className="bg-ink py-6 text-paper"><div className="mx-auto max-w-[88rem] px-4 sm:px-8">
          <div className="flex flex-col items-center justify-between gap-1 text-center text-base sm:flex-row sm:text-left">
            <p className="text-paper/80">© 2026 Mohshin Imam Pranto. All rules reserved.</p>
            <a
              href={`tel:${PHONE}`}
              aria-label={`Call ${PHONE_DISPLAY}`}
              className="inline-flex min-h-11 items-center font-extrabold underline decoration-2 underline-offset-4 hover:text-marker"
            >
              Call {PHONE_DISPLAY}
            </a>
          </div>
          <p className="mt-3 border-t border-paper/20 pt-3 text-center text-sm text-paper/70">
            Designed and developed by{" "}
            {/* No rel="nofollow": this is a normal, followable (dofollow) link. */}
            <a
              href="https://bestwebexpert.com/"
              target="_blank"
              rel="noopener"
              className="inline-flex min-h-11 items-center font-extrabold text-paper underline decoration-2 underline-offset-4 hover:text-marker"
            >
              Best Web Expert
            </a>
          </p>
        </div></footer>
      </main>
    </>
  );
}
