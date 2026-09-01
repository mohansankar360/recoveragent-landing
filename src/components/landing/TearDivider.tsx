export function TearDivider({ up = false }: { up?: boolean }) {
  return <div className={up ? "tear-up" : "tear"} aria-hidden="true" />;
}
