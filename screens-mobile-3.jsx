// Trip detail, vehicle, reports, settings screens

// ───────────────────────────────────────────────────────────────
// TRIP DETAIL
// ───────────────────────────────────────────────────────────────
function TripDetailScreen({ trip, unit, onClose }) {
  if (!trip) return null;
  const v = VEHICLES.find(x => x.id === trip.vehicleId);
  return (
    <div style={{ padding: '0 0 40px' }}>
      <div style={{
        padding: '56px 20px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <button onClick={onClose} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--ink-dim)',
        }}>← Back</button>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-mute)' }}>
          #{trip.id}
        </div>
      </div>

      <div style={{ padding: '8px 20px 14px' }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em',
          color: 'var(--ink-mute)', textTransform: 'uppercase', marginBottom: 4,
        }}>{new Date(trip.date).toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--ink)',
          letterSpacing: '-0.02em', lineHeight: 1.15,
        }}>{trip.from.name}<br/><span style={{ color: 'var(--ink-mute)' }}>to</span> {trip.to.name}</div>
      </div>

      <div style={{ padding: '0 16px 14px' }}>
        <div style={{
          borderRadius: 14, overflow: 'hidden', border: '1px solid var(--line)',
        }}>
          <MapRoute w={370} h={200} />
        </div>
      </div>

      <div style={{ padding: '0 20px 14px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
          <Stat size="lg" label="Distance" value={fmtDist(trip.distance, unit)} unit={unit === 'km' ? 'km' : 'mi'} />
          <Stat size="lg" label="Duration" value={trip.durMin} unit="min" />
          <Stat size="md" label="Avg speed" value={trip.avgSpeed} unit="mph" />
          <Stat size="md" label="Fuel cost" value={fmtMoney(trip.cost)} />
        </div>

        <div style={{
          background: 'var(--surface)', borderRadius: 12, padding: 14, border: '1px solid var(--line)',
        }}>
          <DetailRow label="Started" value={trip.startTime} />
          <DetailRow label="Ended" value={trip.endTime} />
          <DetailRow label="Purpose" value={<Pill tone="accent" size="xs">{trip.purpose}</Pill>} />
          <DetailRow label="Vehicle" value={v.name} />
          <DetailRow label="MPG (this trip)" value={fmtMpg(trip.mpg, unit)} />
          <DetailRow label="Fuel used" value={trip.fuel.toFixed(2) + ' gal'} last />
        </div>

        {trip.notes && (
          <div style={{
            marginTop: 14, padding: 14, borderRadius: 12,
            background: 'var(--surface-2)', border: '1px solid var(--line)',
            fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--ink-dim)', lineHeight: 1.5,
          }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em',
              color: 'var(--ink-mute)', textTransform: 'uppercase', marginBottom: 6,
            }}>Notes</div>
            {trip.notes}
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
          <Button variant="ghost" full>Edit</Button>
          <Button variant="ghost" full>Duplicate</Button>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value, last }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '10px 0', borderBottom: last ? 'none' : '1px solid var(--line)',
      fontFamily: 'var(--font-ui)', fontSize: 13,
    }}>
      <span style={{ color: 'var(--ink-dim)' }}>{label}</span>
      <span style={{
        color: 'var(--ink)',
        fontFamily: typeof value === 'string' && /\d/.test(value) ? 'var(--font-mono)' : 'var(--font-ui)',
      }}>{value}</span>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// VEHICLE PROFILE / MPG STATS
