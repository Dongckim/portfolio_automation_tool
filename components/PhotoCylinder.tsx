"use client";

import Image from "next/image";
import { useRef, useState } from "react";

interface PhotoCylinderProps {
  images: string[];
}

const labels = [
  "Reality Hack",
  "Prototype",
  "Demo day",
  "In the field",
  "XR exploration",
  "Building together",
  "Campus",
  "Spatial computing",
  "The team",
];

// Mirrors highlightImages: four Reality Hack landscapes, then the personal photos.
const photoRatios = [
  16 / 9,
  1870 / 1110,
  16 / 9,
  16 / 9,
  1888 / 1549,
  4095 / 2730,
  2039 / 1795,
  3024 / 4032,
  5472 / 3648,
];

const circularDistance = (index: number, activeIndex: number, length: number) => {
  let distance = index - activeIndex;
  if (distance > length / 2) distance -= length;
  if (distance < -length / 2) distance += length;
  return distance;
};

export default function PhotoCylinder({ images }: PhotoCylinderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const dragStart = useRef<number | null>(null);
  const activeAtDragStart = useRef(0);
  const hasDragged = useRef(false);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    dragStart.current = event.clientX;
    activeAtDragStart.current = activeIndex;
    hasDragged.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragStart.current === null) return;
    const distance = event.clientX - dragStart.current;
    if (Math.abs(distance) > 4) hasDragged.current = true;
    setDragOffset(distance);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragStart.current === null) return;
    const distance = event.clientX - dragStart.current;
    const cardShift = Math.round(distance / 150);
    const nextIndex = (activeAtDragStart.current - cardShift + images.length) % images.length;
    setActiveIndex(nextIndex);
    setDragOffset(0);
    dragStart.current = null;
  };

  return (
    <section className="mt-4 overflow-hidden bg-surface py-14 text-textPrimary md:mt-6 md:py-20">
      <div
        className="relative mx-auto h-[400px] w-full max-w-6xl cursor-grab select-none touch-pan-y active:cursor-grabbing md:h-[510px]"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onDragStart={(event) => event.preventDefault()}
      >
        {images.map((src, index) => {
          const distance = circularDistance(index, activeIndex, images.length);
          const isVisible = Math.abs(distance) <= 2;
          const isActive = distance === 0;
          const translateX = distance * 255 + dragOffset;
          const rotation = distance * 13;
          const scale = isActive ? 1 : Math.max(0.68, 0.88 - Math.abs(distance) * 0.1);

          return (
            <button
              key={src}
              type="button"
              aria-label={`View ${labels[index] ?? `photo ${index + 1}`}`}
              onClick={() => {
                if (!hasDragged.current) setActiveIndex(index);
              }}
              onDragStart={(event) => event.preventDefault()}
              className="absolute left-1/2 top-0 h-[300px] max-w-[82vw] -translate-x-1/2 overflow-hidden rounded-[26px] border border-border bg-muted text-left shadow-[0_20px_60px_rgba(0,0,0,0.2)] outline-none transition-[transform,opacity,filter] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:ring-2 focus-visible:ring-accent md:h-[400px] md:max-w-none"
              style={{
                transform: `translateX(calc(-50% + ${translateX}px)) rotate(${rotation}deg) scale(${scale})`,
                aspectRatio: photoRatios[index] ?? 4 / 3,
                opacity: isVisible ? (isActive ? 1 : 0.62) : 0,
                filter: isActive ? "none" : "brightness(0.72)",
                pointerEvents: isVisible ? "auto" : "none",
                zIndex: 10 - Math.abs(distance),
              }}
            >
              <Image
                src={src}
                alt={labels[index] ?? `Portfolio moment ${index + 1}`}
                fill
                sizes="(max-width: 767px) 82vw, 720px"
                className="object-cover"
                draggable={false}
                priority={index < 2}
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent px-5 pb-5 pt-16">
                <span className="text-sm font-medium tracking-[-0.02em]">{labels[index] ?? "Moment"}</span>
              </div>
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-center text-xs font-medium uppercase tracking-[0.22em] text-textSecondary">
        Drag to explore
      </p>
    </section>
  );
}
