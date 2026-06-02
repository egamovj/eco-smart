import { useEffect } from 'react';

export default function Splash() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', height: '100dvh',
      background: 'linear-gradient(160deg, #1B4332 0%, #2D6A4F 40%, #52B788 100%)',
      gap: '1.5rem',
    }}>
      <div style={{ position: 'relative', width: 100, height: 100 }}>
        <div style={{
          width: 120, height: 120, borderRadius: '50%',
          background: 'rgba(255,255,255,.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden',
          animation: 'float 2s ease-in-out infinite, glow 2s ease-in-out infinite',
        }}>
          <img src="/logo.png" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
        {[0, 120, 240].map((deg, i) => (
          <div key={i} style={{
            position: 'absolute', top: '50%', left: '50%',
            width: 10, height: 10, borderRadius: '50%',
            background: 'rgba(255,255,255,.6)',
            transform: `rotate(${deg}deg) translateX(60px) translateY(-50%)`,
            animation: `spin ${2 + i * 0.5}s linear infinite`,
            transformOrigin: '50% 50%',
          }} />
        ))}
      </div>

      <div style={{ textAlign: 'center', color: '#fff' }}>
        <h1 style={{ fontWeight: 800, fontSize: '2.2rem', letterSpacing: '-0.03em', textShadow: '0 2px 12px rgba(0,0,0,.2)' }}>
          Green Khorezm
        </h1>
        <p style={{ fontSize: '.95rem', opacity: .75, marginTop: '.35rem', fontWeight: 400 }}>
          Chiqindidan – Mukofotga Platforma
        </p>
      </div>

      <div style={{ width: 140, height: 4, background: 'rgba(255,255,255,.2)', borderRadius: 9999, overflow: 'hidden', marginTop: '1rem' }}>
        <div style={{
          height: '100%', background: 'rgba(255,255,255,.85)', borderRadius: 9999,
          animation: 'progressLoad 2s ease-out forwards',
        }} />
      </div>

      <style>{`
        @keyframes progressLoad {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </div>
  );
}
