// More mobile screens

// ───────────────────────────────────────────────────────────────
// ADD TRIP — manual form with validation
// ───────────────────────────────────────────────────────────────
function AddTripScreen({ unit, onClose, onSave }) {
  const [form, setForm] = React.useState({
    from: '', to: '', distance: '', date: '2026-05-03',
    startTime: '09:00', purpose: 'Personal', notes: '', vehicleId: 'v1',
  });
  const [errors, setErrors] = React.useState({});
  const [saved, setSaved] = React.useState(false);

  function update(k, v) { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: null })); }

  function validate() {
    const e = {};
    if (!form.from) e.from = 'Required';
    if (!form.to) e.to = 'Required';
    if (form.from && form.to && form.from === form.to) e.to = 'Must differ from origin';
    if (!form.distance) e.distance = 'Required';
    else if (isNaN(+form.distance) || +form.distance <= 0) e.distance = 'Must be a positive number';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    setSaved(true);
    setTimeout(() => { onSave && onSave(form); onClose && onClose(); }, 900);
  }

  const purposes = ['Personal', 'Errand', 'Commute', 'Family', 'Trip'];

  return (
    <div style={{ padding: '0 0 40px' }}>
      <div style={{
        padding: '56px 20px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <button onClick={onClose} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--ink-dim)',
          padding: 0,
        }}>Cancel</button>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 500,
          color: 'var(--ink)',
        }}>New trip</div>
        <button onClick={handleSave} disabled={saved} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: 500,
          color: saved ? 'var(--pos)' : 'var(--accent)', padding: 0,
        }}>{saved ? '✓ Saved' : 'Save'}</button>
      </div>

      <div style={{ padding: '8px 16px' }}>
        {/* From / To */}
        <FormSection label="Route">
          <FormRow label="From" error={errors.from}>
            <select value={form.from} onChange={e => update('from', e.target.value)}
              style={inputStyle(errors.from)}>
              <option value="">Choose origin…</option>
              {PLACES.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
            </select>
          </FormRow>
          <FormRow label="To" error={errors.to}>
            <select value={form.to} onChange={e => update('to', e.target.value)}
              style={inputStyle(errors.to)}>
              <option value="">Choose destination…</option>
              {PLACES.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
            </select>
          </FormRow>
        </FormSection>

        <FormSection label="Distance & Time">
          <FormRow label={`Distance (${unit === 'km' ? 'km' : 'mi'})`} error={errors.distance}>
            <input type="text" inputMode="decimal" value={form.distance}
              onChange={e => update('distance', e.target.value)}
              placeholder="0.0"
              style={{ ...inputStyle(errors.distance), fontFamily: 'var(--font-mono)' }} />
          </FormRow>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <FormRow label="Date">
              <input type="date" value={form.date}
                onChange={e => update('date', e.target.value)}
                style={{ ...inputStyle(), fontFamily: 'var(--font-mono)' }} />
            </FormRow>
            <FormRow label="Start time">
              <input type="time" value={form.startTime}
                onChange={e => update('startTime', e.target.value)}
                style={{ ...inputStyle(), fontFamily: 'var(--font-mono)' }} />
            </FormRow>
          </div>
        </FormSection>

        <FormSection label="Purpose">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {purposes.map(p => (
              <button key={p} onClick={() => update('purpose', p)} style={{
                padding: '8px 14px', borderRadius: 8,
                background: form.purpose === p ? 'var(--ink)' : 'var(--surface)',
                color: form.purpose === p ? 'var(--bg)' : 'var(--ink-dim)',
                border: '1px solid ' + (form.purpose === p ? 'var(--ink)' : 'var(--line)'),
                fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 500,
                cursor: 'pointer',
              }}>{p}</button>
            ))}
          </div>
        </FormSection>

        <FormSection label="Vehicle">
          {VEHICLES.map(v => (
            <button key={v.id} onClick={() => update('vehicleId', v.id)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 14px', borderRadius: 10, marginBottom: 6,
              background: form.vehicleId === v.id ? 'var(--surface)' : 'transparent',
              border: '1px solid ' + (form.vehicleId === v.id ? 'var(--ink)' : 'var(--line)'),
              cursor: 'pointer', textAlign: 'left',
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 6, background: v.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white',
              }}>{Icon.car(16)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--ink)', fontWeight: 500 }}>{v.name}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-dim)' }}>
                  {v.year} {v.make} {v.model}
                </div>
              </div>
              {form.vehicleId === v.id && <span style={{ color: 'var(--accent)' }}>{Icon.check(14)}</span>}
            </button>
          ))}
        </FormSection>

        <FormSection label="Notes (optional)">
          <textarea value={form.notes} onChange={e => update('notes', e.target.value)}
            placeholder="Anything to remember…"
            style={{ ...inputStyle(), minHeight: 70, resize: 'none', fontFamily: 'var(--font-ui)' }} />
        </FormSection>

        {Object.keys(errors).length > 0 && (
          <div style={{
            background: 'color-mix(in oklch, var(--neg) 10%, transparent)',
            border: '1px solid color-mix(in oklch, var(--neg) 30%, transparent)',
            borderRadius: 8, padding: '10px 12px', marginTop: 8,
            fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--neg)',
          }}>
            {Object.keys(errors).length} field{Object.keys(errors).length > 1 ? 's' : ''} need attention
          </div>
        )}
      </div>
    </div>
  );
}

