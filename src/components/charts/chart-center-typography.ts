export const chartCenterContainerClassName =
  "@container/chart-center size-full min-w-0";

/** Primary stat — ~22% of center width, clamped between text-sm and text-3xl. */
export const chartCenterValueClassName =
  "font-bold tabular-nums leading-none text-[clamp(0.75rem,22cqw,1.875rem)]";

/** Supporting label — ~9% of center width, clamped between 10px and text-xs. */
// Aangepast na `shadcn add @bklit/…`: het label onder het getal in taart, ring en meter minstens 12 px (was 10 px,
// onder de leesbare ondergrens voor tekst die iets uitlegt).
export const chartCenterLabelClassName =
  "max-w-full truncate leading-tight text-[clamp(0.75rem,9cqw,0.875rem)]";
