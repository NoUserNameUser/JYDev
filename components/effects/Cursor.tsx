"use client";

import { useEffect } from "react";

export function Cursor() {
  useEffect(() => {
    const cd = document.getElementById("cd") as HTMLDivElement;
    const cr = document.getElementById("cr") as HTMLDivElement;
    const threadDot = document.getElementById("thread-dot") as HTMLDivElement;
    if (!cd || !cr || !threadDot) return;

    let mx = 0;
    let my = 0;
    let rx = 0;
    let ry = 0;
    let rafId: number;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };
    document.addEventListener("mousemove", onMove);

    const loop = () => {
      rx += (mx - rx) * 0.1;
      ry += (my - ry) * 0.1;
      cd.style.left = `${mx}px`;
      cd.style.top = `${my}px`;
      cr.style.left = `${rx}px`;
      cr.style.top = `${ry}px`;
      rafId = requestAnimationFrame(loop);
    };
    loop();

    const onScroll = () => {
      const total = document.body.scrollHeight - window.innerHeight;
      if (total <= 0) return;
      const pct = window.scrollY / total;
      threadDot.style.top = `${pct * 100}vh`;

      const hint = document.getElementById("scroll-hint");
      if (hint) hint.style.opacity = String(Math.max(0, 1 - window.scrollY / 80));
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const attached = new WeakSet<Element>();
    const attachInteractive = () => {
      document.querySelectorAll("a, button").forEach((el) => {
        if (attached.has(el)) return;
        attached.add(el);
        el.addEventListener("mouseenter", () => document.body.classList.add("cursor-hl"));
        el.addEventListener("mouseleave", () => document.body.classList.remove("cursor-hl"));
      });
    };
    attachInteractive();

    const magnetized = new WeakSet<Element>();
    const attachMagnet = () => {
      document.querySelectorAll("[data-magnet]").forEach((el) => {
        if (magnetized.has(el)) return;
        magnetized.add(el);
        const btn = el as HTMLElement;

        const onMagnetMove = (e: MouseEvent) => {
          const r = btn.getBoundingClientRect();
          const x = (e.clientX - r.left - r.width / 2) * 0.3;
          const y = (e.clientY - r.top - r.height / 2) * 0.4;
          btn.style.transform = `translate(${x}px, ${y}px)`;
        };

        const onMagnetLeave = () => {
          btn.style.transform = "";
        };

        btn.addEventListener("mousemove", onMagnetMove);
        btn.addEventListener("mouseleave", onMagnetLeave);
      });
    };
    attachMagnet();

    const mo = new MutationObserver(() => {
      attachInteractive();
      attachMagnet();
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
      mo.disconnect();
    };
  }, []);

  return (
    <>
      <div id="cd" />
      <div id="cr" />
      <div id="thread" />
      <div id="thread-dot" />
    </>
  );
}
