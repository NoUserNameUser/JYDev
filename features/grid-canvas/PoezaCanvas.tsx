"use client";

import { animate, motion, useMotionValue } from "framer-motion";
import type { MotionStyle } from "framer-motion";
import Image from "next/image";
import type { CSSProperties } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { buildSpiralPositions } from "@/lib/gridSpiral";
import type { GridElement, GridSection } from "@/types/grid";

import styles from "./PoezaCanvas.module.css";

type CanvasStyle = MotionStyle & {
  "--grid-size": number;
};

type SectionStyle = CSSProperties & {
  "--section-base"?: string;
};

type ShapeStyle = CSSProperties & {
  "--shape-x": string;
  "--shape-y": string;
  "--shape-width": string;
  "--shape-height": string;
  "--shape-color": string;
  "--shape-rotation": string;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const ACTIVE_SECTION_UPDATE_INTERVAL = 120;

const rubberband = (value: number, min: number, max: number) => {
  if (value < min) return min + (value - min) * 0.22;
  if (value > max) return max + (value - max) * 0.22;
  return value;
};

function toScopeId(id: string) {
  return `grid-${id.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
}

function externalLinkProps(openInNewTab?: boolean) {
  return openInNewTab ? { target: "_blank", rel: "noreferrer" } : {};
}

function renderShape(element: Extract<GridElement, { type: "shape" }>, index: number) {
  const shapeStyle: ShapeStyle = {
    "--shape-x": element.x ?? "50%",
    "--shape-y": element.y ?? "20%",
    "--shape-width": element.width ?? "16%",
    "--shape-height": element.height ?? "86px",
    "--shape-color": element.color ?? "rgba(53, 47, 42, 0.16)",
    "--shape-rotation": `${element.rotation ?? 0}deg`,
    opacity: element.opacity ?? 1,
    zIndex: element.zIndex ?? 1,
  };

  return (
    <div
      key={`${element.name ?? element.shape ?? "shape"}-${index}`}
      className={styles.elementShape}
      data-grid-element="shape"
      data-grid-shape={element.shape ?? "triangle"}
      aria-hidden="true"
      style={shapeStyle}
    />
  );
}

function renderElement(element: GridElement, index: number) {
  if (element.type === "background" || element.type === "shape") return null;

  if (element.type === "text") {
    return (
      <div key={index} className={styles.elementText} data-grid-element="text">
        {element.eyebrow ? <span className={styles.elementEyebrow}>{element.eyebrow}</span> : null}
        {element.heading ? <h2>{element.heading}</h2> : null}
        {element.body ? <p>{element.body}</p> : null}
      </div>
    );
  }

  if (element.type === "image") {
    return (
      <figure key={index} className={styles.elementFigure} data-grid-element="image">
        <Image
          className={styles.elementImage}
          src={element.src}
          alt={element.alt ?? ""}
          width={1200}
          height={900}
          sizes="(max-width: 760px) 70vw, 52vw"
          loading="lazy"
          unoptimized
          draggable={false}
        />
        {element.caption ? <figcaption>{element.caption}</figcaption> : null}
      </figure>
    );
  }

  if (element.type === "link") {
    return (
      <a
        key={index}
        className={styles.elementLink}
        data-grid-element="link"
        href={element.href}
        onPointerDown={(event) => event.stopPropagation()}
        {...externalLinkProps(element.openInNewTab)}
      >
        {element.label}
      </a>
    );
  }

  return (
    <a
      key={index}
      className={`${styles.elementButton} ${styles[`elementButton${element.variant === "secondary" ? "Secondary" : element.variant === "text" ? "Text" : "Primary"}`]}`}
      data-grid-element="button"
      href={element.href}
      onPointerDown={(event) => event.stopPropagation()}
      {...externalLinkProps(element.openInNewTab)}
    >
      {element.label}
    </a>
  );
}

type PoezaCanvasProps = {
  initialSections?: GridSection[];
};

export function PoezaCanvas({ initialSections = [] }: PoezaCanvasProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
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
  const wheelLock = useRef(false);
  const activeSectionFrame = useRef<number | null>(null);
  const lastActiveSectionUpdate = useRef(0);
  const activeSectionRef = useRef(initialSections[0]?.id ?? "");
  const centerSectionIdRef = useRef(initialSections[0]?.id ?? "");
  const lazyUnloadTimers = useRef<Record<string, number>>({});
  const bounds = useRef({ minX: 0, maxX: 0, minY: 0, maxY: 0 });
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [sections, setSections] = useState<GridSection[]>(initialSections);
  const [activeSection, setActiveSection] = useState(initialSections[0]?.id ?? "");
  const [renderableSectionIds, setRenderableSectionIds] = useState<Set<string>>(
    () => new Set(initialSections[0]?.id ? [initialSections[0].id] : []),
  );
  const [isDragging, setIsDragging] = useState(false);

  const centerSectionId = sections[0]?.id;
  const sectionMap = useMemo(() => new Map(sections.map((section) => [section.id, section])), [sections]);
  const activeGrid = sectionMap.get(activeSection) ?? sections[0];
  const spiralPositions = useMemo(() => buildSpiralPositions(sections.length), [sections.length]);
  const gridRadius = useMemo(
    () =>
      spiralPositions.length
        ? Math.max(...spiralPositions.map((position) => Math.max(Math.abs(position.col), Math.abs(position.row))))
        : 0,
    [spiralPositions],
  );
  const gridOrigin = gridRadius + 2;
  const gridSize = gridOrigin * 2 - 1;

  const measure = useCallback(() => {
    const viewport = viewportRef.current;
    const canvas = canvasRef.current;
    if (!viewport || !canvas) return;

    const viewportRect = viewport.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();
    const padding = Math.min(80, viewportRect.width * 0.08);
    const minX = Math.min(0, viewportRect.width - canvas.scrollWidth - padding);
    const minY = Math.min(0, viewportRect.height - canvas.scrollHeight - padding);
    bounds.current = {
      minX,
      maxX: padding,
      minY,
      maxY: padding,
    };

    if (canvasRect.width > 0) {
      x.set(clamp(x.get(), minX, padding));
      y.set(clamp(y.get(), minY, padding));
    }
  }, [x, y]);

  const updateActiveSection = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const centerX = viewport.clientWidth / 2;
    const centerY = viewport.clientHeight / 2;
    let closest = sections[0]?.id ?? "";
    let closestDistance = Number.POSITIVE_INFINITY;

    for (const section of sections) {
      const node = sectionRefs.current[section.id];
      if (!node) continue;
      const rect = node.getBoundingClientRect();
      const dx = rect.left + rect.width / 2 - centerX;
      const dy = rect.top + rect.height / 2 - centerY;
      const distance = Math.hypot(dx, dy);
      if (distance < closestDistance) {
        closestDistance = distance;
        closest = section.id;
      }
    }

    setActiveSection((current) => {
      if (current === closest) return current;
      return closest;
    });
  }, [sections]);

  const scheduleActiveSectionUpdate = useCallback(() => {
    if (activeSectionFrame.current !== null) return;
    const now = performance.now();
    if (now - lastActiveSectionUpdate.current < ACTIVE_SECTION_UPDATE_INTERVAL) return;
    activeSectionFrame.current = requestAnimationFrame(() => {
      activeSectionFrame.current = null;
      lastActiveSectionUpdate.current = performance.now();
      updateActiveSection();
    });
  }, [updateActiveSection]);

  const settle = useCallback(
    (velocityX = 0, velocityY = 0) => {
      const targetX = clamp(x.get() + velocityX * 260, bounds.current.minX, bounds.current.maxX);
      const targetY = clamp(y.get() + velocityY * 260, bounds.current.minY, bounds.current.maxY);

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
    [scheduleActiveSectionUpdate, x, y],
  );

  const focusSection = useCallback(
    (id: string) => {
      const viewport = viewportRef.current;
      const canvas = canvasRef.current;
      const node = sectionRefs.current[id];
      if (!viewport || !canvas || !node) return;

      const targetX = clamp(
        viewport.clientWidth / 2 - (node.offsetLeft + node.offsetWidth / 2),
        bounds.current.minX,
        bounds.current.maxX,
      );
      const targetY = clamp(
        viewport.clientHeight / 2 - (node.offsetTop + node.offsetHeight / 2),
        bounds.current.minY,
        bounds.current.maxY,
      );

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
      setActiveSection(id);
      setRenderableSectionIds((current) => {
        if (current.has(id)) return current;
        return new Set([...current, id]);
      });
    },
    [scheduleActiveSectionUpdate, x, y],
  );

  const moveByWheel = useCallback(
    (direction: 1 | -1) => {
      if (wheelLock.current) return;
      const currentIndex = Math.max(
        0,
        sections.findIndex((section) => section.id === activeSection),
      );
      if (sections.length === 0) return;
      const nextIndex = (currentIndex + direction + sections.length) % sections.length;
      const nextSection = sections[nextIndex];
      if (!nextSection || nextSection.id === activeSection) return;

      wheelLock.current = true;
      focusSection(nextSection.id);
      window.setTimeout(() => {
        wheelLock.current = false;
      }, 780);
    },
    [activeSection, focusSection, sections],
  );

  useEffect(() => {
    measure();
    const resizeObserver = new ResizeObserver(measure);
    if (viewportRef.current) resizeObserver.observe(viewportRef.current);
    if (canvasRef.current) resizeObserver.observe(canvasRef.current);

    if (centerSectionId) requestAnimationFrame(() => focusSection(centerSectionId));

    return () => {
      resizeObserver.disconnect();
      if (activeSectionFrame.current !== null) {
        cancelAnimationFrame(activeSectionFrame.current);
        activeSectionFrame.current = null;
      }
    };
  }, [centerSectionId, focusSection, measure]);

  useEffect(() => {
    if (!activeSection || window.location.hash === `#${activeSection}`) return;
    window.history.replaceState(null, "", `#${activeSection}`);
  }, [activeSection]);

  useEffect(() => {
    activeSectionRef.current = activeSection;
    setRenderableSectionIds((current) => {
      if (!activeSection || current.has(activeSection)) return current;
      return new Set([...current, activeSection]);
    });
  }, [activeSection]);

  useEffect(() => {
    centerSectionIdRef.current = centerSectionId ?? "";
  }, [centerSectionId]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || !sections.length) return;

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
            if (id === activeSectionRef.current || id === centerSectionIdRef.current) return;
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

    for (const section of sections) {
      const node = sectionRefs.current[section.id];
      if (node) observer.observe(node);
    }

    return () => {
      observer.disconnect();
      for (const timer of Object.values(lazyUnloadTimers.current)) {
        window.clearTimeout(timer);
      }
      lazyUnloadTimers.current = {};
    };
  }, [sections]);

  useEffect(() => {
    let cancelled = false;

    async function loadSections() {
      try {
        const response = await fetch("/api/grids", { cache: "no-store" });
        if (!response.ok) return;
        const data = (await response.json()) as { grids?: GridSection[] };
        if (!cancelled) {
          const nextSections = [...(data.grids ?? [])].sort((a, b) => a.orderIndex - b.orderIndex);
          setSections(nextSections);
          setActiveSection((current) => (nextSections.some((section) => section.id === current) ? current : (nextSections[0]?.id ?? "")));
          setRenderableSectionIds(new Set(nextSections[0]?.id ? [nextSections[0].id] : []));
          requestAnimationFrame(measure);
        }
      } catch {
        // The CMS is the content source. Without it, the canvas has no grids to render.
      }
    }

    loadSections();
    return () => {
      cancelled = true;
    };
  }, [measure]);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 && event.pointerType === "mouse") return;
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
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!gesture.current.active) return;
    if (event.cancelable) event.preventDefault();

    const now = performance.now();
    const elapsed = Math.max(16, now - gesture.current.lastTime);
    const dx = event.clientX - gesture.current.startX;
    const dy = event.clientY - gesture.current.startY;
    const distance = Math.hypot(dx, dy);
    const nextX = rubberband(gesture.current.originX + dx, bounds.current.minX, bounds.current.maxX);
    const nextY = rubberband(gesture.current.originY + dy, bounds.current.minY, bounds.current.maxY);

    gesture.current.velocityX = (event.clientX - gesture.current.lastX) / elapsed;
    gesture.current.velocityY = (event.clientY - gesture.current.lastY) / elapsed;
    gesture.current.lastX = event.clientX;
    gesture.current.lastY = event.clientY;
    gesture.current.lastTime = now;
    gesture.current.distance = distance;

    if (distance > 5) setIsDragging(true);
    x.set(nextX);
    y.set(nextY);
    scheduleActiveSectionUpdate();
  };

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!gesture.current.active) return;
    event.currentTarget.releasePointerCapture(event.pointerId);
    gesture.current.active = false;
    settle(gesture.current.velocityX, gesture.current.velocityY);
    window.setTimeout(() => setIsDragging(false), 80);
  };

  const onWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (event.cancelable) event.preventDefault();
    const dominantDelta =
      Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
    if (Math.abs(dominantDelta) < 12) return;
    moveByWheel(dominantDelta > 0 ? 1 : -1);
  };

  return (
    <div className={styles.shell}>
      <div className={styles.topbar}>
        {centerSectionId ? (
          <button className={styles.brand} onClick={() => focusSection(centerSectionId)} aria-label="Go to opening section">
            {sections[0]?.label}
          </button>
        ) : null}
        {activeGrid ? (
          <div className={styles.status}>
            <span>{activeGrid.meta}</span>
            <span>{activeGrid.label}</span>
          </div>
        ) : null}
      </div>

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
          style={{ x, y, "--grid-size": gridSize } as CanvasStyle}
        >
          {sections.map((section, index) => (
            (() => {
              const backgroundSettings = section.elements?.find(
                (element): element is Extract<GridElement, { type: "background" }> => element.type === "background",
              );
              const backgroundImageElements = section.elements?.filter(
                (element): element is Extract<GridElement, { type: "image" }> =>
                  element.type === "image" && element.placement === "background",
              ) ?? [];
              const backgroundImages = [
                ...(backgroundSettings?.imageSrc
                  ? [
                      {
                        src: backgroundSettings.imageSrc,
                        alt: backgroundSettings.imageAlt,
                        opacity: backgroundSettings.imageOpacity,
                      },
                    ]
                  : []),
                ...backgroundImageElements.map((element) => ({
                  src: element.src,
                  alt: element.alt,
                  opacity: undefined,
                })),
              ];
              const shapeElements = section.elements?.filter(
                (element): element is Extract<GridElement, { type: "shape" }> => element.type === "shape",
              ) ?? [];
              const contentElements = section.elements?.filter(
                (element) =>
                  element.type !== "background" &&
                  element.type !== "shape" &&
                  !(element.type === "image" && element.placement === "background"),
              ) ?? [];
              const isRenderable =
                renderableSectionIds.has(section.id) || section.id === activeSection || section.id === centerSectionId;

              return (
            <section
              key={section.id}
              id={toScopeId(section.id)}
              data-grid-id={section.id}
              data-grid-slug={section.id}
              data-grid-kind={section.kind}
              ref={(node) => {
                sectionRefs.current[section.id] = node;
              }}
              className={`${styles.section} ${isRenderable ? "" : styles.sectionDormant}`}
              data-grid-loaded={isRenderable ? "true" : "false"}
              style={{
                "--section-base": backgroundSettings?.color,
                gridColumn: spiralPositions[index].col + gridOrigin,
                gridRow: spiralPositions[index].row + gridOrigin,
              } as SectionStyle}
            >
              {isRenderable && section.localCss ? <style>{`@scope (#${toScopeId(section.id)}) { ${section.localCss} }`}</style> : null}
              {isRenderable
                ? backgroundImages.map((element, imageIndex) => (
                    <Image
                      key={`${element.src}-${imageIndex}`}
                      className={styles.photo}
                      data-grid-background-media=""
                      src={element.src}
                      alt={element.alt ?? ""}
                      width={1400}
                      height={1000}
                      sizes="(max-width: 760px) 90vw, 80vw"
                      loading="lazy"
                      unoptimized
                      draggable={false}
                      style={element.opacity === undefined ? undefined : { opacity: element.opacity }}
                    />
                  ))
                : null}
              {isRenderable ? shapeElements.map(renderShape) : null}
              <div className={styles.sectionHeader} data-grid-header="">
                <span>{section.label}</span>
                <span>{section.kicker}</span>
              </div>
              <div className={styles.sectionBody} data-grid-body="">
                {isRenderable && contentElements.length ? (
                  <div className={styles.elementStack}>{contentElements.map(renderElement)}</div>
                ) : null}
              </div>
              <div className={styles.sectionMeta} data-grid-meta="">{section.meta}</div>
            </section>
              );
            })()
          ))}
        </motion.div>
      </div>

      {sections.length ? (
        <nav className={styles.rail} aria-label="Canvas sections">
          {sections.map((section, index) => (
            <button
              key={section.id}
              className={section.id === activeSection ? styles.railActive : ""}
              onClick={() => focusSection(section.id)}
              aria-label={`Go to ${section.label}`}
            >
              {String(index + 1).padStart(2, "0")}
            </button>
          ))}
        </nav>
      ) : null}
    </div>
  );
}
