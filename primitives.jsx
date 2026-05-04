// Shared primitives — Odo design system

// Tokens are read from CSS variables; falls back if not set.
const TOKENS = {
  font: 'var(--font-ui)',
  mono: 'var(--font-mono)',
  bg: 'var(--bg)',
  surface: 'var(--surface)',
  surface2: 'var(--surface-2)',
  ink: 'var(--ink)',
  inkDim: 'var(--ink-dim)',
  inkMute: 'var(--ink-mute)',
  line: 'var(--line)',
  accent: 'var(--accent)',
  accentInk: 'var(--accent-ink)',
  pos: 'var(--pos)',
  neg: 'var(--neg)',
};

// Format helpers respect distance unit + currency
function fmtDist(mi, unit) {
  const v = unit === 'km' ? mi * 1.60934 : mi;
  return v.toFixed(v >= 100 ? 0 : 1);
}
function fmtDistU(mi, unit) {
  return fmtDist(mi, unit) + (unit === 'km' ? ' km' : ' mi');
}
function fmtMpg(mpg, unit) {
  if (unit === 'km') {
    // L/100km
    const lkm = 235.214 / mpg;
    return lkm.toFixed(1) + ' L/100km';
  }
  return mpg.toFixed(1) + ' mpg';
}
function fmtMoney(n) {
  return '$' + n.toFixed(2);
}
function fmtMoneyShort(n) {
  if (n >= 1000) return '$' + (n / 1000).toFixed(1) + 'k';
  return '$' + n.toFixed(0);
}

// Stat — large number with label
function Stat({ label, value, unit, hint, size = 'md', align = 'left' }) {
  const sizes = {
    sm: { v: 22, l: 10 },
    md: { v: 32, l: 11 },
    lg: { v: 44, l: 12 },
    xl: { v: 64, l: 12 },
  };
  const s = sizes[size];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, textAlign: align }}>
      <div style={{
        fontFamily: TOKENS.mono, fontSize: s.l, color: 'var(--ink-mute)',
        textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 500,
      }}>{label}</div>
      <div style={{
        fontFamily: TOKENS.mono, fontSize: s.v, color: 'var(--ink)',
        fontWeight: 500, lineHeight: 1, letterSpacing: '-0.02em',
        display: 'flex', alignItems: 'baseline', gap: 4,
        justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
      }}>
        <span>{value}</span>
        {unit && <span style={{ fontSize: s.v * 0.45, color: 'var(--ink-dim)' }}>{unit}</span>}
      </div>
      {hint && <div style={{ fontSize: 11, color: 'var(--ink-dim)', fontFamily: TOKENS.font }}>{hint}</div>}
    </div>
  );
}

// Pill — small label
function Pill({ children, tone = 'neutral', size = 'sm' }) {
  const tones = {
    neutral: { bg: 'var(--surface-2)', fg: 'var(--ink-dim)', bd: 'var(--line)' },
    accent: { bg: 'color-mix(in oklch, var(--accent) 12%, transparent)', fg: 'var(--accent)', bd: 'color-mix(in oklch, var(--accent) 30%, transparent)' },
    pos: { bg: 'color-mix(in oklch, var(--pos) 14%, transparent)', fg: 'var(--pos)', bd: 'color-mix(in oklch, var(--pos) 30%, transparent)' },
    warn: { bg: 'color-mix(in oklch, var(--neg) 12%, transparent)', fg: 'var(--neg)', bd: 'color-mix(in oklch, var(--neg) 30%, transparent)' },
    ghost: { bg: 'transparent', fg: 'var(--ink-dim)', bd: 'var(--line)' },
  };
  const t = tones[tone];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: size === 'xs' ? '1px 6px' : '2px 8px',
      borderRadius: 999,
      background: t.bg, color: t.fg,
      border: `1px solid ${t.bd}`,
      fontFamily: TOKENS.mono, fontSize: size === 'xs' ? 9 : 10,
      fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em',
      whiteSpace: 'nowrap',
    }}>{children}</span>
  );
}

// Sparkline — inline SVG
function Sparkline({ values, w = 80, h = 24, stroke, fill = 'none', dots = false }) {
  if (!values || !values.length) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const stepX = w / (values.length - 1 || 1);
  const pts = values.map((v, i) => [i * stepX, h - ((v - min) / range) * (h - 4) - 2]);
  const d = pts.map((p, i) => (i === 0 ? 'M' : 'L') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const fillD = fill !== 'none' ? d + ` L${w} ${h} L0 ${h} Z` : '';
  return (
    <svg width={w} height={h} style={{ display: 'block', overflow: 'visible' }}>
      {fill !== 'none' && <path d={fillD} fill={fill} />}
      <path d={d} stroke={stroke || 'var(--accent)'} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {dots && pts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r={1.5} fill={stroke || 'var(--accent)'} />
      ))}
    </svg>
  );
}

