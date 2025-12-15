import React, { useEffect, useState } from 'react';
import api from './api';

export default function PainelSaaS() {
  const [assinatura, setAssinatura] = useState(null);
  const [planos, setPlanos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const resAssinatura = await api.get('/financeiro/assinaturas/');
        setAssinatura(resAssinatura.data[0]);
        const resPlanos = await api.get('/financeiro/planos/');
        setPlanos(resPlanos.data);
      } catch (err) {
        setError('Erro ao carregar dados do SaaS');
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleAssinar = async planoId => {
    // Aqui você integraria com Stripe/Mercado Pago
    alert('Assinatura iniciada para o plano ' + planoId);
  };

  if (loading) return <div>Carregando painel...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 24, border: '1px solid #eee', borderRadius: 8 }}>
      <h2>Minha Assinatura</h2>
      {assinatura ? (
        <div>
          <p><b>Plano:</b> {assinatura.plano_detail.nome}</p>
          <p><b>Vencimento:</b> {new Date(assinatura.fim).toLocaleDateString()}</p>
          <p><b>Status:</b> {assinatura.ativa ? 'Ativa' : 'Expirada'}</p>
        </div>
      ) : (
        <div>Nenhuma assinatura ativa.</div>
      )}
      <h3>Assine agora</h3>
      {planos.map(plano => (
        <div key={plano.id} style={{ marginBottom: 12 }}>
          <b>{plano.nome}</b> - R$ {plano.preco}
          <button style={{ marginLeft: 8 }} onClick={() => handleAssinar(plano.id)}>Assinar</button>
        </div>
      ))}
    </div>
  );
}
