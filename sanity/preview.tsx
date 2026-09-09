"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "next-sanity";
import { VisualEditing } from "next-sanity/visual-editing";
export function Preview({
  projectId,
  dataset,
}: {
  projectId: string;
  dataset: string;
}) {
  const router = useRouter();
  useEffect(() => {
    const c = createClient({
      projectId,
      dataset,
      apiVersion: "2026-03-01",
      useCdn: false,
      withCredentials: true,
    });
    let timer: ReturnType<typeof setTimeout>;
    const sub = c
      .listen('*[!(_type in path("system.**"))]', {}, { includeResult: false })
      .subscribe(() => {
        clearTimeout(timer);
        timer = setTimeout(() => router.refresh(), 400);
      });
    return () => {
      clearTimeout(timer);
      sub.unsubscribe();
    };
  }, [projectId, dataset, router]);
  return (
    <>
      <div className="preview-bar">
        Aperçu des brouillons{" "}
        <a href="/api/draft-mode/disable">Quitter l’aperçu ↗</a>
      </div>
      <VisualEditing />
    </>
  );
}