// ───────────────────────────────────────────────────────────────
function VehicleScreen({ unit }) {
  const v = VEHICLES[0];
  const fuelHistory = FUEL_UPS.filter(f => f.vehicleId === v.id).slice().reverse();
  const mpgValues = MONTHLY.slice(-4).map(m => +(m.distance / m.fuel).toFixed(1));

  return (
    <div style={{ padding: '0 0 100px' }}>
      <OdoHeader eyebrow="Vehicle" title={v.name} />

      <div style={{ padding: '0 16px 14px' }}>
        <div style={{
          background: 'var(--surface)', borderRadius: 18, border: '1px solid var(--line)',
          padding: 18,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 12, background: v.color,
              color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{Icon.car(28)}</div>
            <div>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: 16, color: 'var(--ink)', fontWeight: 500 }}>
                {v.year} {v.make} {v.model}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-dim)', marginTop: 2 }}>
                {v.plate} · {v.fuelType}
              </div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Stat size="md" label="Odometer" value={v.odometer.toLocaleString()} unit={unit === 'km' ? 'km' : 'mi'} />
            <Stat size="md" label="Avg MPG" value={v.avgMpg} unit="mpg" />
          </div>
        </div>
      </div>

      <div style={{ padding: '0 16px 14px' }}>
        <div style={{
          background: 'var(--surface)', borderRadius: 18, border: '1px solid var(--line)',
          padding: 18,
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
            marginBottom: 14,
          }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em',
              color: 'var(--ink-mute)', textTransform: 'uppercase',
            }}>MPG by month</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink)' }}>
              ↑ 2.1 vs last qtr
            </div>
          </div>
          <BarChart data={MONTHLY.slice(-4).map((m, i) => ({
            label: m.month.slice(5),
            value: mpgValues[i],
          }))} w={332} h={120} accentIdx={mpgValues.length - 1} />
        </div>
      </div>

      <div style={{ padding: '6px 20px 8px' }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em',
          color: 'var(--ink-mute)', textTransform: 'uppercase', fontWeight: 500,
        }}>Fuel-ups</div>
      </div>

      <div style={{ padding: '0 20px' }}>
        {fuelHistory.map((f, i) => (
          <div key={f.id} style={{
            padding: '14px 0',
            borderBottom: i === fuelHistory.length - 1 ? 'none' : '1px solid var(--line)',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'var(--surface-2)', color: 'var(--ink-dim)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{Icon.fuel(16)}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--ink)' }}>{f.station}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-dim)', marginTop: 2 }}>
                {new Date(f.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })} · {f.gallons} gal @ ${f.ppg}
              </div>
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 16, color: 'var(--ink)',
            }}>{fmtMoney(f.total)}</div>
          </div>
        ))}
      </div>

      <div style={{ padding: '14px 16px' }}>
        <Button variant="quiet" full icon={Icon.plus(12)}>Log fuel-up</Button>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// REPORTS — date range picker + export
