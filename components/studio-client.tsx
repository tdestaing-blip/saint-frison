"use client";
import dynamic from "next/dynamic";

const StudioContent = dynamic(() => import("./studio-content"), {
  ssr: false,
  loading: () => <p role="status">Chargement de l’atelier…</p>,
});

export default function StudioClient() {
  return <StudioContent />;
}
