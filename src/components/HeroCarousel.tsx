"use client";

import { useEffect, useState, useRef } from "react";

const images = [
  { src: "/banner1.jpg", alt: "Khuyến mãi banner 1" },
  { src: "/banner2.jpg", alt: "Khuyến mãi banner 2" },
  { src: "/banner3.png", alt: "Khuyến mãi banner 3" },
];

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    timer.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 5000);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, []);

  const goto = (i: number) => setIndex(i);
  const next = () => goto((index + 1) % images.length);
  const prev = () => goto((index - 1 + images.length) % images.length);

  return (
    <section className="relative rounded-2xl overflow-hidden border border-black/[.08] dark:border-white/[.145] bg-background">
      <div className="relative aspect-[16/9] sm:aspect-[21/9]">
        {images.map((img, i) => (
          <img
            key={img.src}
            src={img.src}
            alt={img.alt}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${i === index ? "opacity-100" : "opacity-0"}`}
            loading={i === 0 ? "eager" : "lazy"}
          />
        ))}
      </div>
      <button aria-label="Trước" onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 text-white px-2 py-1 text-sm hover:bg-black/60">‹</button>
      <button aria-label="Sau" onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 text-white px-2 py-1 text-sm hover:bg-black/60">›</button>
      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => goto(i)}
            aria-label={`Chuyển đến banner ${i + 1}`}
            className={`h-2 w-2 rounded-full ${i === index ? "bg-white" : "bg-white/50"}`}
          />
        ))}
      </div>
    </section>
  );
}
