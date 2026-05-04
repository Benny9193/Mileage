// Web dashboard — desktop view

function WebDashboard({ unit, density }) {
  const [range, setRange] = React.useState('30d');
  const [showDatePicker, setShowDatePicker] = React.useState(false);

  // Last 30 days bar data
  const last30 = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date('2026-05-03');
    d.setDate(d.getDate() - i);
    const ds = d.toISOString().slice(0, 10);
    const total = TRIPS.filter(t => t.date === ds).reduce((s, t) => s + t.distance, 0);
    last30.push({ date: ds, value: +total.toFixed(1) });
  }
  const max30 = Math.max(...last30.map(d => d.value), 1);

  const purposeBreakdown = {};
  TRIPS.forEach(t => { purposeBreakdown[t.purpose] = (purposeBreakdown[t.purpose] || 0) + t.distance; });
  const purposeTotal = Object.values(purposeBreakdown).reduce((s, v) => s + v, 0);
  const purposeColors = {
    Personal: 'var(--accent)',
    Commute: 'var(--ink)',
    Errand: 'color-mix(in oklch, var(--ink) 55%, var(--bg))',
    Family: 'color-mix(in oklch, var(--accent) 55%, var(--bg))',
    Trip: 'color-mix(in oklch, var(--ink) 75%, var(--bg))',
  };

  const pad = density === 'compact' ? '12px 16px' : '20px 24px';
  const rowPad = density === 'compact' ? '6px 0' : '10px 0';

  return (
    <div style={{
      width: '100%', height: '100%', overflow: 'auto',
      background: 'var(--bg)', color: 'var(--ink)',
      fontFamily: 'var(--font-ui)',
    }}>
      {/* Sidebar + content layout */}
      <div style={{ display: 'flex', minHeight: '100%' }}>
        {/* Sidebar */}
        <aside style={{
          width: 220, borderRight: '1px solid var(--line)',
          padding: '20px 16px', flexShrink: 0,
          background: 'var(--surface-2)',
          display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '4px 4px 16px',
            fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600,
            letterSpacing: '-0.02em',
          }}>
            <div style={{
              width: 24, height: 24, borderRadius: 6,
              background: 'var(--ink)', color: 'var(--bg)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600,
            }}>O</div>
            Odo
          </div>
          {[
            { l: 'Overview', i: Icon.home, active: true },
            { l: 'Trips', i: Icon.list },
            { l: 'Vehicles', i: Icon.car },
            { l: 'Fuel', i: Icon.fuel },
            { l: 'Reports', i: Icon.briefcase },
            { l: 'Map', i: Icon.pin },
          ].map(item => (
            <div key={item.l} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 10px', borderRadius: 6,
              background: item.active ? 'var(--surface)' : 'transparent',
              border: '1px solid ' + (item.active ? 'var(--line)' : 'transparent'),
              color: item.active ? 'var(--ink)' : 'var(--ink-dim)',
              fontSize: 13, fontWeight: 500, cursor: 'pointer',
            }}>
              {item.i(14)} {item.l}
            </div>
          ))}
          <div style={{ flex: 1 }} />
          <div style={{
            padding: 12, borderRadius: 8, background: 'var(--surface)',
            border: '1px solid var(--line)', marginTop: 10,
          }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.1em',
              color: 'var(--ink-mute)', textTransform: 'uppercase', marginBottom: 4,
            }}>This week</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, color: 'var(--ink)' }}>
              {fmtDist(WEEK_TOTALS.distance, unit)}
              <span style={{ fontSize: 10, color: 'var(--ink-dim)', marginLeft: 3 }}>{unit === 'km' ? 'km' : 'mi'}</span>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main style={{ flex: 1, minWidth: 0 }}>
          {/* Top bar */}
          <div style={{
            padding: pad, borderBottom: '1px solid var(--line)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: 'var(--bg)',
          }}>
            <div>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em',
                color: 'var(--ink-mute)', textTransform: 'uppercase', marginBottom: 4,
              }}>Sun · May 3, 2026</div>
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--ink)',
                letterSpacing: '-0.02em', fontWeight: 600,
              }}>Overview</div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', position: 'relative' }}>
              <div style={{ display: 'flex', gap: 0, border: '1px solid var(--line)', borderRadius: 6, overflow: 'hidden' }}>
                {['7d', '30d', '90d', 'YTD'].map(r => (
                  <button key={r} onClick={() => setRange(r)} style={{
                    padding: '6px 12px',
                    background: range === r ? 'var(--ink)' : 'var(--bg)',
                    color: range === r ? 'var(--bg)' : 'var(--ink-dim)',
                    border: 'none', cursor: 'pointer',
                    fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500,
                  }}>{r}</button>
                ))}
              </div>
              <button onClick={() => setShowDatePicker(s => !s)} style={{
                padding: '6px 12px', borderRadius: 6,
                background: 'var(--bg)', border: '1px solid var(--line)',
                color: 'var(--ink-dim)', cursor: 'pointer',
                fontFamily: 'var(--font-ui)', fontSize: 12,
                display: 'flex', alignItems: 'center', gap: 6,
              }}>{Icon.clock(12)} Custom range</button>
              <Button variant="primary" size="sm" icon={Icon.download(12)}>Export</Button>
              {showDatePicker && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 6px)', right: 0,
                  background: 'var(--bg)', border: '1px solid var(--line)',
                  borderRadius: 10, padding: 14, width: 280, zIndex: 30,
                  boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
                }}>
                  <DateRangePicker onClose={() => setShowDatePicker(false)} />
                </div>
              )}
            </div>
          </div>

          {/* KPI row */}
          <div style={{
            padding: pad, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14,
          }}>
            {[
              { l: 'Distance', v: fmtDist(MONTH_TOTALS.distance, unit), u: unit === 'km' ? 'km' : 'mi', d: '+12.4%', pos: true },
              { l: 'Trips', v: MONTH_TOTALS.count, u: '', d: '+8', pos: true },
              { l: 'Fuel cost', v: fmtMoneyShort(MONTH_TOTALS.cost), u: '', d: '−$24', pos: true },
              { l: 'Avg MPG', v: '28.4', u: 'mpg', d: '+0.6', pos: true },
            ].map((k, i) => (
              <div key={i} style={{
                background: 'var(--surface)', borderRadius: 10, border: '1px solid var(--line)',
                padding: density === 'compact' ? 12 : 16,
              }}>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em',
                  color: 'var(--ink-mute)', textTransform: 'uppercase', marginBottom: 6,
                }}>{k.l}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 28, color: 'var(--ink)',
                    fontWeight: 400, letterSpacing: '-0.02em',
                  }}>{k.v}</span>
                  {k.u && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-dim)' }}>{k.u}</span>}
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 10,
                  color: k.pos ? 'var(--pos)' : 'var(--neg)', marginTop: 4,
                }}>{k.d} vs prev</div>
              </div>
            ))}
          </div>

          {/* Chart + breakdown */}
          <div style={{
            padding: `0 ${density === 'compact' ? '16px' : '24px'} ${density === 'compact' ? '12px' : '20px'}`,
            display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14,
          }}>
            <div style={{
              background: 'var(--surface)', borderRadius: 10, border: '1px solid var(--line)',
              padding: density === 'compact' ? 14 : 20,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
                <div>
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em',
                    color: 'var(--ink-mute)', textTransform: 'uppercase',
                  }}>Daily distance</div>
                  <div style={{
                    fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--ink)',
                    fontWeight: 600, marginTop: 2, letterSpacing: '-0.01em',
                  }}>Last 30 days</div>
                </div>
                <div style={{ display: 'flex', gap: 12, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-dim)' }}>
                  <span><span style={{ color: 'var(--ink)' }}>●</span> Distance</span>
                  <span><span style={{ color: 'var(--accent)' }}>●</span> 7-day avg</span>
                </div>
              </div>
              <DailyChart data={last30} max={max30} unit={unit} />
            </div>

            <div style={{
              background: 'var(--surface)', borderRadius: 10, border: '1px solid var(--line)',
              padding: density === 'compact' ? 14 : 20,
            }}>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em',
                color: 'var(--ink-mute)', textTransform: 'uppercase', marginBottom: 16,
              }}>By purpose</div>
              <DonutChart data={purposeBreakdown} total={purposeTotal} colors={purposeColors} />
              <div style={{ marginTop: 14 }}>
                {Object.entries(purposeBreakdown).sort((a,b) => b[1] - a[1]).map(([k, v]) => (
                  <div key={k} style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: rowPad,
                  }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: purposeColors[k] }} />
                    <span style={{ flex: 1, fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--ink)' }}>{k}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-dim)' }}>
                      {((v / purposeTotal) * 100).toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Map + recent trips */}
          <div style={{
            padding: `0 ${density === 'compact' ? '16px' : '24px'} ${density === 'compact' ? '12px' : '20px'}`,
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14,
          }}>
            <div style={{
              background: 'var(--surface)', borderRadius: 10, border: '1px solid var(--line)',
              padding: density === 'compact' ? 14 : 20,
            }}>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em',
                color: 'var(--ink-mute)', textTransform: 'uppercase', marginBottom: 12,
              }}>Today's route</div>
              <div style={{ borderRadius: 6, overflow: 'hidden', border: '1px solid var(--line)' }}>
                <MapRoute w={420} h={220} dense />
              </div>
              <div style={{
                marginTop: 10, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-dim)',
                display: 'flex', justifyContent: 'space-between',
              }}>
                <span>{TODAY_TRIPS.length} trips</span>
                <span>{fmtDist(TODAY_TOTALS.distance, unit)} {unit === 'km' ? 'km' : 'mi'}</span>
              </div>
            </div>

            <div style={{
              background: 'var(--surface)', borderRadius: 10, border: '1px solid var(--line)',
              padding: density === 'compact' ? 14 : 20,
            }}>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em',
                color: 'var(--ink-mute)', textTransform: 'uppercase', marginBottom: 12,
              }}>Recent trips</div>
              <div>
                {TRIPS.slice(0, density === 'compact' ? 7 : 5).map((t, i) => (
                  <div key={t.id} style={{
                    display: 'grid', gridTemplateColumns: '52px 1fr auto auto', gap: 10,
                    padding: rowPad, alignItems: 'center',
                    borderBottom: i === 4 ? 'none' : '1px solid var(--line)',
                  }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-mute)' }}>
                      {t.startTime.replace(' AM', 'a').replace(' PM', 'p')}
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--ink)',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>{t.from.name} → {t.to.name}</span>
                    <Pill tone="ghost" size="xs">{t.purpose}</Pill>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink)', textAlign: 'right' }}>
                      {fmtDist(t.distance, unit)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function DailyChart({ data, max, unit }) {
  const w = 540, h = 180;
  const barW = (w - 30) / data.length;
  // Compute 7-day moving avg
  const ma = data.map((d, i) => {
    const slice = data.slice(Math.max(0, i - 6), i + 1);
    return slice.reduce((s, x) => s + x.value, 0) / slice.length;
  });
  const maPts = ma.map((v, i) => [i * barW + barW / 2, h - 30 - (v / max) * (h - 50)]);
  const maD = maPts.map((p, i) => (i === 0 ? 'M' : 'L') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  return (
    <svg width={w} height={h} style={{ width: '100%', height: 'auto', display: 'block' }} viewBox={`0 0 ${w} ${h}`}>
      {/* gridlines */}
      {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
        <line key={i} x1="0" y1={h - 30 - p * (h - 50)} x2={w} y2={h - 30 - p * (h - 50)}
          stroke="var(--line)" strokeWidth="1" strokeDasharray={p === 0 ? '' : '2 3'} />
      ))}
      {data.map((d, i) => {
        const bh = (d.value / max) * (h - 50);
        return (
          <rect key={i} x={i * barW + 2} y={h - 30 - bh} width={barW - 4} height={bh} rx="1.5"
            fill="var(--ink)" opacity="0.85" />
        );
      })}
      <path d={maD} stroke="var(--accent)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* x labels — every 5th day */}
      {data.map((d, i) => i % 5 === 0 && (
        <text key={'l' + i} x={i * barW + barW / 2} y={h - 12} textAnchor="middle"
          fontSize="9" fontFamily="var(--font-mono)" fill="var(--ink-mute)" letterSpacing="0.04em">
          {d.date.slice(5)}
        </text>
      ))}
    </svg>
  );
}

function DonutChart({ data, total, colors }) {
  const r = 60, cx = 90, cy = 70, sw = 18;
  let cur = -Math.PI / 2;
  const arcs = Object.entries(data).map(([k, v]) => {
    const angle = (v / total) * 2 * Math.PI;
    const x1 = cx + r * Math.cos(cur), y1 = cy + r * Math.sin(cur);
    cur += angle;
    const x2 = cx + r * Math.cos(cur), y2 = cy + r * Math.sin(cur);
    const large = angle > Math.PI ? 1 : 0;
    return { k, d: `M${x1} ${y1} A${r} ${r} 0 ${large} 1 ${x2} ${y2}` };
  });
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="180" height="140" viewBox="0 0 180 140">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--line)" strokeWidth="1" />
        {arcs.map(a => (
          <path key={a.k} d={a.d} fill="none" stroke={colors[a.k]} strokeWidth={sw} strokeLinecap="butt" />
        ))}
        <text x={cx} y={cy - 2} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="20" fill="var(--ink)">
          {Object.values(data).reduce((s,v)=>s+v,0).toFixed(0)}
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9" fill="var(--ink-mute)" letterSpacing="0.1em">TOTAL MI</text>
      </svg>
    </div>
  );
}

