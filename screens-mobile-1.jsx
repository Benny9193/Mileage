// Mobile screens for Odo

// ───────────────────────────────────────────────────────────────
// Custom Odo header (replaces default IOSNavBar)
// ───────────────────────────────────────────────────────────────
function OdoHeader({ title, eyebrow, right, scale = 1 }) {
  return (
    <div style={{
      paddingTop: 56, paddingBottom: 14, padding: '56px 20px 14px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12,
    }}>
      <div>
        {eyebrow && (
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em',
            color: 'var(--ink-mute)', textTransform: 'uppercase', marginBottom: 6, fontWeight: 500,
          }}>{eyebrow}</div>
        )}
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 500,
          color: 'var(--ink)', letterSpacing: '-0.025em', lineHeight: 1,
        }}>{title}</div>
      </div>
      {right}
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// Tab bar
// ───────────────────────────────────────────────────────────────
function MobileTabBar({ active, onChange }) {
  const tabs = [
    { id: 'home', label: 'Today', icon: Icon.home },
    { id: 'history', label: 'Trips', icon: Icon.list },
    { id: 'add', label: '', icon: () => Icon.plus(18), big: true },
    { id: 'vehicle', label: 'Car', icon: Icon.car },
    { id: 'reports', label: 'Reports', icon: Icon.briefcase },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      background: 'color-mix(in oklch, var(--bg) 88%, transparent)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      borderTop: '1px solid var(--line)',
      padding: '10px 12px 28px',
      display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      zIndex: 30,
    }}>
      {tabs.map(t => {
        const isActive = t.id === active;
        if (t.big) {
          return (
            <button key={t.id} onClick={() => onChange(t.id)} style={{
              width: 48, height: 48, borderRadius: 14, border: 'none',
              background: 'var(--ink)', color: 'var(--bg)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}>
              {t.icon()}
            </button>
          );
        }
        return (
          <button key={t.id} onClick={() => onChange(t.id)} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            background: 'none', border: 'none', cursor: 'pointer',
            color: isActive ? 'var(--ink)' : 'var(--ink-mute)',
            padding: '4px 8px',
          }}>
            <div style={{ marginBottom: 1 }}>{t.icon(18)}</div>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.06em',
              fontWeight: 500, textTransform: 'uppercase',
            }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// HOME / TODAY
// ───────────────────────────────────────────────────────────────
function HomeScreen({ tracking, onToggleTrack, elapsed, distance, layout, cardStyle, unit }) {
  const today = TODAY_TOTALS;
  const todayTrips = TODAY_TRIPS;
  const recent = TRIPS.slice(0, 4);

  // Build last-7-days sparkline data
  const last7 = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date('2026-05-03');
    d.setDate(d.getDate() - i);
    const ds = d.toISOString().slice(0, 10);
    const total = TRIPS.filter(t => t.date === ds).reduce((s, t) => s + t.distance, 0);
    last7.push(total);
  }

  return (
    <div style={{ padding: '0 0 100px' }}>
      <OdoHeader
        eyebrow="Sun · May 3, 2026"
        title="Today"
        right={
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-mute)',
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: 3, background: 'var(--pos)' }} />
            AUTO ON
          </div>
        }
      />

      {/* Live tracker card */}
      <div style={{ padding: '0 16px 14px' }}>
        <div style={{
          background: tracking ? 'var(--ink)' : 'var(--surface)',
          color: tracking ? 'var(--bg)' : 'var(--ink)',
          borderRadius: 18, padding: 18,
          border: '1px solid ' + (tracking ? 'var(--ink)' : 'var(--line)'),
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em',
              opacity: 0.7, textTransform: 'uppercase',
            }}>
              {tracking ? '● Recording trip' : 'Manual tracking'}
            </div>
            {tracking && (
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.05em',
                opacity: 0.7,
              }}>
                {fmtTime((9 * 60 + 22))} →
              </div>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 18 }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 56, fontWeight: 400,
              letterSpacing: '-0.04em', lineHeight: 0.9,
            }}>
              {tracking ? fmtDist(distance, unit) : '0.0'}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, opacity: 0.6 }}>
              {unit === 'km' ? 'km' : 'mi'}
            </div>
            {tracking && (
              <div style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 18, opacity: 0.85 }}>
                {Math.floor(elapsed / 60)}:{String(elapsed % 60).padStart(2, '0')}
              </div>
            )}
          </div>
          <button onClick={onToggleTrack} style={{
            width: '100%', padding: '12px 14px', borderRadius: 10,
            border: 'none', cursor: 'pointer',
            background: tracking ? 'var(--bg)' : 'var(--ink)',
            color: tracking ? 'var(--ink)' : 'var(--bg)',
            fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 500,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            {tracking ? Icon.stop() : Icon.play()}
            {tracking ? 'Stop & save trip' : 'Start trip'}
          </button>
        </div>
      </div>

      {/* Stats row — varies by layout */}
      {layout === 'split' && (
        <div style={{ padding: '0 16px 14px' }}>
          <div style={{
            background: 'var(--surface)', borderRadius: 18, border: '1px solid var(--line)',
            padding: 16,
          }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12,
            }}>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em',
                color: 'var(--ink-mute)', textTransform: 'uppercase',
              }}>This week</div>
              <Sparkline values={last7} w={90} h={24} stroke="var(--accent)" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
              <Stat size="md" label="Distance" value={fmtDist(WEEK_TOTALS.distance, unit)} unit={unit === 'km' ? 'km' : 'mi'} />
              <Stat size="md" label="Trips" value={WEEK_TOTALS.count} />
              <Stat size="md" label="Spent" value={fmtMoneyShort(WEEK_TOTALS.cost)} />
            </div>
          </div>
        </div>
      )}

      {layout === 'hero' && (
        <div style={{ padding: '0 16px 14px' }}>
          <div style={{
            background: 'var(--surface)', borderRadius: 18, border: '1px solid var(--line)',
            padding: '20px 18px',
          }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em',
              color: 'var(--ink-mute)', textTransform: 'uppercase', marginBottom: 8,
            }}>This week, total</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 14 }}>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 48, fontWeight: 400,
                color: 'var(--ink)', letterSpacing: '-0.03em', lineHeight: 1,
              }}>{fmtDist(WEEK_TOTALS.distance, unit)}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--ink-dim)' }}>
                {unit === 'km' ? 'km' : 'mi'}
              </div>
              <div style={{ marginLeft: 'auto' }}>
                <Sparkline values={last7} w={100} h={32} stroke="var(--accent)" fill="color-mix(in oklch, var(--accent) 12%, transparent)" />
              </div>
            </div>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-dim)',
              borderTop: '1px solid var(--line)', paddingTop: 10,
            }}>
              <span>{WEEK_TOTALS.count} trips</span>
              <span>{fmtMoney(WEEK_TOTALS.cost)} fuel</span>
              <span>{fmtMpg(28.4, unit)}</span>
            </div>
          </div>
        </div>
      )}

      {layout === 'grid' && (
        <div style={{ padding: '0 16px 14px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { l: 'Today', v: fmtDist(today.distance, unit), u: unit === 'km' ? 'km' : 'mi' },
            { l: 'Trips today', v: today.count, u: '' },
            { l: 'This week', v: fmtDist(WEEK_TOTALS.distance, unit), u: unit === 'km' ? 'km' : 'mi' },
            { l: 'Spent (wk)', v: fmtMoneyShort(WEEK_TOTALS.cost), u: '' },
          ].map((s, i) => (
            <div key={i} style={{
              background: 'var(--surface)', borderRadius: 14, border: '1px solid var(--line)',
              padding: 14,
            }}>
              <Stat size="md" label={s.l} value={s.v} unit={s.u} />
            </div>
          ))}
        </div>
      )}

      {/* Recent trips */}
      <div style={{ padding: '6px 20px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em',
          color: 'var(--ink-mute)', textTransform: 'uppercase', fontWeight: 500,
        }}>Recent trips</div>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.06em',
          color: 'var(--ink-dim)',
        }}>{TRIPS.length} total</div>
      </div>

      <div style={{ padding: '0 16px' }}>
        {recent.map((t, i) => (
          <TripCard key={t.id} trip={t} style={cardStyle} unit={unit} isLast={i === recent.length - 1} />
        ))}
      </div>

      <div style={{ padding: '14px 16px' }}>
        <Button variant="ghost" full size="md">
          View all trips {Icon.arrowR(11)}
        </Button>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// Trip card — multiple styles
