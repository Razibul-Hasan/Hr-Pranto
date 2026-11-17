type Props = {
  href: string;
  label: string;
  tone?: "ink" | "paper" | "red";
  size?: "md" | "lg";
  download?: boolean;
  external?: boolean;
  className?: string;
};

// Each tone pairs a resting colour with a hover colour that keeps strong contrast.
const tones = {
  ink: "bg-ink text-paper [--hover-bg:var(--marker)] [--hover-text:#141414]",
  paper: "bg-paper text-ink [--hover-bg:var(--red)] [--hover-text:#ffffff]",
  red: "bg-red text-white [--hover-bg:var(--ink)] [--hover-text:#ffffff]",
};

/** Heavy, wide, high-contrast label. Hover only changes colour: the button never moves. */
export default function Btn({
  href,
  label,
  tone = "ink",
  size = "md",
  download,
  external,
  className = "",
}: Props) {
  const pad =
    size === "lg"
      ? ({ ["--py" as string]: "1.15rem", ["--px" as string]: "2.1rem" } as React.CSSProperties)
      : undefined;

  return (
    <a
      href={href}
      download={download}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`btn font-extrabold uppercase tracking-[0.06em] ${tones[tone]} ${
        size === "lg" ? "text-lg sm:text-xl" : "text-base"
      } ${className}`}
      style={pad}
    >
      <span className="btn-label">{label}</span>
    </a>
  );
}
