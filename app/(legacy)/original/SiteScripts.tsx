"use client";

import { useEffect } from "react";
import scripts from "@/content/scripts.json";

type ScriptDef = { attrs: Record<string, string>; code: string };

let started = false;

// Inject one <script>, resolving when it has executed (external) or immediately (inline).
function inject(def: ScriptDef): Promise<void> {
  return new Promise((resolve) => {
    const s = document.createElement("script");
    for (const [k, v] of Object.entries(def.attrs)) s.setAttribute(k, v);
    const src = def.attrs.src;
    if (!src) {
      s.text = def.code;
      document.body.appendChild(s);
      resolve();
      return;
    }
    const isAsync = "async" in def.attrs || "defer" in def.attrs;
    s.async = false;
    s.onload = () => resolve();
    s.onerror = () => resolve();
    document.body.appendChild(s);
    if (isAsync) resolve();
  });
}

/**
 * Runs the original WordPress/Elementor/theme scripts in their original order,
 * after React has hydrated, then replays DOMContentLoaded/load so handlers that
 * wait for those events (preloader, lazy backgrounds, animations) run exactly
 * as on the original site.
 */
export default function SiteScripts() {
  useEffect(() => {
    if (started) return;
    started = true;
    (async () => {
      for (const def of scripts as ScriptDef[]) {
        await inject(def);
      }
      document.dispatchEvent(new Event("DOMContentLoaded", { bubbles: true }));
      // jQuery runs ready-callbacks asynchronously once the document is already
      // complete; theme code binds its window "load" handlers inside those
      // callbacks, so wait for ready (plus a tick) before replaying "load".
      const jq = (window as unknown as { jQuery?: (fn: () => void) => void }).jQuery;
      if (jq) await new Promise<void>((r) => jq(() => setTimeout(r, 0)));
      window.dispatchEvent(new Event("load"));
    })();
  }, []);
  return null;
}
