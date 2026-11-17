export function Logo({ height = 26 }: { height?: number }) {
  return (
    <>
      <img
        className="logo logo--on-dark"
        src="/logos/spotter-logo-oscuro.svg"
        alt="Spotter"
        height={height}
      />
      <img
        className="logo logo--on-light"
        src="/logos/spotter-logo-claro.svg"
        alt=""
        aria-hidden="true"
        height={height}
      />
    </>
  );
}
