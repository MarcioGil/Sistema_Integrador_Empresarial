import React from 'react';

export default function Splash() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0d9488', color: '#fff' }}>
      <img src="/icon-192.png" alt="Logo" style={{ width: 96, marginBottom: 24 }} />
      <h1>Sistema Integrador</h1>
      <p>Carregando...</p>
    </div>
  );
}