function DateRangePicker({ onClose }) {
  const [start, setStart] = React.useState('2026-04-01');
  const [end, setEnd] = React.useState('2026-05-03');
  return (
    <div>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em',
        color: 'var(--ink-mute)', textTransform: 'uppercase', marginBottom: 10,
      }}>Custom range</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
        <div>
          <div style={{ fontSize: 10, color: 'var(--ink-dim)', marginBottom: 3 }}>From</div>
          <input type="date" value={start} onChange={e => setStart(e.target.value)} style={{
            width: '100%', boxSizing: 'border-box', padding: '6px 8px',
            border: '1px solid var(--line)', borderRadius: 6,
            fontFamily: 'var(--font-mono)', fontSize: 11, background: 'var(--bg)', color: 'var(--ink)',
          }} />
        </div>
        <div>
          <div style={{ fontSize: 10, color: 'var(--ink-dim)', marginBottom: 3 }}>To</div>
          <input type="date" value={end} onChange={e => setEnd(e.target.value)} style={{
            width: '100%', boxSizing: 'border-box', padding: '6px 8px',
            border: '1px solid var(--line)', borderRadius: 6,
            fontFamily: 'var(--font-mono)', fontSize: 11, background: 'var(--bg)', color: 'var(--ink)',
          }} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
        {['Last 7d', 'Last 30d', 'This month', 'Last quarter', 'YTD'].map(p => (
          <button key={p} style={{
            padding: '4px 8px', borderRadius: 999,
            border: '1px solid var(--line)', background: 'var(--bg)',
            fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-dim)',
            cursor: 'pointer',
          }}>{p}</button>
        ))}
      </div>
      <Button variant="primary" size="sm" full onClick={onClose}>Apply</Button>
    </div>
  );
}

Object.assign(window, { WebDashboard });
