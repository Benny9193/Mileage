// Map view screen for mobile

function MapScreen({ unit, onClose }) {
  const todayTrips = TODAY_TRIPS.length > 0 ? TODAY_TRIPS : TRIPS.slice(0, 5);
  const [selected, setSelected] = React.useState(0);
  const t = todayTrips[selected] || todayTrips[0];

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      {/* Full-bleed map */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <svg width="100%" height="100%" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice"
          style={{ display: 'block' }}>
          <rect width="400" height="800" fill="var(--surface-2)" />
          {/* water */}
          <path d="M0 600 Q100 580 200 610 T400 640 L400 800 L0 800 Z" fill="color-mix(in oklch, var(--ink) 8%, var(--bg))" opacity="0.5"/>
          {/* streets */}
          {Array.from({ length: 16 }).map((_, i) => (
            <line key={'h' + i} x1="0" y1={i * 50 + 25} x2="400" y2={i * 50 + 25}
              stroke="var(--line)" strokeWidth={i % 3 === 0 ? 1.5 : 0.8} />
          ))}
          {Array.from({ length: 10 }).map((_, i) => (
            <line key={'v' + i} x1={i * 40 + 20} y1="0" x2={i * 40 + 20} y2="800"
              stroke="var(--line)" strokeWidth={i % 4 === 0 ? 1.5 : 0.8} />
          ))}
          <line x1="0" y1="180" x2="400" y2="320" stroke="var(--line)" strokeWidth="2" />
          <line x1="50" y1="0" x2="350" y2="800" stroke="var(--line)" strokeWidth="1.5" opacity="0.4" />
          {/* route */}
          <path d="M60 620 L60 480 L140 480 L140 360 L240 360 L240 220 L340 220"
            stroke="var(--accent)" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
          <path d="M60 620 L60 480 L140 480 L140 360 L240 360 L240 220 L340 220"
            stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
          {/* markers */}
          <circle cx="60" cy="620" r="9" fill="white" stroke="var(--ink)" strokeWidth="2.5" />
          <circle cx="60" cy="620" r="3" fill="var(--ink)" />
          <circle cx="340" cy="220" r="11" fill="var(--accent)" />
          <circle cx="340" cy="220" r="4" fill="white" />
          {/* mid markers */}
          {[[140, 480], [140, 360], [240, 360]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="3" fill="var(--accent)" stroke="white" strokeWidth="1.5" />
          ))}
        </svg>
      </div>

      {/* Top controls */}
      <div style={{
        position: 'absolute', top: 56, left: 16, right: 16, zIndex: 5,
        display: 'flex', justifyContent: 'space-between', gap: 8,
      }}>
        <button onClick={onClose} style={{
          width: 38, height: 38, borderRadius: 19,
          background: 'color-mix(in oklch, var(--bg) 90%, transparent)',
          backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid var(--line)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--ink)', cursor: 'pointer',
        }}>{Icon.x(14)}</button>
        <div style={{
          flex: 1, padding: '10px 14px', borderRadius: 19,
          background: 'color-mix(in oklch, var(--bg) 90%, transparent)',
          backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid var(--line)',
          display: 'flex', alignItems: 'center', gap: 8,
          fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--ink)',
        }}>
          {Icon.search(12)} <span style={{ color: 'var(--ink-dim)' }}>Search trips</span>
        </div>
      </div>

      {/* Bottom sheet */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 5,
        background: 'var(--bg)', borderRadius: '20px 20px 0 0',
        borderTop: '1px solid var(--line)',
        boxShadow: '0 -8px 30px rgba(0,0,0,0.08)',
        padding: '10px 0 30px',
      }}>
        <div style={{
          width: 36, height: 4, background: 'var(--line)', borderRadius: 2,
          margin: '0 auto 14px',
        }} />
        <div style={{
          padding: '0 20px 12px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        }}>
          <div>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em',
              color: 'var(--ink-mute)', textTransform: 'uppercase', marginBottom: 3,
            }}>Today's routes</div>
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--ink)',
              letterSpacing: '-0.01em', fontWeight: 500,
            }}>{todayTrips.length} trips · {fmtDist(TODAY_TOTALS.distance, unit)} {unit === 'km' ? 'km' : 'mi'}</div>
          </div>
        </div>
        <div style={{ padding: '0 16px', display: 'flex', gap: 8, overflowX: 'auto' }}>
          {todayTrips.map((tr, i) => (
            <div key={tr.id} onClick={() => setSelected(i)} style={{
              flexShrink: 0, width: 200, padding: 12, borderRadius: 12,
              background: i === selected ? 'var(--ink)' : 'var(--surface)',
              color: i === selected ? 'var(--bg)' : 'var(--ink)',
              border: '1px solid ' + (i === selected ? 'var(--ink)' : 'var(--line)'),
              cursor: 'pointer',
            }}>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.1em',
                opacity: 0.7, textTransform: 'uppercase', marginBottom: 6,
              }}>{tr.startTime}</div>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>
                {tr.from.name} → {tr.to.name}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, opacity: 0.7 }}>
                {fmtDist(tr.distance, unit)} {unit === 'km' ? 'km' : 'mi'} · {tr.durMin}min
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { MapScreen });
