"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main" className="bespoke">
      <p className="eyebrow">SAINT-FRISON TEXTILES</p>
      <h1 className="serif" style={{ fontSize: 48, margin: "30px 0" }}>
        Une interruption passagère.
      </h1>
      <p>
        Le contenu n’a pas pu être chargé. Vous pouvez réessayer dans un
        instant.
      </p>
      <button className="text-link" onClick={reset}>
        Réessayer <span>↗</span>
      </button>
    </main>
  );
}
