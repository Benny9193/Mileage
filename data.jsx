// Mock data for Odo — Mileage Tracker

const VEHICLES = [
  {
    id: 'v1', name: 'The Wagon', make: 'Volvo', model: 'V60', year: 2021, plate: 'HRR-2240',
    color: '#2C3E50', odometer: 47821, avgMpg: 28.4, tankSize: 15.9, fuelType: 'Regular',
  },
  {
    id: 'v2', name: 'The Runabout', make: 'Honda', model: 'Civic', year: 2018, plate: 'HRR-1108',
    color: '#7B6F5A', odometer: 89432, avgMpg: 34.1, tankSize: 12.4, fuelType: 'Regular',
  },
];

const PLACES = [
  { name: 'Home', addr: '128 Linden Way' },
  { name: 'Office', addr: '450 Market St' },
  { name: "Maeve's School", addr: '88 Crescent Dr' },
  { name: 'Whole Foods', addr: '1100 W Lake Blvd' },
  { name: "Dad's House", addr: '22 Hillcrest Rd' },
  { name: 'Tahoe Cabin', addr: '15 Pine Loop' },
  { name: 'Airport', addr: 'Terminal 2, SFO' },
  { name: 'Gym', addr: '3rd & Mission' },
  { name: 'Dentist', addr: '900 Sutter St' },
  { name: 'Costco', addr: '2300 Industrial Blvd' },
  { name: 'Soccer Field', addr: 'McKinley Park' },
  { name: 'Coffee', addr: 'Ritual Roasters' },
];

// Generate ~120 days of trips, rich data (10/10)
function genTrips() {
  const trips = [];
  const start = new Date('2026-01-01');
  const end = new Date('2026-05-03');
  const dayMs = 86400000;
  const totalDays = Math.round((end - start) / dayMs);

  let id = 1000;
  let rng = 1;
  const r = () => { rng = (rng * 9301 + 49297) % 233280; return rng / 233280; };

  const purposes = ['Personal', 'Errand', 'Commute', 'Family', 'Trip'];

  for (let d = 0; d < totalDays; d++) {
    const date = new Date(start.getTime() + d * dayMs);
    const dow = date.getDay();
    const isWeekend = dow === 0 || dow === 6;
    const tripsToday = isWeekend ? Math.floor(r() * 4) : 2 + Math.floor(r() * 4);

    let hourCursor = 7 + Math.floor(r() * 2);
    for (let t = 0; t < tripsToday; t++) {
      const fromIdx = Math.floor(r() * PLACES.length);
      let toIdx = Math.floor(r() * PLACES.length);
      while (toIdx === fromIdx) toIdx = Math.floor(r() * PLACES.length);

      const dist = +(2 + r() * 38).toFixed(1);
      const durMin = Math.round(dist * (1.8 + r() * 1.4));
      const startMin = hourCursor * 60 + Math.floor(r() * 50);
      const endMin = startMin + durMin;
      hourCursor = Math.floor(endMin / 60) + 1 + Math.floor(r() * 2);

      const purpose = purposes[Math.floor(r() * purposes.length)];
      const mpg = +(22 + r() * 18).toFixed(1);
      const fuel = +(dist / mpg).toFixed(2);
      const cost = +(fuel * (3.95 + r() * 0.6)).toFixed(2);
      const vehicleId = r() > 0.3 ? 'v1' : 'v2';
      const auto = r() > 0.4;

      trips.push({
        id: 'T' + id++,
        date: date.toISOString().slice(0, 10),
        dow,
        startTime: fmtTime(startMin),
        endTime: fmtTime(endMin),
        startMin, endMin, durMin,
        from: PLACES[fromIdx],
        to: PLACES[toIdx],
        distance: dist,
        avgSpeed: +(dist / (durMin / 60)).toFixed(1),
        purpose,
        mpg, fuel, cost,
        vehicleId,
        autoDetected: auto,
        reviewed: !auto || r() > 0.15,
        notes: r() > 0.85 ? sampleNote(toIdx) : '',
      });
    }
  }
  return trips.reverse(); // newest first
}

function fmtTime(totalMin) {
  const h = Math.floor(totalMin / 60) % 24;
  const m = totalMin % 60;
  const h12 = ((h + 11) % 12) + 1;
  return `${h12}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
}

function sampleNote(toIdx) {
  const notes = ['Returned with groceries', 'Picked up Maeve', 'Light traffic', 'Detour via 5th', 'Quick stop'];
  return notes[toIdx % notes.length];
}

const TRIPS = genTrips();

// Fuel-up history
const FUEL_UPS = [
  { id: 'F1', date: '2026-04-29', vehicleId: 'v1', gallons: 13.2, ppg: 4.29, total: 56.63, odo: 47621, station: 'Shell — Embarcadero' },
  { id: 'F2', date: '2026-04-15', vehicleId: 'v1', gallons: 14.0, ppg: 4.19, total: 58.66, odo: 47228, station: 'Costco Fuel' },
  { id: 'F3', date: '2026-04-02', vehicleId: 'v1', gallons: 12.8, ppg: 4.35, total: 55.68, odo: 46831, station: 'Chevron — 4th St' },
  { id: 'F4', date: '2026-03-19', vehicleId: 'v1', gallons: 13.6, ppg: 4.41, total: 59.98, odo: 46442, station: 'Shell — Embarcadero' },
  { id: 'F5', date: '2026-03-04', vehicleId: 'v1', gallons: 13.1, ppg: 4.55, total: 59.61, odo: 46072, station: 'Costco Fuel' },
  { id: 'F6', date: '2026-04-22', vehicleId: 'v2', gallons: 10.8, ppg: 4.21, total: 45.47, odo: 89218, station: '76 — Mission' },
];

// Monthly aggregates
function monthlyAggs() {
  const months = {};
  TRIPS.forEach(t => {
    const m = t.date.slice(0, 7);
    if (!months[m]) months[m] = { month: m, trips: 0, distance: 0, fuel: 0, cost: 0 };
    months[m].trips++;
    months[m].distance += t.distance;
    months[m].fuel += t.fuel;
    months[m].cost += t.cost;
  });
  return Object.values(months).map(m => ({
    ...m,
    distance: +m.distance.toFixed(0),
    fuel: +m.fuel.toFixed(1),
    cost: +m.cost.toFixed(0),
  })).sort((a, b) => a.month.localeCompare(b.month));
}

const MONTHLY = monthlyAggs();

// Today's stats from latest day with trips
const TODAY_TRIPS = TRIPS.filter(t => t.date === TRIPS[0].date);
const WEEK_TRIPS = TRIPS.slice(0, 28);

function totalsFor(trips) {
  return {
    count: trips.length,
    distance: +trips.reduce((s, t) => s + t.distance, 0).toFixed(1),
    fuel: +trips.reduce((s, t) => s + t.fuel, 0).toFixed(2),
    cost: +trips.reduce((s, t) => s + t.cost, 0).toFixed(2),
    durMin: trips.reduce((s, t) => s + t.durMin, 0),
  };
}

const TODAY_TOTALS = totalsFor(TODAY_TRIPS);
const WEEK_TOTALS = totalsFor(WEEK_TRIPS);
const MONTH_TOTALS = totalsFor(TRIPS.filter(t => t.date.startsWith('2026-04')));
const YTD_TOTALS = totalsFor(TRIPS);

Object.assign(window, {
  VEHICLES, PLACES, TRIPS, FUEL_UPS, MONTHLY,
  TODAY_TRIPS, WEEK_TRIPS,
  TODAY_TOTALS, WEEK_TOTALS, MONTH_TOTALS, YTD_TOTALS,
  fmtTime,
});
