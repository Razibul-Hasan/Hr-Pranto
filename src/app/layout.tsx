import type { Metadata, Viewport } from "next";
import { Anton, Archivo, Patrick_Hand } from "next/font/google";
import "./globals.css";

const display = Anton({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

const marker = Patrick_Hand({
  variable: "--font-marker",
  subsets: ["latin"],
  weight: "400",
});

const body = Archivo({
  variable: "--font-body",
  subsets: ["latin"],
});

// Set NEXT_PUBLIC_SITE_URL to the final domain; on Netlify (URL) and Vercel the site URL is picked up automatically.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.URL ?? // Netlify: the primary site URL
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

const TITLE = "Mohshin Imam Pranto | HR Generalist in Dhaka, Bangladesh";
const DESCRIPTION =
  "HR Generalist in Dhaka with 3+ years in recruitment, onboarding, payroll inputs, KPI tracking and HR policy and SOP development. Currently at WPXPO.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: TITLE, template: "%s | Mohshin Imam Pranto" },
  description: DESCRIPTION,
  applicationName: "Mohshin Imam Pranto",
  keywords: [
    "Mohshin Imam Pranto",
    "HR Generalist",
    "HR Generalist Dhaka",
    "HR professional Bangladesh",
    "People & Culture",
    "recruitment",
    "onboarding",
    "payroll inputs",
    "KPI tracking",
    "HR policy",
    "SOP development",
    "ISO QMS EMS",
    "HR operations",
    "WPXPO",
  ],
  authors: [{ name: "Mohshin Imam Pranto" }],
  creator: "Mohshin Imam Pranto",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Mohshin Imam Pranto",
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_US",
    // 1200x630 (1.91:1) is the size Facebook, LinkedIn, WhatsApp, X and Slack all display best.
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "Mohshin Imam Pranto, HR Generalist in Dhaka. Page-one headline: HR guy writes rulebook for 150+ people.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Mohshin Imam Pranto, HR Generalist in Dhaka.",
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#f1eadb",
  width: "device-width",
  initialScale: 1,
};

// Structured data so search engines understand who this page is about.
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Mohshin Imam Pranto",
  jobTitle: "HR Generalist, People & Culture",
  description: DESCRIPTION,
  worksFor: { "@type": "Organization", name: "WPXPO" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "Stamford University Bangladesh" },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Dhaka",
    addressCountry: "BD",
  },
  email: "mailto:mohshinimampranto@gmail.com",
  telephone: "+8801622710529",
  knowsAbout: [
    "Recruitment",
    "Onboarding",
    "Payroll processing",
    "KPI tracking",
    "HR policy and SOP development",
    "ISO QMS and EMS",
  ],
  sameAs: ["https://www.linkedin.com/in/mohshin-imam-pranto-982343247"],
};

// Adds the animation-ready class before first paint, unless the visitor prefers reduced motion.
// It also locks scrolling while the loading screen shows, with a hard failsafe so a visitor can never get stuck.
const gate = `try{var d=document.documentElement;if(!matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('js-anim','is-loading');setTimeout(function(){d.classList.remove('is-loading');d.classList.add('preloader-timeout')},9000)}}catch(e){}`;

// Security extensions (Bitdefender TrafficLight and similar) stamp `bis_skin_checked` on every <div>
// before React hydrates, which React reports as a hydration mismatch. This runs first, strips only
// that marker as it appears, and stops watching after 9s so it never fights the extension for long.
// (suppressHydrationWarning only covers a single element, so it cannot handle this on its own.)
const extensionGuard = `try{var s=document.querySelectorAll('[bis_skin_checked]');for(var j=0;j<s.length;j++)s[j].removeAttribute('bis_skin_checked');var o=new MutationObserver(function(l){for(var i=0;i<l.length;i++){if(l[i].attributeName==='bis_skin_checked')l[i].target.removeAttribute('bis_skin_checked')}});o.observe(document,{attributes:true,subtree:true,attributeFilter:['bis_skin_checked']});setTimeout(function(){o.disconnect()},9000)}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${marker.variable} ${body.variable}`}
      suppressHydrationWarning
    >
      {/* Extensions (Grammarly, Bitdefender, etc.) inject attributes into <body> before React loads. */}
      <body suppressHydrationWarning>
        {/*
          These two tiny inline scripts live at the very top of <body>, not in <head>: extensions inject
          their own <script> tags at the start of <head>, which shifts React's position-based matching and
          triggers a hydration error. As the first body children they still run before anything paints.
        */}
        <script dangerouslySetInnerHTML={{ __html: extensionGuard }} />
        <script dangerouslySetInnerHTML={{ __html: gate }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
