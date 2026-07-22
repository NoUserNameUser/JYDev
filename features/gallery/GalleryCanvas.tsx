"use client";

import { animate, motion, useMotionValue } from "framer-motion";
import type { MotionStyle } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { buildSpiralPositions } from "@/lib/gridSpiral";

import type { GalleryItem } from "./galleryContent";
import styles from "./GalleryCanvas.module.css";
import { ProjectPreview } from "./ProjectPreview";

type CanvasStyle = MotionStyle & {
  "--grid-size": number;
};

type WorkStyle = React.CSSProperties & {
  "--accent": string;
  "--accent-2": string;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const ACTIVE_SECTION_UPDATE_INTERVAL = 140;

const rubberband = (value: number, min: number, max: number) => {
  if (value < min) return min + (value - min) * 0.22;
  if (value > max) return max + (value - max) * 0.22;
  return value;
};

function ItemLink({ item }: { item: GalleryItem }) {
  if (!item.link?.href || !item.link.label) return null;

  return (
    <a
      className={styles.itemLink}
      href={item.link.href}
      onPointerDown={(event) => event.stopPropagation()}
      target={item.link.openInNewTab ? "_blank" : undefined}
      rel={item.link.openInNewTab ? "noreferrer noopener" : undefined}
    >
      {item.link.label} <span aria-hidden>→</span>
    </a>
  );
}

/** One project, presented as artwork inlaid into an accent-tinted panel. */
function WorkCard({ item, index }: { item: GalleryItem; index: number }) {
  return (
    <>
      <header className={styles.workHead}>
        <span className={styles.workIndex}>{String(index + 1).padStart(2, "0")}</span>
        <span className={styles.workCategory}>{item.kicker}</span>
        <span className={styles.workMeta}>{item.meta}</span>
      </header>

      <div className={styles.inlay}>
        <ProjectPreview visual={item.visual} imageUrl={item.imageUrl} imageAlt={item.imageAlt} />
        <span aria-hidden className={styles.inlayBezel} />
      </div>

      <footer className={styles.workFoot}>
        <h2 className={styles.workTitle}>{item.title}</h2>
        {item.body ? <p className={styles.workBody}>{item.body}</p> : null}
        {item.tags.length ? (
          <ul className={styles.tagRow}>
            {item.tags.map((tag, tagIndex) => (
              <li key={`${tag}-${tagIndex}`}>{tag}</li>
            ))}
          </ul>
        ) : null}
        <ItemLink item={item} />
      </footer>
    </>
  );
}

export function GalleryCanvas({ items }: { items: GalleryItem[] }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const sectionCenters = useRef<Map<string, { cx: number; cy: number }>>(new Map());
  const gesture = useRef({
    active: false,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
    lastX: 0,
    lastY: 0,
    lastTime: 0,
    velocityX: 0,
    velocityY: 0,
    distance: 0,
  });
  const activeSectionFrame = useRef<number | null>(null);
  const lastActiveSectionUpdate = useRef(0);
  const activeSectionRef = useRef(items[0]?.id ?? "");
  const lazyUnloadTimers = useRef<Record<string, number>>({});
  const viewportDims = useRef({ w: 0, h: 0 });
  const contentBox = useRef({ left: 0, top: 0, w: 0, h: 0 });
  const minScaleRef = useRef(0.2);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);
  const [activeSection, setActiveSection] = useState(items[0]?.id ?? "");
  const [renderableSectionIds, setRenderableSectionIds] = useState<Set<string>>(
    () => new Set(items[0]?.id ? [items[0].id] : []),
  );
  const [isDragging, setIsDragging] = useState(false);

  const centerSectionId = items[0]?.id;
  const spiralPositions = useMemo(() => buildSpiralPositions(items.length), [items.length]);
  const gridRadius = useMemo(
    () =>
      spiralPositions.length
        ? Math.max(...spiralPositions.map((position) => Math.max(Math.abs(position.col), Math.abs(position.row))))
        : 0,
    [spiralPositions],
  );
  const gridOrigin = gridRadius + 2;
  const gridSize = gridOrigin * 2 - 1;
  const positionedItems = useMemo(
    () =>
      items.map((item, index) => {
        const position = spiralPositions[index] ?? { col: 0, row: 0 };
        return { item, col: position.col + gridOrigin, row: position.row + gridOrigin };
      }),
    [items, spiralPositions, gridOrigin],
  );

  const measureSectionCenters = useCallback(() => {
    const centers = sectionCenters.current;
    centers.clear();
    for (const item of items) {
      const node = sectionRefs.current[item.id];
      if (!node) continue;
      centers.set(item.id, {
        cx: node.offsetLeft + node.offsetWidth / 2,
        cy: node.offsetTop + node.offsetHeight / 2,
      });
    }
  }, [items]);

  // Pan bounds depend on the current zoom. They are computed from the bounding
  // box of the actual cards (not the full grid template, which has empty
  // padding rings): while the scaled content is larger than the viewport it
  // pans with a soft edge padding; once it fits inside, it stays centered.
  const boundsFor = useCallback((s: number) => {
    const { w: vw, h: vh } = viewportDims.current;
    const { left, top, w: cw, h: ch } = contentBox.current;
    const padding = Math.min(80, vw * 0.08);
    const scaledW = cw * s;
    const scaledH = ch * s;
    const centerX = vw / 2 - (left + cw / 2) * s;
    const centerY = vh / 2 - (top + ch / 2) * s;
    const minX = scaledW <= vw ? centerX : vw - padding - (left + cw) * s;
    const maxX = scaledW <= vw ? centerX : padding - left * s;
    const minY = scaledH <= vh ? centerY : vh - padding - (top + ch) * s;
    const maxY = scaledH <= vh ? centerY : padding - top * s;
    return { minX, maxX, minY, maxY };
  }, []);

  const measureContentBox = useCallback(() => {
    let left = Number.POSITIVE_INFINITY;
    let top = Number.POSITIVE_INFINITY;
    let right = Number.NEGATIVE_INFINITY;
    let bottom = Number.NEGATIVE_INFINITY;
    for (const item of items) {
      const node = sectionRefs.current[item.id];
      if (!node) continue;
      left = Math.min(left, node.offsetLeft);
      top = Math.min(top, node.offsetTop);
      right = Math.max(right, node.offsetLeft + node.offsetWidth);
      bottom = Math.max(bottom, node.offsetTop + node.offsetHeight);
    }
    if (Number.isFinite(left)) {
      contentBox.current = { left, top, w: right - left, h: bottom - top };
    }
  }, [items]);

  // Refresh viewport/content dimensions and the fit-all minimum scale. Kept
  // side-effect free (does not touch x/y/scale) so it is safe to call right
  // before a zoom or drag without a ResizeObserver having fired yet.
  const refreshDims = useCallback(() => {
    const viewport = viewportRef.current;
    const canvas = canvasRef.current;
    if (!viewport || !canvas) return;

    viewportDims.current = { w: viewport.clientWidth, h: viewport.clientHeight };
    measureContentBox();

    const { w: cw, h: ch } = contentBox.current;
    if (cw > 0 && ch > 0) {
      // Leave a small margin so the fit-all view does not touch the edges.
      minScaleRef.current = clamp(
        Math.min(viewportDims.current.w / cw, viewportDims.current.h / ch) * 0.94,
        0.05,
        1,
      );
    }
  }, [measureContentBox]);

  const measure = useCallback(() => {
    refreshDims();
    if (!viewportRef.current) return;

    const s = clamp(scale.get(), minScaleRef.current, 1);
    if (s !== scale.get()) scale.set(s);
    const b = boundsFor(s);
    x.set(clamp(x.get(), b.minX, b.maxX));
    y.set(clamp(y.get(), b.minY, b.maxY));

    measureSectionCenters();
  }, [boundsFor, measureSectionCenters, refreshDims, scale, x, y]);

  const updateActiveSection = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    if (sectionCenters.current.size === 0) {
      measureSectionCenters();
      if (sectionCenters.current.size === 0) return;
    }

    const s = scale.get();
    const targetX = (viewport.clientWidth / 2 - x.get()) / s;
    const targetY = (viewport.clientHeight / 2 - y.get()) / s;

    let closest = items[0]?.id ?? "";
    let closestDistance = Number.POSITIVE_INFINITY;

    for (const [id, center] of sectionCenters.current) {
      const dx = center.cx - targetX;
      const dy = center.cy - targetY;
      const distance = dx * dx + dy * dy;
      if (distance < closestDistance) {
        closestDistance = distance;
        closest = id;
      }
    }

    if (closest === activeSectionRef.current) return;
    activeSectionRef.current = closest;
    setActiveSection(closest);
  }, [items, measureSectionCenters, scale, x, y]);

  const scheduleActiveSectionUpdate = useCallback(() => {
    if (activeSectionFrame.current !== null) return;
    const now = performance.now();
    if (now - lastActiveSectionUpdate.current < ACTIVE_SECTION_UPDATE_INTERVAL) return;
    activeSectionFrame.current = requestAnimationFrame(() => {
      activeSectionFrame.current = null;
      lastActiveSectionUpdate.current = performance.now();
      if (gesture.current.active) return;
      updateActiveSection();
    });
  }, [updateActiveSection]);

  const settle = useCallback(
    (velocityX = 0, velocityY = 0) => {
      const b = boundsFor(scale.get());
      const targetX = clamp(x.get() + velocityX * 260, b.minX, b.maxX);
      const targetY = clamp(y.get() + velocityY * 260, b.minY, b.maxY);

      animate(x, targetX, {
        type: "spring",
        stiffness: 88,
        damping: 20,
        mass: 0.92,
        velocity: velocityX * 1000,
        onUpdate: scheduleActiveSectionUpdate,
      });
      animate(y, targetY, {
        type: "spring",
        stiffness: 88,
        damping: 20,
        mass: 0.92,
        velocity: velocityY * 1000,
        onUpdate: scheduleActiveSectionUpdate,
      });
    },
    [boundsFor, scale, scheduleActiveSectionUpdate, x, y],
  );

  // Focusing a section always returns to full zoom (scale 1), centered on it.
  const focusSection = useCallback(
    (id: string) => {
      const viewport = viewportRef.current;
      const canvas = canvasRef.current;
      const node = sectionRefs.current[id];
      if (!viewport || !canvas || !node) return;

      const b = boundsFor(1);
      const targetX = clamp(
        viewport.clientWidth / 2 - (node.offsetLeft + node.offsetWidth / 2),
        b.minX,
        b.maxX,
      );
      const targetY = clamp(
        viewport.clientHeight / 2 - (node.offsetTop + node.offsetHeight / 2),
        b.minY,
        b.maxY,
      );

      animate(scale, 1, {
        type: "spring",
        stiffness: 92,
        damping: 24,
        mass: 0.9,
      });
      animate(x, targetX, {
        type: "spring",
        stiffness: 92,
        damping: 22,
        mass: 0.9,
        onUpdate: scheduleActiveSectionUpdate,
      });
      animate(y, targetY, {
        type: "spring",
        stiffness: 92,
        damping: 22,
        mass: 0.9,
        onUpdate: scheduleActiveSectionUpdate,
      });
      activeSectionRef.current = id;
      setActiveSection(id);
      setRenderableSectionIds((current) => {
        if (current.has(id)) return current;
        return new Set([...current, id]);
      });
    },
    [boundsFor, scale, scheduleActiveSectionUpdate, x, y],
  );

  useEffect(() => {
    measure();
    const resizeObserver = new ResizeObserver(measure);
    if (viewportRef.current) resizeObserver.observe(viewportRef.current);
    if (canvasRef.current) resizeObserver.observe(canvasRef.current);

    // Center the opening section synchronously: animation frames can be
    // throttled or frozen in background tabs, so the initial position must
    // not depend on rAF or spring animations.
    const viewport = viewportRef.current;
    const canvas = canvasRef.current;
    const centerNode = centerSectionId ? sectionRefs.current[centerSectionId] : null;
    if (viewport && canvas && centerNode) {
      const b = boundsFor(1);
      const targetX = clamp(
        viewport.clientWidth / 2 - (centerNode.offsetLeft + centerNode.offsetWidth / 2),
        b.minX,
        b.maxX,
      );
      const targetY = clamp(
        viewport.clientHeight / 2 - (centerNode.offsetTop + centerNode.offsetHeight / 2),
        b.minY,
        b.maxY,
      );
      x.set(targetX);
      y.set(targetY);
      canvas.style.transform = `translateX(${targetX}px) translateY(${targetY}px) scale(1)`;
    }

    return () => {
      resizeObserver.disconnect();
      if (activeSectionFrame.current !== null) {
        cancelAnimationFrame(activeSectionFrame.current);
        activeSectionFrame.current = null;
      }
    };
  }, [boundsFor, centerSectionId, measure, x, y]);

  useEffect(() => {
    activeSectionRef.current = activeSection;
    setRenderableSectionIds((current) => {
      if (!activeSection || current.has(activeSection)) return current;
      return new Set([...current, activeSection]);
    });
  }, [activeSection]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || !items.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).dataset.gridId;
          if (!id) continue;

          if (entry.isIntersecting) {
            window.clearTimeout(lazyUnloadTimers.current[id]);
            delete lazyUnloadTimers.current[id];
            setRenderableSectionIds((current) => {
              if (current.has(id)) return current;
              return new Set([...current, id]);
            });
            continue;
          }

          window.clearTimeout(lazyUnloadTimers.current[id]);
          lazyUnloadTimers.current[id] = window.setTimeout(() => {
            if (id === activeSectionRef.current || id === centerSectionId) return;
            setRenderableSectionIds((current) => {
              if (!current.has(id)) return current;
              const next = new Set(current);
              next.delete(id);
              return next;
            });
          }, 900);
        }
      },
      {
        root: viewport,
        rootMargin: "140% 140%",
        threshold: 0,
      },
    );

    for (const item of items) {
      const node = sectionRefs.current[item.id];
      if (node) observer.observe(node);
    }

    return () => {
      observer.disconnect();
      for (const timer of Object.values(lazyUnloadTimers.current)) {
        window.clearTimeout(timer);
      }
      lazyUnloadTimers.current = {};
    };
  }, [centerSectionId, items]);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 && event.pointerType === "mouse") return;
    refreshDims();
    x.stop();
    y.stop();
    gesture.current = {
      active: true,
      startX: event.clientX,
      startY: event.clientY,
      originX: x.get(),
      originY: y.get(),
      lastX: event.clientX,
      lastY: event.clientY,
      lastTime: performance.now(),
      velocityX: 0,
      velocityY: 0,
      distance: 0,
    };
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Pointer capture can fail for already-released or synthetic pointers.
    }
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!gesture.current.active) return;
    if (event.cancelable) event.preventDefault();

    const now = performance.now();
    const elapsed = Math.max(16, now - gesture.current.lastTime);
    const dx = event.clientX - gesture.current.startX;
    const dy = event.clientY - gesture.current.startY;
    const distance = Math.hypot(dx, dy);
    const b = boundsFor(scale.get());
    const nextX = rubberband(gesture.current.originX + dx, b.minX, b.maxX);
    const nextY = rubberband(gesture.current.originY + dy, b.minY, b.maxY);

    gesture.current.velocityX = (event.clientX - gesture.current.lastX) / elapsed;
    gesture.current.velocityY = (event.clientY - gesture.current.lastY) / elapsed;
    gesture.current.lastX = event.clientX;
    gesture.current.lastY = event.clientY;
    gesture.current.lastTime = now;
    gesture.current.distance = distance;

    if (distance > 5 && !isDragging) setIsDragging(true);
    x.set(nextX);
    y.set(nextY);
  };

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!gesture.current.active) return;
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      // Releasing an uncaptured pointer throws; safe to ignore.
    }
    gesture.current.active = false;

    // A plain click (not a drag) while zoomed out focuses the clicked card
    // and zooms back in on it.
    if (gesture.current.distance < 5 && scale.get() < 0.98) {
      const cell = (event.target as HTMLElement).closest?.("[data-grid-id]") as HTMLElement | null;
      const id = cell?.dataset.gridId;
      if (id) {
        window.setTimeout(() => setIsDragging(false), 80);
        focusSection(id);
        return;
      }
    }

    settle(gesture.current.velocityX, gesture.current.velocityY);
    updateActiveSection();
    window.setTimeout(() => setIsDragging(false), 80);
  };

  // Wheel zooms the canvas around the cursor: scale 1 focuses a single card,
  // the minimum scale fits every card inside the viewport.
  const onWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (event.cancelable) event.preventDefault();
    const viewport = viewportRef.current;
    if (!viewport) return;

    refreshDims();
    const current = scale.get();
    const next = clamp(current * Math.exp(-event.deltaY * 0.0016), minScaleRef.current, 1);
    if (next === current) return;

    x.stop();
    y.stop();
    scale.stop();

    const rect = viewport.getBoundingClientRect();
    const anchorX = event.clientX - rect.left;
    const anchorY = event.clientY - rect.top;
    const worldX = (anchorX - x.get()) / current;
    const worldY = (anchorY - y.get()) / current;
    const b = boundsFor(next);

    scale.set(next);
    x.set(clamp(anchorX - worldX * next, b.minX, b.maxX));
    y.set(clamp(anchorY - worldY * next, b.minY, b.maxY));
    scheduleActiveSectionUpdate();
  };

  return (
    <div className={styles.shell}>
      <div
        ref={viewportRef}
        className={`${styles.viewport} ${isDragging ? styles.dragging : ""}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={onWheel}
      >
        <motion.div
          ref={canvasRef}
          className={styles.canvas}
          style={{ x, y, scale, transformOrigin: "0 0", "--grid-size": gridSize } as CanvasStyle}
        >
          {positionedItems.map(({ item, col, row }, index) => {
            const isRenderable =
              renderableSectionIds.has(item.id) || item.id === activeSection || item.id === centerSectionId;

            return (
              <section
                key={item.id}
                data-grid-id={item.id}
                data-work-visual={item.visual}
                ref={(node) => {
                  sectionRefs.current[item.id] = node;
                }}
                className={`${styles.section} ${isRenderable ? "" : styles.sectionDormant}`}
                style={
                  {
                    gridColumn: col,
                    gridRow: row,
                    "--accent": item.accentFrom,
                    "--accent-2": item.accentTo,
                  } as WorkStyle
                }
              >
                {isRenderable ? (
                  <WorkCard item={item} index={index} />
                ) : null}
              </section>
            );
          })}
        </motion.div>
      </div>

      {items.length ? (
        <nav className={styles.rail} aria-label="Gallery items">
          {items.map((item, index) => (
            <button
              key={item.id}
              className={item.id === activeSection ? styles.railActive : ""}
              onClick={() => focusSection(item.id)}
              aria-label={`Go to ${item.title}`}
            >
              {String(index + 1).padStart(2, "0")}
            </button>
          ))}
        </nav>
      ) : null}
    </div>
  );
}
