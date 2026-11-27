import { useMemo } from 'react';

/* Deterministic pseudo-random so SSR/StrictMode renders match */
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/** Shared SVG pattern defs (hatching) — render once */
export function InkDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        <pattern id="hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(40)">
          <line x1="0" y1="0" x2="0" y2="5" stroke="#0b0a09" strokeWidth="1.3" />
        </pattern>
        <pattern id="hatch-fine" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(-35)">
          <line x1="0" y1="0" x2="0" y2="4" stroke="#0b0a09" strokeWidth="0.7" />
        </pattern>
        <pattern id="hatch-gold" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(60)">
          <line x1="0" y1="0" x2="0" y2="5" stroke="#8a5a12" strokeWidth="1.2" />
        </pattern>
      </defs>
    </svg>
  );
}

/** Original hooded wanderer silhouette */
export function Wanderer({ className = '', robe = '#d9a43a' }: { className?: string; robe?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 240" aria-hidden="true">
      <path
        d="M60 8 C45 8 37 22 38 38 C39 50 34 58 31 68 C22 102 15 150 6 232 L114 232 C106 160 98 104 89 68 C86 58 81 50 82 38 C83 22 75 8 60 8 Z"
        fill={robe}
        stroke="#0b0a09"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M60 8 C45 8 37 22 38 38 C39 50 34 58 31 68 C22 102 15 150 6 232 L40 232 C44 160 48 100 52 62 Z" fill="url(#hatch-gold)" opacity=".8" />
      <path d="M48 30 C48 22 72 22 72 30 L69 50 C64 55 56 55 51 50 Z" fill="#0b0a09" />
      <path d="M62 70 C66 120 70 170 74 232" stroke="#0b0a09" strokeWidth="2.5" fill="none" />
      <path d="M50 80 C46 130 44 180 42 232" stroke="#0b0a09" strokeWidth="1.5" fill="none" opacity=".7" />
    </svg>
  );
}

/** Ink mountain range with hatching */
export function Mountains({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 1600 400" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 400 L0 250 L140 160 L230 210 L380 90 L520 220 L640 170 L800 260 L960 120 L1110 230 L1250 150 L1400 240 L1600 140 L1600 400 Z" fill="#efe9dc" stroke="#0b0a09" strokeWidth="3" />
      <path d="M0 400 L0 250 L140 160 L230 210 L380 90 L520 220 L640 170 L800 260 L960 120 L1110 230 L1250 150 L1400 240 L1600 140 L1600 400 Z" fill="url(#hatch-fine)" opacity=".55" />
      <path d="M0 400 L0 330 L200 270 L360 320 L560 250 L760 330 L980 260 L1180 330 L1380 280 L1600 320 L1600 400 Z" fill="#0b0a09" />
    </svg>
  );
}

/** Cloud bank (cream with ink edge) */
export function Cloud({ className = '', flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg className={className} viewBox="0 0 800 300" style={flip ? { transform: 'scaleX(-1)' } : undefined} aria-hidden="true">
      <path
        d="M0 300 L0 170 C40 120 100 140 120 160 C130 90 220 70 260 120 C290 50 400 40 430 110 C470 70 560 80 570 140 C620 110 700 130 710 180 C760 170 800 200 800 230 L800 300 Z"
        fill="#f6f1e6"
        stroke="#0b0a09"
        strokeWidth="4"
      />
      <path d="M140 200 C200 180 260 190 300 210 M420 190 C480 170 540 180 600 205" stroke="#0b0a09" strokeWidth="2" fill="none" opacity=".5" />
    </svg>
  );
}

/** Radial manga speed lines */
export function SpeedLines({ className = '', count = 90, seed = 7, color = '#0b0a09' }: { className?: string; count?: number; seed?: number; color?: string }) {
  const polys = useMemo(() => {
    const r = rng(seed);
    const out: string[] = [];
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2 + r() * 0.05;
      const w = 0.004 + r() * 0.014;
      const inner = 180 + r() * 220;
      const R = 1200;
      const x1 = 500 + Math.cos(a) * inner;
      const y1 = 500 + Math.sin(a) * inner;
      const x2 = 500 + Math.cos(a - w) * R;
      const y2 = 500 + Math.sin(a - w) * R;
      const x3 = 500 + Math.cos(a + w) * R;
      const y3 = 500 + Math.sin(a + w) * R;
      out.push(`${x1.toFixed(1)},${y1.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)} ${x3.toFixed(1)},${y3.toFixed(1)}`);
    }
    return out;
  }, [count, seed]);
  return (
    <svg className={className} viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {polys.map((p, i) => (
        <polygon key={i} points={p} fill={color} />
      ))}
    </svg>
  );
}

/** Jagged ink edge band (for section transitions) */
export function InkEdge({ className = '', seed = 3, color = '#0b0a09' }: { className?: string; seed?: number; color?: string }) {
  const d = useMemo(() => {
    const r = rng(seed);
    let p = 'M0 120 L0 ';
    p += (60 + r() * 30).toFixed(0);
    for (let x = 0; x <= 1600; x += 20 + r() * 30) {
      const y = 30 + r() * 70 + (r() > 0.85 ? -25 : 0);
      p += ` L${x.toFixed(0)} ${y.toFixed(0)}`;
      if (r() > 0.8) p += ` L${(x + 6).toFixed(0)} ${(y + 40 + r() * 30).toFixed(0)} L${(x + 10).toFixed(0)} ${y.toFixed(0)}`;
    }
    return p + ' L1600 120 Z';
  }, [seed]);
  return (
    <svg className={className} viewBox="0 0 1600 120" preserveAspectRatio="none" aria-hidden="true">
      <path d={d} fill={color} />
    </svg>
  );
}

/** Ink pillar (column) */
export function Pillar({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 900" preserveAspectRatio="none" aria-hidden="true">
      <rect x="0" y="0" width="120" height="40" fill="#0b0a09" />
      <rect x="8" y="40" width="104" height="18" fill="#0b0a09" />
      <rect x="16" y="58" width="88" height="784" fill="#0b0a09" />
      {[30, 46, 62, 78, 94].map((x) => (
        <rect key={x} x={x} y="70" width="3" height="760" fill="#d7261e" opacity=".55" />
      ))}
      <rect x="8" y="842" width="104" height="18" fill="#0b0a09" />
      <rect x="0" y="860" width="120" height="40" fill="#0b0a09" />
    </svg>
  );
}

/** Small decorative illustration per project panel */
export function PanelArt({ kind }: { kind: number }) {
  const k = kind % 4;
  return (
    <div className={`art art-${k}`}>
      {k === 0 && (
        <>
          <div className="art-sun" />
          <Wanderer className="art-figure" />
          <Mountains className="art-mtn" />
        </>
      )}
      {k === 1 && (
        <>
          <SpeedLines className="art-speed" count={70} seed={kind + 11} />
          <div className="art-sun small" />
        </>
      )}
      {k === 2 && (
        <>
          <div className="art-rings" />
          <Wanderer className="art-figure dark" robe="#0b0a09" />
        </>
      )}
      {k === 3 && (
        <>
          <Pillar className="art-pillar p1" />
          <Pillar className="art-pillar p2" />
          <Pillar className="art-pillar p3" />
        </>
      )}
    </div>
  );
}