// ───────────────────────────────────────────────────────────────
function ReportsScreen({ unit }) {
  const [range, setRange] = React.useState('ytd');
  const [exporting, setExporting] = React.useState(false);
  const [exported, setExported] = React.useState(false);

  const ranges = [
    { id: 'week', label: 'Week', totals: WEEK_TOTALS },
    { id: 'month', label: 'Month', totals: MONTH_TOTALS },
    { id: 'quarter', label: 'Quarter', totals: { count: 312, distance: 4821, fuel: 169.7, cost: 718, durMin: 18420 } },
    { id: 'ytd', label: 'YTD', totals: YTD_TOTALS },
  ];
  const t = ranges.find(r => r.id === range).totals;

  // Purpose breakdown
  const breakdown = {};
  TRIPS.forEach(tr => { breakdown[tr.purpose] = (breakdown[tr.purpose] || 0) + tr.distance; });
  const total = Object.values(breakdown).reduce((s, v) => s + v, 0);
  const colors = {
    Personal: 'var(--accent)',
    Commute: 'var(--ink)',
    Errand: 'color-mix(in oklch, var(--ink) 50%, var(--bg))',
    Family: 'color-mix(in oklch, var(--accent) 50%, var(--bg))',
    Trip: 'color-mix(in oklch, var(--ink) 70%, var(--bg))',
  };

  function doExport() {
    setExporting(true);
    setTimeout(() => { setExporting(false); setExported(true); setTimeout(() => setExported(false), 2200); }, 1200);
  }

  return (
    <div style={{ padding: '0 0 100px' }}>
      <OdoHeader eyebrow="Tax-ready" title="Reports" />

      <div style={{
        padding: '0 16px 14px', display: 'flex', gap: 6,
      }}>
        {ranges.map(r => (
          <button key={r.id} onClick={() => setRange(r.id)} style={{
            flex: 1, padding: '8px 0', borderRadius: 8,
            background: range === r.id ? 'var(--ink)' : 'var(--surface)',
            color: range === r.id ? 'var(--bg)' : 'var(--ink-dim)',
            border: '1px solid ' + (range === r.id ? 'var(--ink)' : 'var(--line)'),
            fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 500,
            cursor: 'pointer',
          }}>{r.label}</button>
        ))}
      </div>

      <div style={{ padding: '0 16px 14px' }}>
        <div style={{
          background: 'var(--surface)', borderRadius: 18, border: '1px solid var(--line)',
          padding: 18,
        }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em',
            color: 'var(--ink-mute)', textTransform: 'uppercase', marginBottom: 12,
          }}>{range.toUpperCase()} · Jan 1 — May 3, 2026</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 16 }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 56, fontWeight: 400,
              color: 'var(--ink)', letterSpacing: '-0.04em', lineHeight: 0.9,
            }}>{fmtDist(t.distance, unit)}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--ink-dim)' }}>
              {unit === 'km' ? 'km' : 'mi'} total
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, paddingTop: 14, borderTop: '1px solid var(--line)' }}>
            <Stat size="sm" label="Trips" value={t.count} />
            <Stat size="sm" label="Fuel" value={fmtMoneyShort(t.cost)} />
            <Stat size="sm" label="Hours" value={(t.durMin / 60).toFixed(1)} />
          </div>
        </div>
      </div>

      <div style={{ padding: '0 16px 14px' }}>
        <div style={{
          background: 'var(--surface)', borderRadius: 18, border: '1px solid var(--line)',
          padding: 18,
        }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em',
            color: 'var(--ink-mute)', textTransform: 'uppercase', marginBottom: 12,
          }}>By purpose</div>
          {/* Stacked bar */}
          <div style={{
            height: 14, borderRadius: 4, overflow: 'hidden', display: 'flex',
            marginBottom: 14,
          }}>
            {Object.entries(breakdown).map(([k, v]) => (
              <div key={k} style={{ background: colors[k], width: `${(v / total) * 100}%` }} />
            ))}
          </div>
          {Object.entries(breakdown).sort((a,b) => b[1] - a[1]).map(([k, v]) => (
            <div key={k} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 0', borderBottom: '1px solid var(--line)',
            }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: colors[k] }} />
              <div style={{ flex: 1, fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--ink)' }}>{k}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink)' }}>
                {fmtDist(v, unit)} {unit === 'km' ? 'km' : 'mi'}
              </div>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-mute)',
                width: 36, textAlign: 'right',
              }}>{((v / total) * 100).toFixed(0)}%</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 16px' }}>
        <button onClick={doExport} disabled={exporting} style={{
          width: '100%', padding: '14px',
          background: exported ? 'var(--pos)' : 'var(--ink)',
          color: 'var(--bg)', border: 'none', borderRadius: 10,
          cursor: 'pointer',
          fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: 500,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          {exporting ? 'Generating PDF…' : exported ? '✓ Exported to Files' : <>{Icon.download(14)} Export PDF report</>}
        </button>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// SETTINGS
// ───────────────────────────────────────────────────────────────
function SettingsScreen({ tweaks, setTweak }) {
  return (
    <div style={{ padding: '0 0 100px' }}>
      <OdoHeader title="Settings" />

      <SettingsGroup label="Display">
        <SettingsRow label="Distance unit" value={tweaks.unit === 'km' ? 'Kilometers' : 'Miles'} />
        <SettingsRow label="Theme" value={tweaks.dark ? 'Dark' : 'Light'} />
        <SettingsRow label="Density" value={tweaks.density === 'compact' ? 'Compact' : 'Comfortable'} last />
      </SettingsGroup>

      <SettingsGroup label="Tracking">
        <SettingsRow label="Auto-detect trips" value="On" />
        <SettingsRow label="Default purpose" value="Personal" />
        <SettingsRow label="Tag work trips" value="Mon–Fri 8a–6p" last />
      </SettingsGroup>

      <SettingsGroup label="Vehicles">
        {VEHICLES.map((v, i) => (
          <SettingsRow key={v.id} label={v.name} value={`${v.year} ${v.make}`} last={i === VEHICLES.length - 1} />
        ))}
      </SettingsGroup>

      <SettingsGroup label="Data">
        <SettingsRow label="Export all" value="" />
        <SettingsRow label="Backup" value="iCloud" />
        <SettingsRow label="About" value="Odo 2.4.1" last />
      </SettingsGroup>
    </div>
  );
}

function SettingsGroup({ label, children }) {
  return (
    <>
      <div style={{
        padding: '14px 20px 6px',
        fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em',
        color: 'var(--ink-mute)', textTransform: 'uppercase', fontWeight: 500,
      }}>{label}</div>
      <div style={{ padding: '0 16px 8px' }}>
        <div style={{
          background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--line)',
          overflow: 'hidden',
        }}>{children}</div>
      </div>
    </>
  );
}

function SettingsRow({ label, value, last }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '12px 14px',
      borderBottom: last ? 'none' : '1px solid var(--line)',
      fontFamily: 'var(--font-ui)', fontSize: 14,
    }}>
      <span style={{ color: 'var(--ink)' }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ color: 'var(--ink-dim)', fontFamily: /\d/.test(value) ? 'var(--font-mono)' : 'var(--font-ui)', fontSize: 12 }}>{value}</span>
        <span style={{ color: 'var(--ink-mute)' }}>{Icon.chev()}</span>
      </div>
    </div>
  );
}

Object.assign(window, { TripDetailScreen, VehicleScreen, ReportsScreen, SettingsScreen });
