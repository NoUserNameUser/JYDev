import Image from "next/image";

import type { WorkVisual } from "./galleryContent";

import styles from "./ProjectPreview.module.css";

function BrowserBar({ address }: { address: string }) {
  return (
    <div className={styles.browserBar}>
      <span className={styles.dots} aria-hidden="true"><i /><i /><i /></span>
      <span>{address}</span>
      <span aria-hidden="true">•••</span>
    </div>
  );
}

function Cutover() {
  return (
    <div className={`${styles.preview} ${styles.cutover}`}>
      <BrowserBar address="migration.control" />
      <div className={styles.status}><span>Live cutover</span><b>All systems nominal</b></div>
      <div className={styles.network}>
        <div><small>Legacy</small><strong>On-prem</strong></div>
        <div className={styles.hub}><small>Edge</small><strong>Akamai</strong></div>
        <div><small>Target</small><strong>AWS</strong></div>
      </div>
      <div className={styles.signal}><i /><i /><i /><i /><i /><span>0 dropped sessions</span></div>
    </div>
  );
}

function Portal() {
  return (
    <div className={`${styles.preview} ${styles.portal}`}>
      <BrowserBar address="my.cityfone.net" />
      <div className={styles.productNav}><strong>my assistant</strong><span>Overview&nbsp;&nbsp; Billing&nbsp;&nbsp; Support</span></div>
      <div className={styles.portalHero}>
        <div><small>Good morning, Alex</small><h3>Your account,<br />under control.</h3><span className={styles.fakeButton}>Make a payment</span></div>
        <div className={styles.balanceCard}><small>Current balance</small><strong>$48.20</strong><span>Due Aug 12</span><i><b>8.4</b> GB left</i></div>
      </div>
    </div>
  );
}

function Brands() {
  return (
    <div className={`${styles.preview} ${styles.brands}`}>
      <div className={styles.brandRail}><b>C</b><b>Z</b><b>R</b><b>S</b><b>P</b></div>
      <div className={styles.brandPage}>
        <BrowserBar address="shared publishing core" />
        <div className={styles.brandCopy}><span>Brand 03 / 05</span><h3>One engine.<br /><em>Five voices.</em></h3><p>Shared modules, independent stories.</p><i /><i /><i /></div>
      </div>
    </div>
  );
}

function Portfolio() {
  return (
    <div className={`${styles.preview} ${styles.portfolio}`}>
      <div className={styles.canvasTop}><strong>JACKIE YE</strong><span>WORK / DRAG TO EXPLORE</span></div>
      <div className={styles.miniCanvas}>
        <div className={`${styles.miniCard} ${styles.miniHero}`}><small>Software + systems</small><strong>Build the useful thing.</strong></div>
        <div className={`${styles.miniCard} ${styles.miniCloud}`}><small>01 / Cloud</small><strong>Live cutover</strong></div>
        <div className={`${styles.miniCard} ${styles.miniPortal}`}><small>02 / Product</small><strong>My Assistant</strong></div>
        <div className={`${styles.miniCard} ${styles.miniBrand}`}><small>03 / Platform</small><strong>Five brands</strong></div>
      </div>
    </div>
  );
}

function Performance() {
  return (
    <div className={`${styles.preview} ${styles.performance}`}>
      <BrowserBar address="performance.lab" />
      <div className={styles.metrics}><span>Before<strong>~5.0s</strong></span><b>→</b><span>After<strong>~2.0s</strong></span></div>
      <div className={styles.chart}>{[82, 74, 68, 54, 47, 36, 30, 25, 22].map((height) => <i key={height} style={{ height: `${height}%` }} />)}</div>
      <div className={styles.audit}><span>Content model</span><span>Queries</span><span>Cache</span><b>Stable</b></div>
    </div>
  );
}

function Funding() {
  return (
    <div className={`${styles.preview} ${styles.funding}`}>
      <BrowserBar address="origin / discover" />
      <div className={styles.productNav}><strong>ORIGIN</strong><span>Explore&nbsp;&nbsp; Start a project</span></div>
      <div className={styles.fundingHero}>
        <div><small>Community funded</small><h3>Back what<br />should exist.</h3><span className={styles.fakeButton}>Explore projects</span></div>
        <div className={styles.campaign}><div><span>FIELD NOTES<br />VOL. 01</span></div><strong>Independent stories, printed beautifully.</strong><i><b /></i><small>$18,420 raised · 82%</small></div>
      </div>
    </div>
  );
}

function ImagePreview({ src, alt }: { src: string; alt: string }) {
  return (
    <div className={`${styles.preview} ${styles.imagePreview}`}>
      <Image
        className={styles.customImage}
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 760px) 86vw, 62vw"
        unoptimized
        draggable={false}
      />
      <span aria-hidden />
    </div>
  );
}

export function ProjectPreview({ visual, imageUrl, imageAlt }: { visual: WorkVisual; imageUrl?: string; imageAlt?: string }) {
  if (visual === "image" && imageUrl) return <ImagePreview src={imageUrl} alt={imageAlt ?? ""} />;
  if (visual === "cutover") return <Cutover />;
  if (visual === "portal") return <Portal />;
  if (visual === "brands") return <Brands />;
  if (visual === "performance") return <Performance />;
  if (visual === "funding") return <Funding />;
  return <Portfolio />;
}
