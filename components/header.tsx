"use client";
import Link from "@/components/site-link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
const links = [
  ["Textiles", "/textiles"],
  ["Luminaires", "/lighting"],
  ["Projets", "/projects"],
  ["Le studio", "/about"],
  ["Contact", "/contact"],
];
export function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  if (path.startsWith("/studio")) return null;
  return (
    <header className={"site-header " + (path === "/" ? "over-hero" : "")}>
      <Link
        className="brand"
        href="/"
        aria-label="Saint-Frison Textiles — Accueil"
      >
        <img
          src={"/images/wordmark.png"}
          alt="Saint-Frison Textiles"
          width="190"
          height="16"
        />
        <span className="brand-descriptor">TEXTILES</span>
      </Link>
      <nav className="desktop-nav" aria-label="Navigation principale">
        {links.map(([label, url]) => (
          <Link
            key={url}
            href={url}
            aria-current={path.startsWith(url) ? "page" : undefined}
          >
            {label}
          </Link>
        ))}
      </nav>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="menu-trigger">
          Menu <span>☰</span>
        </DialogTrigger>
        <DialogContent
          className="mobile-menu translate-x-0 translate-y-0"
          aria-describedby={undefined}
          showCloseButton={false}
        >
          <div className="menu-heading">
            <DialogTitle>Saint-Frison Textiles</DialogTitle>
            <DialogClose>Fermer ×</DialogClose>
          </div>
          <nav aria-label="Navigation mobile">
            {links.map(([label, url], i) => (
              <Link key={url} href={url}>
                <small>0{i + 1}</small>
                {label}
              </Link>
            ))}
          </nav>
          <p>
            Saint-Ouen / Paris
            <br />À l’atelier, sur rendez-vous.
          </p>
        </DialogContent>
      </Dialog>
    </header>
  );
}
