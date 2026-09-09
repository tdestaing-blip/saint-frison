import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" className="bespoke">
      <p className="eyebrow">404</p>
      <h1
        className="serif"
        style={{ fontSize: "clamp(36px,5vw,68px)", margin: "30px 0" }}
      >
        Un fil à retrouver.
      </h1>
      <p>
        Cette page n’existe pas ou cette pièce n’est plus disponible. Poursuivez
        votre découverte du studio.
      </p>
      <Link className="text-link" href="/textiles">
        Explorer les textiles <span>↗</span>
      </Link>
    </main>
  );
}
