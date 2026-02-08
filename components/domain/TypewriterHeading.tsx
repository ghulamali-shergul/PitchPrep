"use client";

import { useState, useEffect } from "react";

const FULL_TEXT = "Walk into every booth ";
const HIGHLIGHT_TEXT = "with confidence";

export default function TypewriterHeading() {
  const [displayed, setDisplayed] = useState("");
  const [highlightDisplayed, setHighlightDisplayed] = useState("");
  const [phase, setPhase] = useState<"main" | "highlight" | "done">("main");

  useEffect(() => {
    if (phase === "main") {
      if (displayed.length < FULL_TEXT.length) {
        const timeout = setTimeout(() => {
          setDisplayed(FULL_TEXT.slice(0, displayed.length + 1));
        }, 45);
        return () => clearTimeout(timeout);
      } else {
        setPhase("highlight");
      }
    } else if (phase === "highlight") {
      if (highlightDisplayed.length < HIGHLIGHT_TEXT.length) {
        const timeout = setTimeout(() => {
          setHighlightDisplayed(HIGHLIGHT_TEXT.slice(0, highlightDisplayed.length + 1));
        }, 45);
        return () => clearTimeout(timeout);
      } else {
        setPhase("done");
      }
    }
  }, [displayed, highlightDisplayed, phase]);

  return (
    <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
      {displayed}
      {phase === "highlight" || phase === "done" ? (
        <span className="text-primary">{highlightDisplayed}</span>
      ) : null}
      {phase !== "done" && (
        <span className="inline-block w-[3px] h-[1em] bg-foreground align-middle ml-0.5 animate-blink" />
      )}
    </h1>
  );
}
