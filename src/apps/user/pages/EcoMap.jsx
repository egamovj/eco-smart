import { useState, useMemo, useEffect, useRef } from 'react';
import { useAppStore } from '../../../store/appStore';
import { MapPin, Info, Navigation, CheckCircle2, Leaf, Recycle, X, Compass, ChevronRight } from 'lucide-react';

export default function EcoMap() {
  const { mapLocations, checkIn } = useAppStore();
  const [mode, setMode] = useState('eco'); // 'eco' or 'recycling'
  const [selectedLoc, setSelectedLoc] = useState(null);
  const [showCheckInSuccess, setShowCheckInSuccess] = useState(false);

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  const filteredLocations = useMemo(() => {
    const type = mode === 'eco' ? 'green_zone' : 'recycling';
    return mapLocations.filter(loc => loc.type === type);
  }, [mapLocations, mode]);

  // Handle map initialization
  useEffect(() => {
    if (!mapRef.current || !window.L || mapInstanceRef.current) return;

    const L = window.L;
    // Centered around Khorezm region / Urgench
    const map = L.map(mapRef.current, {
      center: [41.55, 60.63],
      zoom: 12,
      zoomControl: false,
    });

    // Sleek CartoDB Voyager theme
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 20
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when filtered locations or selection changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !window.L) return;
    const L = window.L;

    // Clear old markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    filteredLocations.forEach(loc => {
      const isEco = mode === 'eco';
      const isSelected = selectedLoc?.id === loc.id;
      const markerColor = loc.checkedIn 
        ? '#9CA3AF' 
        : (isEco ? '#16A34A' : '#0284C7');

      const iconHtml = `
        <div style="
          background: ${markerColor};
          color: #fff;
          padding: 8px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg) scale(${isSelected ? 1.25 : 1});
          box-shadow: 0 4px 12px rgba(0,0,0,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border: 2px solid #fff;
          transition: all 0.2s ease;
        ">
          <div style="transform: rotate(45deg); display: flex; align-items: center; justify-content: center;">
            ${isEco 
              ? '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.58-1 9.8A7 7 0 0 1 11 20z"></path><path d="M19 2c-2.26 4.33-5.27 7.14-8 10"></path></svg>'
              : '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path></svg>'
            }
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-map-marker',
        html: iconHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 32]
      });

      const marker = L.marker([loc.lat, loc.lng], { icon: customIcon })
        .addTo(map)
        .on('click', () => {
          setSelectedLoc(loc);
          map.setView([loc.lat, loc.lng], Math.max(map.getZoom(), 14), { animate: true });
        });

      markersRef.current.push(marker);
    });

    // Fit map view to markers bounds
    if (filteredLocations.length > 0) {
      const group = L.featureGroup(markersRef.current);
      map.fitBounds(group.getBounds().pad(0.15));
    }
  }, [filteredLocations, mode, selectedLoc]);

  const handleCheckIn = (id) => {
    const success = checkIn(id);
    if (success) {
      setShowCheckInSuccess(true);
      setTimeout(() => setShowCheckInSuccess(false), 3000);
      setSelectedLoc(prev => prev ? { ...prev, checkedIn: true } : null);
    }
  };

  const handleLocSelect = (loc) => {
    setSelectedLoc(loc);
    const map = mapInstanceRef.current;
    if (map) {
      map.setView([loc.lat, loc.lng], 14, { animate: true });
    }
  };

  return (
    <div style={{ height: 'calc(100vh - 84px)', display: 'flex', flexDirection: 'column', background: '#F0FDF4', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        .custom-map-marker {
          background: transparent !important;
          border: none !important;
        }
        .leaflet-container {
          font-family: inherit;
        }
      `}</style>
      
      {/* Header Overlay */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '1.25rem', zIndex: 10, background: 'linear-gradient(180deg, rgba(240,253,244,0.95) 0%, rgba(240,253,244,0) 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--c-green-800)' }}>Eco Map</h2>
            <p style={{ fontSize: '.8rem', color: 'var(--c-green-600)', fontWeight: 600 }}>Explore & Earn Bio-Coins</p>
          </div>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-md)', color: 'var(--c-green-600)' }}>
            <Compass size={24} className="animate-float" />
          </div>
        </div>

        {/* Mode Toggle */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.8)', padding: '4px', borderRadius: 'var(--r-full)', boxShadow: 'var(--shadow-sm)', backdropFilter: 'blur(8px)', border: '1px solid rgba(0,0,0,0.04)' }}>
          <button 
            onClick={() => setMode('eco')}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.5rem', padding: '.65rem', borderRadius: 'var(--r-full)', fontSize: '.85rem', fontWeight: 700, transition: 'all 0.3s', background: mode === 'eco' ? 'var(--c-green-600)' : 'transparent', color: mode === 'eco' ? '#fff' : 'var(--c-text-muted)' }}
          >
            <Leaf size={16} /> Eco Mode
          </button>
          <button 
            onClick={() => setMode('recycling')}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.5rem', padding: '.65rem', borderRadius: 'var(--r-full)', fontSize: '.85rem', fontWeight: 700, transition: 'all 0.3s', background: mode === 'recycling' ? 'var(--c-green-600)' : 'transparent', color: mode === 'recycling' ? '#fff' : 'var(--c-text-muted)' }}
          >
            <Recycle size={16} /> Recycling
          </button>
        </div>
      </div>

      {/* Map Visualization Container */}
      <div ref={mapRef} style={{ flex: 1, position: 'relative', background: '#E8F5E9', zIndex: 1 }} />

      {/* Location Detail Sheet Overlay */}
      {selectedLoc && (
        <div className="overlay" style={{ background: 'rgba(0,0,0,0.3)', zIndex: 300 }} onClick={() => setSelectedLoc(null)}>
          <div className="sheet animate-slide-up" style={{ padding: '1.5rem 1.5rem calc(1.5rem + env(safe-area-inset-bottom, 24px))', maxHeight: '85vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div className="sheet-handle" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '.25rem' }}>
                  <span className={`badge ${mode === 'eco' ? 'badge-green' : 'badge-blue'}`}>
                    {mode === 'eco' ? 'Eco Area' : 'Recycling Hub'}
                  </span>
                  {selectedLoc.checkedIn && <span className="badge badge-gray">Checked-in</span>}
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{selectedLoc.name}</h3>
                <p style={{ fontSize: '.85rem', color: 'var(--c-text-muted)', display: 'flex', alignItems: 'center', gap: '.25rem', marginTop: '.25rem' }}>
                  <MapPin size={14} /> {selectedLoc.address}
                </p>
              </div>
              <button onClick={() => setSelectedLoc(null)} style={{ color: 'var(--c-text-muted)', padding: '.5rem' }}>
                <X size={24} />
              </button>
            </div>

            <div className="card-glass" style={{ padding: '1rem', marginBottom: '1.5rem', background: 'rgba(240,253,244,0.5)', border: '1px solid var(--c-green-100)' }}>
              <div style={{ display: 'flex', gap: '.75rem', alignItems: 'center' }}>
                <div style={{ width: 40, height: 40, borderRadius: 'var(--r-md)', background: 'var(--c-green-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--c-green-600)' }}>
                  <Info size={20} />
                </div>
                <p style={{ fontSize: '.85rem', color: 'var(--c-green-900)', fontWeight: 500 }}>{selectedLoc.description}</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div>
                <p style={{ fontSize: '.75rem', color: 'var(--c-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em' }}>Reward</p>
                <div className="coin-display" style={{ fontSize: '1.25rem' }}>
                  <div className="coin-icon" style={{ width: 24, height: 24 }}>₿</div>
                  +{selectedLoc.reward} Bio-Coins
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '.75rem', color: 'var(--c-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em' }}>Eco Score</p>
                <p style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--c-green-600)' }}>+{selectedLoc.reward * 2} pts</p>
              </div>
            </div>

            <button 
              className={`btn btn-lg btn-full ${selectedLoc.checkedIn ? 'btn-ghost' : 'btn-primary'}`}
              disabled={selectedLoc.checkedIn}
              onClick={() => handleCheckIn(selectedLoc.id)}
              style={{ gap: '.75rem' }}
            >
              {selectedLoc.checkedIn ? (
                <><CheckCircle2 size={20} /> Already Visited</>
              ) : (
                <><Navigation size={20} /> Check-in here</>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {showCheckInSuccess && (
        <div style={{ position: 'absolute', top: '100px', left: '1.25rem', right: '1.25rem', zIndex: 100 }}>
          <div style={{ background: 'var(--c-success)', color: '#fff', padding: '1rem', borderRadius: 'var(--r-md)', boxShadow: 'var(--shadow-lg)', display: 'flex', alignItems: 'center', gap: '.75rem', animation: 'fadeIn 0.3s ease-out' }}>
            <CheckCircle2 size={24} />
            <div>
              <p style={{ fontWeight: 700, fontSize: '.9rem' }}>Check-in Successful!</p>
              <p style={{ fontSize: '.75rem', opacity: 0.9 }}>Bio-Coins added to your wallet.</p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Legend / Quick Stats */}
      <div style={{ position: 'absolute', bottom: '1.5rem', left: '1rem', right: '1rem', display: 'flex', gap: '.75rem', pointerEvents: 'none', zIndex: 10 }}>
        <div style={{ background: 'rgba(255,255,255,0.95)', padding: '.75rem 1rem', borderRadius: 'var(--r-md)', boxShadow: 'var(--shadow-md)', pointerEvents: 'auto', flex: 1, backdropFilter: 'blur(10px)', border: '1px solid rgba(0,0,0,0.05)' }}>
          <p style={{ fontSize: '.65rem', color: 'var(--c-text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '.5rem' }}>Nearby Points</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
            {filteredLocations.slice(0, 2).map(loc => (
              <div key={loc.id} onClick={() => handleLocSelect(loc)} style={{ display: 'flex', alignItems: 'center', gap: '.5rem', cursor: 'pointer' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: loc.checkedIn ? 'var(--c-text-muted)' : (mode === 'eco' ? 'var(--c-green-500)' : 'var(--c-info)') }} />
                <span style={{ fontSize: '.75rem', fontWeight: 600, color: 'var(--c-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{loc.name}</span>
                <ChevronRight size={14} style={{ marginLeft: 'auto', color: 'var(--c-text-muted)' }} />
              </div>
            ))}
          </div>
        </div>
        <div style={{ width: 60, height: 60, background: 'var(--c-green-600)', borderRadius: 'var(--r-md)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: 'var(--shadow-green)', pointerEvents: 'auto' }}>
          <span style={{ fontSize: '.9rem', fontWeight: 800 }}>{filteredLocations.length}</span>
          <span style={{ fontSize: '.5rem', fontWeight: 600 }}>SITES</span>
        </div>
      </div>
    </div>
  );
}

