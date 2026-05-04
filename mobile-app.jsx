// MobileApp wrapper — manages screen routing
function MobileApp({ tweaks, setTweak }) {
  const [tab, setTab] = React.useState('home');
  const [overlay, setOverlay] = React.useState(null); // 'add' | 'review' | 'map' | {trip}
  const [tracking, setTracking] = React.useState(false);
  const [elapsed, setElapsed] = React.useState(0);
  const [distance, setDistance] = React.useState(0);

  React.useEffect(() => {
    if (!tracking) return;
    const iv = setInterval(() => {
      setElapsed(e => e + 1);
      setDistance(d => +(d + 0.018 + Math.random() * 0.012).toFixed(2));
    }, 1000);
    return () => clearInterval(iv);
  }, [tracking]);

  function toggleTrack() {
    if (tracking) { setTracking(false); setElapsed(0); setDistance(0); }
    else { setTracking(true); }
  }

  function handleTab(t) {
    if (t === 'add') { setOverlay('add'); return; }
    setTab(t);
  }

  let content;
  if (tab === 'home') content = <HomeScreen tracking={tracking} onToggleTrack={toggleTrack}
    elapsed={elapsed} distance={distance}
    layout={tweaks.homeLayout} cardStyle={tweaks.cardStyle} unit={tweaks.unit} />;
  else if (tab === 'history') content = <HistoryScreen cardStyle={tweaks.cardStyle} unit={tweaks.unit}
    onSelectTrip={(tr) => setOverlay({ trip: tr })} />;
  else if (tab === 'vehicle') content = <VehicleScreen unit={tweaks.unit} />;
  else if (tab === 'reports') content = <ReportsScreen unit={tweaks.unit} />;
  else if (tab === 'settings') content = <SettingsScreen tweaks={tweaks} setTweak={setTweak} />;

  // Overlay screens
  let overlayContent = null;
  if (overlay === 'add') overlayContent = <AddTripScreen unit={tweaks.unit} onClose={() => setOverlay(null)} />;
  else if (overlay === 'review') overlayContent = <AutoReviewScreen unit={tweaks.unit} onClose={() => setOverlay(null)} />;
  else if (overlay === 'map') overlayContent = <MapScreen unit={tweaks.unit} onClose={() => setOverlay(null)} />;
  else if (overlay && overlay.trip) overlayContent = <TripDetailScreen trip={overlay.trip} unit={tweaks.unit} onClose={() => setOverlay(null)} />;

  return (
    <div style={{
      width: '100%', height: '100%', position: 'relative',
      background: 'var(--bg)', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ flex: 1, overflow: 'auto', position: 'relative' }}>
        {content}
      </div>

      {/* Quick action chips for review/map (only when no overlay) */}
      {!overlayContent && tab === 'home' && (
        <div style={{
          position: 'absolute', bottom: 102, right: 16, zIndex: 25,
          display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end',
        }}>
          <button onClick={() => setOverlay('review')} style={{
            padding: '8px 12px', borderRadius: 999,
            background: 'var(--surface)', border: '1px solid var(--line)',
            fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 500,
            color: 'var(--ink)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
            boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: 3, background: 'var(--accent)',
            }} />
            5 to review
          </button>
          <button onClick={() => setOverlay('map')} style={{
            padding: '8px 12px', borderRadius: 999,
            background: 'var(--surface)', border: '1px solid var(--line)',
            fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 500,
            color: 'var(--ink)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
            boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
          }}>
            {Icon.pin(12)} Map
          </button>
        </div>
      )}

      {!overlayContent && <MobileTabBar active={tab} onChange={handleTab} />}

      {overlayContent && (
        <div style={{
          position: 'absolute', inset: 0, background: 'var(--bg)',
          zIndex: 40, overflow: 'auto',
        }}>{overlayContent}</div>
      )}
    </div>
  );
}

Object.assign(window, { MobileApp });