// ───────────────────────────────────────────────────────────────
function TripCard({ trip, style = 'editorial', unit, isLast = false, onClick }) {
  if (style === 'compact') {
    return (
      <div onClick={onClick} style={{
        padding: '12px 14px',
        borderBottom: isLast ? 'none' : '1px solid var(--line)',
        display: 'flex', alignItems: 'center', gap: 12,
        cursor: onClick ? 'pointer' : 'default',
      }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-mute)',
          width: 44, flexShrink: 0,
        }}>{trip.startTime.replace(' AM', 'a').replace(' PM', 'p')}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--ink)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{trip.from.name} → {trip.to.name}</div>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-dim)',
            marginTop: 2, letterSpacing: '0.03em',
          }}>{trip.purpose} · {trip.durMin}min</div>
        </div>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--ink)',
          textAlign: 'right',
        }}>
          {fmtDist(trip.distance, unit)}
          <span style={{ fontSize: 10, color: 'var(--ink-dim)', marginLeft: 2 }}>{unit === 'km' ? 'km' : 'mi'}</span>
        </div>
      </div>
    );
  }

  if (style === 'card') {
    return (
      <div onClick={onClick} style={{
        background: 'var(--surface)', borderRadius: 14, border: '1px solid var(--line)',
        padding: 14, marginBottom: 8,
        cursor: onClick ? 'pointer' : 'default',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <Pill tone={trip.purpose === 'Personal' ? 'neutral' : 'accent'} size="xs">{trip.purpose}</Pill>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-mute)' }}>
            {trip.startTime}
          </div>
        </div>
        <div style={{ fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--ink)', marginBottom: 8, fontWeight: 500 }}>
          {trip.from.name} → {trip.to.name}
        </div>
        <div style={{
          display: 'flex', gap: 18, fontFamily: 'var(--font-mono)', fontSize: 11,
          color: 'var(--ink-dim)',
        }}>
          <span><span style={{ color: 'var(--ink)' }}>{fmtDist(trip.distance, unit)}</span> {unit === 'km' ? 'km' : 'mi'}</span>
          <span>{trip.durMin}min</span>
          <span>{fmtMoney(trip.cost)}</span>
        </div>
      </div>
    );
  }

  // editorial (default)
  return (
    <div onClick={onClick} style={{
      padding: '14px 4px',
      borderBottom: isLast ? 'none' : '1px solid var(--line)',
      cursor: onClick ? 'pointer' : 'default',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-mute)',
          letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>
          {trip.startTime} — {trip.endTime}
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'baseline' }}>
          {trip.autoDetected && <Pill tone="ghost" size="xs">Auto</Pill>}
          <Pill tone={trip.purpose === 'Commute' ? 'accent' : 'neutral'} size="xs">{trip.purpose}</Pill>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: 'var(--font-ui)', fontSize: 15, color: 'var(--ink)',
            fontWeight: 500, lineHeight: 1.3,
          }}>{trip.from.name} → {trip.to.name}</div>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-dim)',
            marginTop: 3, letterSpacing: '0.04em',
          }}>{trip.durMin}min · {trip.avgSpeed} mph avg · {fmtMoney(trip.cost)}</div>
        </div>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 22, color: 'var(--ink)',
          fontWeight: 400, letterSpacing: '-0.02em',
        }}>
          {fmtDist(trip.distance, unit)}
          <span style={{ fontSize: 11, color: 'var(--ink-dim)', marginLeft: 3 }}>
            {unit === 'km' ? 'km' : 'mi'}
          </span>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// HISTORY