function FormSection({ label, children }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em',
        color: 'var(--ink-mute)', textTransform: 'uppercase', marginBottom: 8, fontWeight: 500,
      }}>{label}</div>
      {children}
    </div>
  );
}

function FormRow({ label, error, children }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{
        fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--ink-dim)',
        marginBottom: 4,
      }}>
        {label} {error && <span style={{ color: 'var(--neg)', marginLeft: 6 }}>· {error}</span>}
      </div>
      {children}
    </div>
  );
}

function inputStyle(error) {
  return {
    width: '100%', boxSizing: 'border-box',
    padding: '10px 12px', borderRadius: 8,
    background: 'var(--surface)',
    border: '1px solid ' + (error ? 'var(--neg)' : 'var(--line)'),
    fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--ink)',
    outline: 'none',
  };
}

// ───────────────────────────────────────────────────────────────
// AUTO-DETECTED TRIP REVIEW — swipe-style classifier
// ───────────────────────────────────────────────────────────────
function AutoReviewScreen({ unit, onClose }) {
  const candidates = TRIPS.filter(t => t.autoDetected && !t.reviewed).slice(0, 5);
  const [idx, setIdx] = React.useState(0);
  const [decisions, setDecisions] = React.useState({});

  if (idx >= candidates.length) {
    return (
      <div style={{ padding: '120px 30px', textAlign: 'center' }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em',
          color: 'var(--ink-mute)', textTransform: 'uppercase', marginBottom: 12,
        }}>All caught up</div>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--ink)',
          letterSpacing: '-0.02em', marginBottom: 20,
        }}>Inbox cleared</div>
        <div style={{
          fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--ink-dim)',
          marginBottom: 30, lineHeight: 1.5,
        }}>You classified {Object.keys(decisions).length} trip{Object.keys(decisions).length === 1 ? '' : 's'}.</div>
        <Button variant="primary" onClick={onClose}>Done</Button>
      </div>
    );
  }

  const t = candidates[idx];

  function decide(purpose) {
    setDecisions(d => ({ ...d, [t.id]: purpose }));
    setTimeout(() => setIdx(i => i + 1), 200);
  }

  return (
    <div style={{ padding: '0 0 40px' }}>
      <div style={{
        padding: '56px 20px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <button onClick={onClose} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--ink-dim)',
        }}>{Icon.x(14)}</button>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-mute)' }}>
          {idx + 1} / {candidates.length}
        </div>
        <div style={{ width: 14 }} />
      </div>

      <div style={{ padding: '4px 20px 14px' }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em',
          color: 'var(--ink-mute)', textTransform: 'uppercase', marginBottom: 4,
        }}>Auto-detected</div>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--ink)',
          letterSpacing: '-0.02em', lineHeight: 1.2,
        }}>How should we file this trip?</div>
      </div>

      <div style={{ padding: '0 16px' }}>
        <div style={{
          background: 'var(--surface)', borderRadius: 18, border: '1px solid var(--line)',
          overflow: 'hidden',
        }}>
          <MapRoute w={370} h={170} />
          <div style={{ padding: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.06em',
                color: 'var(--ink-mute)', textTransform: 'uppercase',
              }}>{new Date(t.date).toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-mute)' }}>
                {t.startTime} — {t.endTime}
              </div>
            </div>
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink)',
              letterSpacing: '-0.02em', marginBottom: 14,
            }}>{t.from.name} → {t.to.name}</div>
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14,
              paddingTop: 14, borderTop: '1px solid var(--line)',
            }}>
              <Stat size="sm" label="Distance" value={fmtDist(t.distance, unit)} unit={unit === 'km' ? 'km' : 'mi'} />
              <Stat size="sm" label="Duration" value={t.durMin} unit="min" />
              <Stat size="sm" label="Avg speed" value={t.avgSpeed} unit="mph" />
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '20px 16px 8px' }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em',
          color: 'var(--ink-mute)', textTransform: 'uppercase', marginBottom: 10,
        }}>Classify</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {['Personal', 'Commute', 'Errand', 'Family'].map(p => (
            <button key={p} onClick={() => decide(p)} style={{
              padding: '14px 12px', borderRadius: 10,
              background: 'var(--surface)', border: '1px solid var(--line)',
              fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: 500,
              color: 'var(--ink)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              {p} <span style={{ color: 'var(--ink-mute)' }}>{Icon.chev(8)}</span>
            </button>
          ))}
        </div>
        <button onClick={() => decide('Skip')} style={{
          marginTop: 10, width: '100%', padding: '12px',
          background: 'transparent', border: 'none', cursor: 'pointer',
          fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--ink-dim)',
        }}>Skip for now</button>
      </div>
    </div>
  );
}

Object.assign(window, { AddTripScreen, AutoReviewScreen });
