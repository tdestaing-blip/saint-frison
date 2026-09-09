"use client";
import Link from "next/link";
import { useState, useRef } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
const types = [
  "Sur mesure",
  "Textile",
  "Pièce",
  "Rendez-vous",
  "Collaboration",
  "Presse / autre",
];
export function ContactForm({
  reference = "",
  source = "",
  initialType = "",
  email,
}: {
  reference?: string;
  source?: string;
  initialType?: string;
  email?: string;
}) {
  const [type, setType] = useState(
    types.includes(initialType) ? initialType : "Sur mesure",
  );
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "success" | "error">(
    "idle",
  );
  const [error, setError] = useState("");
  const id = useRef<string>("");
  async function submit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!consent) {
      setError(
        "Merci d’accepter l’utilisation de vos coordonnées pour répondre à votre demande.",
      );
      setState("error");
      return;
    }
    const form = new FormData(event.currentTarget);
    if (!id.current) id.current = crypto.randomUUID();
    setState("sending");
    const utm = new URLSearchParams(window.location.search);
    const campaign = Array.from(utm.entries()).filter(([k]) =>
      k.startsWith("utm_"),
    );
    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...Object.fromEntries(form),
          id: id.current,
          type,
          reference,
          sourceUrl: source || document.referrer || "/contact",
          utm: new URLSearchParams(campaign).toString(),
          consent,
        }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok)
        throw new Error(result.error || "L’envoi n’a pas abouti.");
      setState("success");
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "L’envoi n’a pas abouti. Réessayez.",
      );
      setState("error");
    }
  }
  if (state === "success")
    return (
      <div className="form-success" role="status">
        <span>✓</span>
        <h2>
          La conversation
          <br />
          <em>est ouverte.</em>
        </h2>
        <p>
          Merci. Votre demande a bien été enregistrée par le studio. Nous
          reviendrons vers vous par email.
        </p>
        <Link className="text-link" href="/textiles">
          Continuer la découverte <span>↗</span>
        </Link>
      </div>
    );
  return (
    <form className="contact-form" onSubmit={submit}>
      {reference && (
        <p className="reference-note">
          À propos de <strong>{reference}</strong>
        </p>
      )}
      <div className="form-field">
        <label id="enquiry-label">Votre demande</label>
        <Select value={type} onValueChange={(v) => v && setType(v)}>
          <SelectTrigger
            className="editorial-select"
            aria-labelledby="enquiry-label"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {types.map((t) => (
              <SelectItem value={t} key={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="form-row">
        <div className="form-field">
          <label htmlFor="name">Nom *</label>
          <input
            id="name"
            name="name"
            autoComplete="name"
            required
            minLength={2}
            maxLength={150}
          />
        </div>
        <div className="form-field">
          <label htmlFor="email">Email *</label>
          <input
            id="email"
            name="email"
            autoComplete="email"
            type="email"
            required
            maxLength={254}
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-field">
          <label htmlFor="company">Entreprise / studio</label>
          <input
            id="company"
            name="company"
            autoComplete="organization"
            maxLength={200}
          />
        </div>
        <div className="form-field">
          <label htmlFor="location">Ville / pays</label>
          <input
            id="location"
            name="location"
            autoComplete="address-level2"
            maxLength={200}
          />
        </div>
      </div>
      <div className="form-field">
        <label htmlFor="message">Parlez-nous de votre projet *</label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          minLength={20}
          maxLength={8000}
          placeholder="Une matière, une couleur, un espace à imaginer…"
        />
      </div>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="website">Site web</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="consent">
        <Checkbox
          id="consent"
          checked={consent}
          onCheckedChange={(v) => setConsent(v === true)}
        />
        <label htmlFor="consent">
          J’accepte que mes coordonnées soient utilisées pour répondre à ma
          demande. <a href="/privacy">Confidentialité</a>
        </label>
      </div>
      {error && (
        <p className="form-error" role="alert">
          {error}
          {email && (
            <>
              {" "}
              <a href={"mailto:" + email}>Écrire à {email}</a>
            </>
          )}
        </p>
      )}
      <button
        className="text-link submit-link"
        disabled={state === "sending"}
        type="submit"
      >
        {state === "sending" ? "Envoi en cours…" : "Envoyer ma demande"}{" "}
        <span>↗</span>
      </button>
      <p className="small-note">* Champs obligatoires</p>
    </form>
  );
}
