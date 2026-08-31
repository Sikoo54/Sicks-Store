// SICKS wordmark: cobalt lightning bolt + uppercase name, two sizes.
interface LogoProps {
  size?: "sm" | "lg";
  light?: boolean;
}

export default function Logo({ size = "sm", light = true }: LogoProps) {
  const box = size === "lg" ? "h-9 w-9" : "h-6 w-6";
  const word = size === "lg" ? "text-4xl" : "text-2xl";

  return (
    <span className="flex items-center gap-2">
      <span className={`${box} relative grid place-items-center bg-cobalt`}>
        <svg
          viewBox="0 0 24 24"
          aria-hidden
          className={`h-[60%] w-[60%] ${light ? "text-white" : "text-ink"}`}
          fill="currentColor"
        >
          <path d="M13.5 2 5 13.5h5L10.5 22 19 10.5h-5L13.5 2Z" />
        </svg>
        <span
          className={`absolute -right-1 -top-1 h-2 w-2 bg-orange ${
            size === "lg" ? "h-3 w-3" : ""
          }`}
        />
      </span>
      <span
        className={`font-display font-bold uppercase leading-none tracking-tight ${word} ${
          light ? "text-chalk" : "text-ink"
        }`}
      >
        SICKS
      </span>
    </span>
  );
}