// Bar chart
function BarChart({ data, w = 320, h = 120, accentIdx = -1 }) {
  if (!data || !data.length) return null;
  const max = Math.max(...data.map(d => d.value));
  const barW = (w - (data.length - 1) * 4) / data.length;
  return (
    <svg width={w} height={h} style={{ display: 'block', overflow: 'visible' }}>
      {data.map((d, i) => {
        const bh = (d.value / max) * (h - 24);
        const x = i * (barW + 4);
        const y = h - 20 - bh;
        const isAccent = i === accentIdx;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={bh} rx={2}
              fill={isAccent ? 'var(--accent)' : 'var(--surface-2)'}
              stroke={isAccent ? 'none' : 'var(--line)'} strokeWidth="1" />
            <text x={x + barW / 2} y={h - 6} textAnchor="middle"
              fontSize="9" fontFamily={TOKENS.mono} fill="var(--ink-mute)"
              letterSpacing="0.05em">{d.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

// Map placeholder — stylized route
function MapRoute({ w = 360, h = 180, dark = false, dense = false }) {
  // Procedurally drawn streets + a polyline route
  const bg = dark ? '#1a1a1a' : '#F2EFE8';
  const street = dark ? '#2a2a2a' : '#E5E0D2';
  const streetThin = dark ? '#252525' : '#EBE6D9';
  const water = dark ? '#1f2530' : '#D9DFE5';
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block', borderRadius: 8 }}>
      <rect width={w} height={h} fill={bg} />
      {/* "water" patch */}
      <path d={`M0 ${h * 0.7} Q${w * 0.25} ${h * 0.6} ${w * 0.5} ${h * 0.75} T${w} ${h * 0.85} L${w} ${h} L0 ${h} Z`} fill={water} opacity="0.6" />
      {/* grid streets */}
      {Array.from({ length: 8 }).map((_, i) => (
        <line key={'h' + i} x1="0" y1={(i + 1) * h / 9} x2={w} y2={(i + 1) * h / 9}
          stroke={i % 2 === 0 ? street : streetThin} strokeWidth={i % 3 === 0 ? 2 : 1} />
      ))}
      {Array.from({ length: 12 }).map((_, i) => (
        <line key={'v' + i} x1={(i + 1) * w / 13} y1="0" x2={(i + 1) * w / 13} y2={h}
          stroke={i % 2 === 0 ? street : streetThin} strokeWidth={i % 4 === 0 ? 2 : 1} />
      ))}
      {/* diagonals */}
      <line x1="0" y1={h * 0.3} x2={w} y2={h * 0.5} stroke={street} strokeWidth="2" />
      {dense && <line x1={w * 0.2} y1="0" x2={w * 0.6} y2={h} stroke={street} strokeWidth="2" />}
      {/* route polyline */}
      <path
        d={`M${w * 0.12} ${h * 0.78} L${w * 0.12} ${h * 0.5} L${w * 0.32} ${h * 0.5} L${w * 0.32} ${h * 0.32} L${w * 0.55} ${h * 0.32} L${w * 0.55} ${h * 0.18} L${w * 0.82} ${h * 0.18}`}
        stroke="var(--accent)" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round"
      />
      <path
        d={`M${w * 0.12} ${h * 0.78} L${w * 0.12} ${h * 0.5} L${w * 0.32} ${h * 0.5} L${w * 0.32} ${h * 0.32} L${w * 0.55} ${h * 0.32} L${w * 0.55} ${h * 0.18} L${w * 0.82} ${h * 0.18}`}
        stroke="white" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.4"
      />
      {/* start + end markers */}
      <circle cx={w * 0.12} cy={h * 0.78} r="6" fill="white" stroke="var(--ink)" strokeWidth="2" />
      <circle cx={w * 0.12} cy={h * 0.78} r="2" fill="var(--ink)" />
      <circle cx={w * 0.82} cy={h * 0.18} r="7" fill="var(--accent)" />
      <circle cx={w * 0.82} cy={h * 0.18} r="2.5" fill="white" />
    </svg>
  );
}

// Button
function Button({ children, variant = 'primary', size = 'md', icon, onClick, full = false, style = {} }) {
  const styles = {
    primary: { bg: 'var(--ink)', fg: 'var(--bg)', bd: 'var(--ink)' },
    accent: { bg: 'var(--accent)', fg: 'var(--accent-ink)', bd: 'var(--accent)' },
    ghost: { bg: 'transparent', fg: 'var(--ink)', bd: 'var(--line)' },
    quiet: { bg: 'var(--surface-2)', fg: 'var(--ink)', bd: 'transparent' },
  };
  const s = styles[variant];
  const sizes = {
    sm: { p: '6px 10px', f: 12 },
    md: { p: '10px 14px', f: 13 },
    lg: { p: '14px 18px', f: 14 },
  };
  const sz = sizes[size];
  return (
    <button onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      padding: sz.p, fontSize: sz.f,
      fontFamily: TOKENS.font, fontWeight: 500,
      background: s.bg, color: s.fg, border: `1px solid ${s.bd}`,
      borderRadius: 6, cursor: 'pointer', width: full ? '100%' : 'auto',
      letterSpacing: '-0.005em',
      ...style,
    }}>
      {icon}{children}
    </button>
  );
}

// Icon — minimal hairline icons
const Icon = {
  plus: (s = 14) => (<svg width={s} height={s} viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>),
  arrowR: (s = 12) => (<svg width={s} height={s} viewBox="0 0 12 12" fill="none"><path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  arrowUR: (s = 12) => (<svg width={s} height={s} viewBox="0 0 12 12" fill="none"><path d="M3 9L9 3M4 3h5v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  car: (s = 14) => (<svg width={s} height={s} viewBox="0 0 14 14" fill="none"><path d="M2 8h10M3 8L4 4h6l1 4M4 11.5h1M9 11.5h1M2 8v3.5M12 8v3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  fuel: (s = 14) => (<svg width={s} height={s} viewBox="0 0 14 14" fill="none"><path d="M2 12V3a1 1 0 011-1h4a1 1 0 011 1v9M1.5 12h7M8 6h2v4a1 1 0 01-2 0V8M10 5l1.5-1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  clock: (s = 14) => (<svg width={s} height={s} viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.4"/><path d="M7 4v3l2 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>),
  pin: (s = 14) => (<svg width={s} height={s} viewBox="0 0 14 14" fill="none"><path d="M7 12s4-3.5 4-7a4 4 0 10-8 0c0 3.5 4 7 4 7z" stroke="currentColor" strokeWidth="1.4"/><circle cx="7" cy="5" r="1.5" stroke="currentColor" strokeWidth="1.4"/></svg>),
  search: (s = 14) => (<svg width={s} height={s} viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.4"/><path d="M9.5 9.5L13 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>),
  filter: (s = 14) => (<svg width={s} height={s} viewBox="0 0 14 14" fill="none"><path d="M2 3h10M4 7h6M6 11h2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>),
  download: (s = 14) => (<svg width={s} height={s} viewBox="0 0 14 14" fill="none"><path d="M7 1v8M3.5 6L7 9l3.5-3M2 12h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  settings: (s = 14) => (<svg width={s} height={s} viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="1.4"/><path d="M7 1v2M7 11v2M1 7h2M11 7h2M2.8 2.8l1.4 1.4M9.8 9.8l1.4 1.4M2.8 11.2l1.4-1.4M9.8 4.2l1.4-1.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>),
  home: (s = 14) => (<svg width={s} height={s} viewBox="0 0 14 14" fill="none"><path d="M2 6l5-4 5 4v6H8v-4H6v4H2V6z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  list: (s = 14) => (<svg width={s} height={s} viewBox="0 0 14 14" fill="none"><path d="M2 4h10M2 7h10M2 10h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>),
  play: (s = 12) => (<svg width={s} height={s} viewBox="0 0 12 12" fill="currentColor"><path d="M3 2l7 4-7 4z"/></svg>),
  stop: (s = 12) => (<svg width={s} height={s} viewBox="0 0 12 12" fill="currentColor"><rect x="3" y="3" width="6" height="6" rx="1"/></svg>),
  check: (s = 12) => (<svg width={s} height={s} viewBox="0 0 12 12" fill="none"><path d="M2 6.5l3 3 5-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  x: (s = 12) => (<svg width={s} height={s} viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>),
  chev: (s = 10) => (<svg width={s} height={s} viewBox="0 0 10 10" fill="none"><path d="M3 2l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  briefcase: (s = 14) => (<svg width={s} height={s} viewBox="0 0 14 14" fill="none"><rect x="2" y="4" width="10" height="8" rx="1" stroke="currentColor" strokeWidth="1.4"/><path d="M5 4V3a1 1 0 011-1h2a1 1 0 011 1v1" stroke="currentColor" strokeWidth="1.4"/></svg>),
};

Object.assign(window, {
  TOKENS, Stat, Pill, Sparkline, BarChart, MapRoute, Button, Icon,
  fmtDist, fmtDistU, fmtMpg, fmtMoney, fmtMoneyShort,
});
