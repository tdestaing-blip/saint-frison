"use client";
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "./ui/carousel";
import { Photo } from "./photo";
import type { Media } from "@/lib/types";
export function ProductGallery({
  images,
  title,
}: {
  images: Media[];
  title: string;
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    if (!api) return;
    const update = () => setCurrent(api.selectedScrollSnap());
    update();
    api.on("select", update);
    api.on("reInit", update);
    return () => {
      api.off("select", update);
      api.off("reInit", update);
    };
  }, [api]);
  if (!images.length) return null;
  return (
    <Carousel
      setApi={setApi}
      opts={{ loop: false, duration: 0 }}
      className="product-gallery"
      aria-label={"Photographies — " + title}
      tabIndex={0}
    >
      <CarouselContent className="ml-0">
        {images.map((media, i) => (
          <CarouselItem
            className="pl-0"
            key={media.src}
            aria-label={"Vue " + (i + 1) + " sur " + images.length}
          >
            <figure className="product-view">
              <Photo media={media} fullView priority={i === 0} />
              <figcaption>
                {media.alt}
                {media.credit && <span>Photo : {media.credit}</span>}
              </figcaption>
            </figure>
          </CarouselItem>
        ))}
      </CarouselContent>
      {images.length > 1 && (
        <>
          <div className="gallery-controls">
            <button
              type="button"
              onClick={() => api?.scrollPrev()}
              disabled={current === 0}
              aria-label="Photo précédente"
            >
              ←
            </button>
            <p role="status" aria-live="polite">
              {current + 1} / {images.length}
            </p>
            <button
              type="button"
              onClick={() => api?.scrollNext()}
              disabled={current === images.length - 1}
              aria-label="Photo suivante"
            >
              →
            </button>
          </div>
          <div
            className="gallery-thumbnails"
            aria-label="Choisir une photographie"
          >
            {images.map((media, i) => (
              <button
                type="button"
                key={media.src}
                onClick={() => api?.scrollTo(i)}
                aria-label={"Afficher la vue " + (i + 1) + " — " + media.alt}
                aria-pressed={current === i}
              >
                <Photo media={media} fullView sizes="80px" />
              </button>
            ))}
          </div>
        </>
      )}
    </Carousel>
  );
}
