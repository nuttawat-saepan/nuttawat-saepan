"use client";

import { useEffect } from "react";

// Pages other than home have no loader: clear the data-opening attribute the root layout renders.
export default function ClearOpening() {
  useEffect(() => {
    if (!document.querySelector(".opening")) delete document.documentElement.dataset.opening;
  }, []);
  return null;
}
