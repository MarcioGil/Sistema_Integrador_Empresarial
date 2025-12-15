import React, { useState, useEffect } from 'react';
import Login from './Login.jsx';
import Splash from './Splash.jsx';
import PainelSaaS from './PainelSaaS.jsx';
import Onboarding from './Onboarding.jsx';
import AssineAgora from './AssineAgora.jsx';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [logged, setLogged] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1200);
    setLogged(!!localStorage.getItem('access_token'));
  }, []);

  if (loading) return <Splash />;
  if (showOnboarding) return <Onboarding onFinish={() => setShowOnboarding(false)} />;
  if (!logged) return <Login onLogin={() => setLogged(true)} />;

  return (
    <div style={{ padding: 24 }}>
      <h1>Bem-vindo ao Sistema Integrador!</h1>
      <PainelSaaS />
      <AssineAgora />
      {/* Aqui vai o restante do app */}
    </div>
  );
}