// ───────────────────────────────────────────────────────────────
function HistoryScreen({ cardStyle, unit, onSelectTrip }) {
  const [search, setSearch] = React.useState('');
  const [filter, setFilter] = React.useState('all');

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'Personal', label: 'Personal' },
    { id: 'Commute', label: 'Commute' },
    { id: 'Errand', label: 'Errand' },
    { id: 'Family', label: 'Family' },
  ];

  const filtered = TRIPS.filter(t => {
    if (filter !== 'all' && t.purpose !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!t.from.name.toLowerCase().includes(q) && !t.to.name.toLowerCase().includes(q)) return false;
    }
    return true;
  }).slice(0, 80);

  // Group by date
  const groups = {};
  filtered.forEach(t => {
    if (!groups[t.date]) groups[t.date] = [];
    groups[t.date].push(t);
  });

  return (
    <div style={{ padding: '0 0 100px' }}>
      <OdoHeader title="Trips" eyebrow={`${TRIPS.length} entries`} />

      <div style={{ padding: '0 16px 12px' }}>
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 10,
          display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px',
        }}>
          <span style={{ color: 'var(--ink-mute)' }}>{Icon.search()}</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by place"
            style={{
              flex: 1, border: 'none', background: 'transparent', outline: 'none',
              fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--ink)',
            }}
          />
        </div>
      </div>

      <div style={{
        padding: '0 16px 14px', display: 'flex', gap: 6, overflowX: 'auto',
      }}>
        {filters.map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)} style={{
            padding: '6px 12px', borderRadius: 999,
            background: filter === f.id ? 'var(--ink)' : 'var(--surface)',
            color: filter === f.id ? 'var(--bg)' : 'var(--ink-dim)',
            border: '1px solid ' + (filter === f.id ? 'var(--ink)' : 'var(--line)'),
            fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 500,
            cursor: 'pointer', whiteSpace: 'nowrap',
          }}>{f.label}</button>
        ))}
      </div>

      {Object.entries(groups).map(([date, trips]) => {
        const d = new Date(date);
        const total = trips.reduce((s, t) => s + t.distance, 0);
        return (
          <div key={date}>
            <div style={{
              padding: '10px 20px 6px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
              borderTop: '1px solid var(--line)',
              background: 'var(--surface-2)',
            }}>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em',
                color: 'var(--ink-dim)', textTransform: 'uppercase',
              }}>
                {d.toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-mute)' }}>
                {fmtDist(total, unit)} {unit === 'km' ? 'km' : 'mi'} · {trips.length} trips
              </div>
            </div>
            <div style={{ padding: cardStyle === 'card' ? '8px 16px' : '0 20px' }}>
              {trips.map((t, i) => (
                <TripCard key={t.id} trip={t} style={cardStyle} unit={unit}
                  isLast={i === trips.length - 1} onClick={() => onSelectTrip(t)} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

Object.assign(window, { OdoHeader, MobileTabBar, HomeScreen, TripCard, HistoryScreen });
