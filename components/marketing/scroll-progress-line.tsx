"use client";

import * as React from "react";
import { useTranslations } from "next-intl";

export function ScrollProgressLine() {
  const t = useTranslations("Nav");
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    function update() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const cur = window.scrollY;
      setProgress(max > 0 ? Math.min(1, Math.max(0, cur / max)) : 0);
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      className="scroll-progress"
      role="progressbar"
      aria-label={t("scrollProgress")}
      aria-valuenow={Math.round(progress * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      style={{ transform: `scaleX(${progress})` }}
    />
  );
}
