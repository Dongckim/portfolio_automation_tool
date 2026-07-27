"use client";

import { useEffect, useState } from "react";

const phrases = ["the next interface.", "human moments.", "the reality.", "what matters."];

export default function HeroTagline() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [typedPhrase, setTypedPhrase] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const phrase = phrases[phraseIndex];
    const isComplete = typedPhrase === phrase;
    const delay = isComplete && !isDeleting ? 1500 : isDeleting ? 32 : 55;

    const timer = window.setTimeout(() => {
      if (!isDeleting && typedPhrase.length < phrase.length) {
        setTypedPhrase(phrase.slice(0, typedPhrase.length + 1));
      } else if (!isDeleting) {
        setIsDeleting(true);
      } else if (typedPhrase.length > 0) {
        setTypedPhrase((current) => current.slice(0, -1));
      } else {
        setPhraseIndex((current) => (current + 1) % phrases.length);
        setIsDeleting(false);
      }
    }, delay);

    return () => window.clearTimeout(timer);
  }, [isDeleting, phraseIndex, typedPhrase]);

  return (
    <h2 className="mb-5 min-h-[3.5rem] text-2xl font-semibold leading-tight tracking-[-0.04em] text-textPrimary md:min-h-0 md:text-3xl">
      I build for{" "}
      <span className="inline-block min-w-[18.5ch] whitespace-nowrap text-accent md:min-w-0">
        {typedPhrase}
        <span aria-hidden className="ml-0.5 inline-block h-[0.85em] w-[2px] animate-pulse bg-accent align-[-0.08em]" />
      </span>
    </h2>
  );
}
