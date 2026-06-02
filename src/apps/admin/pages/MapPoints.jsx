import { useState, useMemo, useEffect, useRef } from 'react';
import { useAppStore } from '../../../store/appStore';
import { MapPin, Trash2, Edit3, Plus, Search, Filter, X, Save, Info, Compass, CheckCircle } from 'lucide-react';

export default function MapPoints() {
  const { mapLocations, addLocation, updateLocation, deleteLocation } = useAppStore();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // 'all', 'green_zone', 'recycling'
  
  // Editor state
  const [isEditing, setIsEditing] = useState(false);
  const [editingPoint, setEditingPoint] = useState(null); // null if adding new
  const [formName, setFormName] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formLat, setFormLat] = useState('41.55');
  const [formLng, setFormLng] = useState('60.63');
  const [formReward, setFormReward] = useState('20');
  const [formType, setFormType] = useState('recycling');
  const [formDescription, setFormDescription] = useState('');
  
  const [selectedLocId, setSelectedLocId] = useState(null);
  const [toast, setToast] = useState('');

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const tempMarkerRef = useRef(null);

  // Filtered locations
  const filteredPoints = useMemo(() => {
    return mapLocations.filter(loc => {
      const matchesSearch = loc.name.toLowerCase().includes(search.toLowerCase()) || 
                            loc.address.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === 'all' ? true : loc.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [mapLocations, search, typeFilter]);

  // Show status notification
  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  // Initialize Map
  useEffect(() => {
    if (!mapRef.current || !window.L || mapInstanceRef.current) return;

    const L = window.L;
    // Center of Urgench
    const map = L.map(mapRef.current, {
      center: [41.55, 60.63],
      zoom: 12,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 20
    }).addTo(map);

    mapInstanceRef.current = map;

    // Listen for clicks on the map to pick coordinates
    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      
      // Update form values if editor is active
      setFormLat(lat.toFixed(6));
      setFormLng(lng.toFixed(6));

      // Draw or update temporary marker
      if (tempMarkerRef.current) {
        tempMarkerRef.current.setLatLng([lat, lng]);
      } else {
        const tempIcon = L.divIcon({
          className: 'temp-map-marker',
          html: `
            <div style="
              background: #EF4444;
              color: #fff;
              padding: 8px;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              box-shadow: 0 4px 12px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              width: 32px;
              height: 32px;
              border: 2px solid #fff;
              animation: bounce 0.5s infinite alternate;
            ">
              <div style="transform: rotate(45deg); font-weight: 800; font-size: 10px;">★</div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 32]
        });
        tempMarkerRef.current = L.marker([lat, lng], { icon: tempIcon }).addTo(map);
      }
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Sync Markers when points list or selected point changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !window.L) return;
    const L = window.L;

    // Remove old markers
    Object.values(markersRef.current).forEach(m => m.remove());
    markersRef.current = {};

    // Plot all map locations
    mapLocations.forEach(loc => {
      const isSelected = selectedLocId === loc.id;
      const isEco = loc.type === 'green_zone';
      const markerColor = isEco ? '#16A34A' : '#0284C7';

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
        className: 'custom-admin-marker',
        html: iconHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 32]
      });

      const marker = L.marker([loc.lat, loc.lng], { icon: customIcon })
        .addTo(map)
        .on('click', () => {
          setSelectedLocId(loc.id);
          // Fill editor with this point to make editing easy
          handleStartEdit(loc);
          map.setView([loc.lat, loc.lng], Math.max(map.getZoom(), 14), { animate: true });
        });

      markersRef.current[loc.id] = marker;
    });

  }, [mapLocations, selectedLocId]);

  // Clean temp marker when editor closes
  useEffect(() => {
    if (!isEditing && tempMarkerRef.current) {
      tempMarkerRef.current.remove();
      tempMarkerRef.current = null;
    }
  }, [isEditing]);

  const handleStartAdd = () => {
    setEditingPoint(null);
    setFormName('');
    setFormAddress('');
    setFormLat('41.550000');
    setFormLng('60.630000');
    setFormReward('20');
    setFormType('recycling');
    setFormDescription('');
    setIsEditing(true);
    
    // Position temp marker at default
    const map = mapInstanceRef.current;
    if (map && window.L) {
      map.setView([41.55, 60.63], 12);
      if (tempMarkerRef.current) tempMarkerRef.current.remove();
      const L = window.L;
      const tempIcon = L.divIcon({
        className: 'temp-map-marker',
        html: `
          <div style="background: #EF4444; color: #fff; padding: 8px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); box-shadow: 0 4px 12px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border: 2px solid #fff;">
            <div style="transform: rotate(45deg); font-weight: 800; font-size: 10px;">★</div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32]
      });
      tempMarkerRef.current = L.marker([41.55, 60.63], { icon: tempIcon }).addTo(map);
    }
  };

  const handleStartEdit = (loc) => {
    setEditingPoint(loc);
    setFormName(loc.name);
    setFormAddress(loc.address);
    setFormLat(loc.lat.toString());
    setFormLng(loc.lng.toString());
    setFormReward(loc.reward.toString());
    setFormType(loc.type);
    setFormDescription(loc.description || '');
    setIsEditing(true);
    setSelectedLocId(loc.id);

    const map = mapInstanceRef.current;
    if (map) {
      map.setView([loc.lat, loc.lng], 14, { animate: true });
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formName.trim() || !formAddress.trim()) {
      triggerToast("Iltimos, nom va manzilni kiriting!");
      return;
    }

    const payload = {
      name: formName,
      address: formAddress,
      lat: parseFloat(formLat) || 41.55,
      lng: parseFloat(formLng) || 60.63,
      reward: parseInt(formReward) || 20,
      type: formType,
      description: formDescription,
    };

    if (editingPoint) {
      updateLocation({ id: editingPoint.id, ...payload });
      triggerToast("Punkt muvaffaqiyatli tahrirlandi!");
    } else {
      addLocation(payload);
      triggerToast("Yangi punkt muvaffaqiyatli qo'shildi!");
    }

    setIsEditing(false);
    setEditingPoint(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Rostdan ham ushbu punktni o'chirmoqchimisiz?")) {
      deleteLocation(id);
      triggerToast("Punkt o'chirildi.");
      if (selectedLocId === id) setSelectedLocId(null);
      if (editingPoint && editingPoint.id === id) {
        setIsEditing(false);
        setEditingPoint(null);
      }
    }
  };

  const handleSelectListItem = (loc) => {
    setSelectedLocId(loc.id);
    const map = mapInstanceRef.current;
    if (map) {
      map.setView([loc.lat, loc.lng], 15, { animate: true });
    }
    handleStartEdit(loc);
  };

  return (
    <div style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed', top: '24px', right: '24px', zIndex: 9999,
          background: 'var(--c-green-600)', color: '#fff', padding: '.75rem 1.25rem',
          borderRadius: 'var(--r-md)', boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          display: 'flex', alignItems: 'center', gap: '.5rem', fontWeight: 600,
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <CheckCircle size={18} /> {toast}
        </div>
      )}

      {/* Header Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontWeight: 800, fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '.5rem' }}>
            <Compass className="text-primary" /> Punktlar va Xarita
          </h1>
          <p className="text-secondary text-sm">Topshirish punktlari va ekologik zonalarni boshqarish</p>
        </div>
        <button className="btn btn-primary" onClick={handleStartAdd} style={{ gap: '.35rem' }}>
          <Plus size={16} /> Yangi punkt qo'shish
        </button>
      </div>

      {/* Main Splitscreen Layout */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', minHeight: 0 }}>
        
        {/* Left Hand: List & Editor Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: 0 }}>
          
          {/* If Editing/Adding show Form, else show List */}
          {isEditing ? (
            <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '.75rem' }}>
                <h3 style={{ fontWeight: 800, fontSize: '1.1rem' }}>
                  {editingPoint ? '✍️ Punktni tahrirlash' : '➕ Yangi punkt yaratish'}
                </h3>
                <button className="btn btn-ghost" style={{ padding: 4 }} onClick={() => { setIsEditing(false); setEditingPoint(null); }}>
                  <X size={20} />
                </button>
              </div>

              <div style={{ background: 'var(--c-green-50)', border: '1px dashed var(--c-green-300)', padding: '.75rem', borderRadius: 'var(--r-md)', display: 'flex', gap: '.5rem', alignItems: 'center' }}>
                <Info size={16} className="text-primary" style={{ flexShrink: 0 }} />
                <p style={{ fontSize: '.75rem', color: 'var(--c-green-800)', lineHeight: 1.3 }}>
                  <strong>Maslahat:</strong> Koordinatalarni kiritish uchun o'ng tomondagi xaritaga istalgan joyga bosing!
                </p>
              </div>

              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                  <div className="input-group">
                    <label className="input-label">Punkt nomi *</label>
                    <input className="input-field" value={formName} onChange={e => setFormName(e.target.value)} placeholder="Masalan: Smart Bin – Al-Khwarizmi" required />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Turi</label>
                    <select className="input-field" value={formType} onChange={e => setFormType(e.target.value)}>
                      <option value="recycling">Topshirish punkti (Recycling)</option>
                      <option value="green_zone">Yashil hudud (Eco Zone)</option>
                    </select>
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Manzili *</label>
                  <input className="input-field" value={formAddress} onChange={e => setFormAddress(e.target.value)} placeholder="Masalan: Urgench shahar, Al-Xorazmiy ko'chasi" required />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <div className="input-group">
                    <label className="input-label">Kenglik (Latitude)</label>
                    <input className="input-field" type="number" step="any" value={formLat} onChange={e => setFormLat(e.target.value)} required />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Uzunlik (Longitude)</label>
                    <input className="input-field" type="number" step="any" value={formLng} onChange={e => setFormLng(e.target.value)} required />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Mukofot (Bio-Coin)</label>
                    <input className="input-field" type="number" value={formReward} onChange={e => setFormReward(e.target.value)} min="1" required />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Tavsifi (Description)</label>
                  <textarea className="input-field" value={formDescription} onChange={e => setFormDescription(e.target.value)} rows={3} placeholder="Foydalanuvchilarga ko'rinadigan qisqacha ma'lumot..." />
                </div>

                <div style={{ display: 'flex', gap: '.75rem', marginTop: '.5rem' }}>
                  <button className="btn btn-primary" type="submit" style={{ flex: 1, gap: '.35rem' }}>
                    <Save size={16} /> Saqlash
                  </button>
                  <button className="btn btn-ghost" type="button" onClick={() => { setIsEditing(false); setEditingPoint(null); }} style={{ flex: 1 }}>
                    Bekor qilish
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, minHeight: 0 }}>
              
              {/* Filter and Search */}
              <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--c-text-muted)' }} />
                  <input className="input-field" style={{ paddingLeft: '2.25rem' }} value={search} onChange={e => setSearch(e.target.value)} placeholder="Nom yoki manzil bo'yicha qidirish..." />
                </div>
                
                <div style={{ display: 'flex', background: 'var(--c-green-50)', padding: '2px', borderRadius: 'var(--r-md)' }}>
                  <button onClick={() => setTypeFilter('all')} style={{
                    padding: '.45rem .85rem', fontSize: '.75rem', fontWeight: 700, borderRadius: 'var(--r-sm)',
                    border: 'none', transition: 'all 0.2s', cursor: 'pointer',
                    background: typeFilter === 'all' ? 'var(--c-green-600)' : 'transparent',
                    color: typeFilter === 'all' ? '#fff' : 'var(--c-text-secondary)'
                  }}>Barchasi</button>
                  <button onClick={() => setTypeFilter('recycling')} style={{
                    padding: '.45rem .85rem', fontSize: '.75rem', fontWeight: 700, borderRadius: 'var(--r-sm)',
                    border: 'none', transition: 'all 0.2s', cursor: 'pointer',
                    background: typeFilter === 'recycling' ? 'var(--c-green-600)' : 'transparent',
                    color: typeFilter === 'recycling' ? '#fff' : 'var(--c-text-secondary)'
                  }}>Punktlar</button>
                  <button onClick={() => setTypeFilter('green_zone')} style={{
                    padding: '.45rem .85rem', fontSize: '.75rem', fontWeight: 700, borderRadius: 'var(--r-sm)',
                    border: 'none', transition: 'all 0.2s', cursor: 'pointer',
                    background: typeFilter === 'green_zone' ? 'var(--c-green-600)' : 'transparent',
                    color: typeFilter === 'green_zone' ? '#fff' : 'var(--c-text-secondary)'
                  }}>Zonalar</button>
                </div>
              </div>

              {/* Scrollable Points List */}
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
                {filteredPoints.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--c-text-muted)' }}>
                    <MapPin size={40} style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
                    <p style={{ fontWeight: 600 }}>Punktlar topilmadi</p>
                    <p style={{ fontSize: '.8rem' }}>Qidiruv shartlarini o'zgartirib ko'ring yoki yangi punkt qo'shing</p>
                  </div>
                ) : (
                  filteredPoints.map(loc => {
                    const isSelected = selectedLocId === loc.id;
                    const isEco = loc.type === 'green_zone';

                    return (
                      <div key={loc.id} 
                        onClick={() => handleSelectListItem(loc)}
                        style={{
                          padding: '1rem', borderRadius: 'var(--r-lg)',
                          border: isSelected ? '2px solid var(--c-green-500)' : '1px solid rgba(0,0,0,0.06)',
                          background: isSelected ? 'var(--c-green-50)' : 'rgba(255,255,255,0.7)',
                          display: 'flex', gap: '.75rem', cursor: 'pointer', transition: 'all 0.2s',
                          boxShadow: isSelected ? 'var(--shadow-md)' : 'none'
                        }}>
                        <div style={{
                          width: 40, height: 40, borderRadius: '12px',
                          background: isEco ? 'rgba(22,163,74,0.1)' : 'rgba(2,132,199,0.1)',
                          display: 'flex', alignItems: 'center', justifyCentent: 'center',
                          color: isEco ? '#16A34A' : '#0284C7', flexShrink: 0
                        }}>
                          <MapPin size={20} style={{ margin: 'auto' }} />
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '.35rem', marginBottom: 2 }}>
                            <span className={`badge ${isEco ? 'badge-green' : 'badge-blue'}`} style={{ fontSize: '.65rem', padding: '2px 6px' }}>
                              {isEco ? 'Eco Zona' : 'Topshirish punkti'}
                            </span>
                            <span style={{ fontSize: '.7rem', color: 'var(--c-text-muted)', fontWeight: 600, marginLeft: 'auto' }}>
                              ⚡ {loc.reward} Coin
                            </span>
                          </div>
                          <h4 style={{ fontWeight: 800, fontSize: '.9rem', color: 'var(--c-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {loc.name}
                          </h4>
                          <p style={{ fontSize: '.75rem', color: 'var(--c-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {loc.address}
                          </p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '.25rem', justifyContent: 'center' }} onClick={e => e.stopPropagation()}>
                          <button className="btn btn-ghost" style={{ padding: 6, color: 'var(--c-text-muted)' }} onClick={() => handleStartEdit(loc)}>
                            <Edit3 size={14} />
                          </button>
                          <button className="btn btn-ghost" style={{ padding: 6, color: '#FC8181' }} onClick={() => handleDelete(loc.id)}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Hand: Interactive Map */}
        <div style={{ display: 'flex', flexDirection: 'column', position: 'relative', borderRadius: 'var(--r-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-md)', border: '1px solid rgba(0,0,0,0.06)' }}>
          <div ref={mapRef} style={{ width: '100%', height: '100%', zIndex: 1 }} />
          
          <div style={{
            position: 'absolute', top: 12, right: 12, zIndex: 10,
            background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)',
            padding: '.5rem .75rem', borderRadius: 'var(--r-md)', fontSize: '.7rem',
            border: '1px solid rgba(0,0,0,0.05)', display: 'flex', gap: '.75rem', pointerEvents: 'none'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.25rem' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#16A34A' }} />
              <span style={{ fontWeight: 600, color: '#16A34A' }}>Eco Zona</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.25rem' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#0284C7' }} />
              <span style={{ fontWeight: 600, color: '#0284C7' }}>Topshirish punkti</span>
            </div>
          </div>
        </div>

      </div>

      <style>{`
        .custom-admin-marker {
          background: transparent !important;
          border: none !important;
        }
        .temp-map-marker {
          background: transparent !important;
          border: none !important;
        }
        @keyframes bounce {
          0% { transform: translateY(0) rotate(-45deg); }
          100% { transform: translateY(-6px) rotate(-45deg); }
        }
      `}</style>
    </div>
  );
}
