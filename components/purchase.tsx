"use client";
import { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import type { Variant } from "@/lib/shopify";
export function Purchase({
  handle,
  variants,
}: {
  handle: string;
  variants: Variant[];
}) {
  const available = variants.filter((v) => v.availableForSale);
  const [selected, setSelected] = useState(available[0]?.id || "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const variant = available.find((v) => v.id === selected);
  async function buy() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handle, variantId: selected }),
      });
      const result = (await res.json()) as {
        error?: string;
        checkoutUrl: string;
      };
      if (!res.ok) throw new Error(result.error || "Paiement indisponible.");
      window.location.assign(result.checkoutUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Une erreur est survenue.");
      setBusy(false);
    }
  }
  return (
    <div className="purchase">
      {variant && (
        <p className="price">
          {new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: variant.price.currencyCode,
          }).format(Number(variant.price.amount))}
        </p>
      )}
      {available.length > 1 && (
        <Select value={selected} onValueChange={(v) => v && setSelected(v)}>
          <SelectTrigger aria-label="Variante de la pièce">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {available.map((v) => (
              <SelectItem key={v.id} value={v.id}>
                {v.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      <button
        disabled={!variant || busy}
        onClick={buy}
        className="purchase-button"
      >
        {busy
          ? "Ouverture du paiement…"
          : variant
            ? "Acquérir cette pièce ↗"
            : "Pièce indisponible"}
      </button>
      <p className="small-note">
        Livraison, taxes éventuelles et conditions précisées au paiement
        sécurisé.
      </p>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
