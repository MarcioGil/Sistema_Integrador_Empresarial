import React from 'react';

export default function AssineAgora() {
  const handleStripe = () => {
    window.open('https://buy.stripe.com/test_00g7s8c2g0g8gkA5kk', '_blank');
  };
  const handleMercadoPago = () => {
    window.open('https://www.mercadopago.com.br/checkout', '_blank');
  };
  return (
    <div style={{ margin: '24px auto', maxWidth: 400, padding: 24, border: '1px solid #eee', borderRadius: 8 }}>
      <h3>Assine agora</h3>
      <button style={{ background: '#635bff', color: '#fff', marginRight: 8, padding: '8px 16px', borderRadius: 4 }} onClick={handleStripe}>
        Pagar com Stripe
      </button>
      <button style={{ background: '#00a650', color: '#fff', padding: '8px 16px', borderRadius: 4 }} onClick={handleMercadoPago}>
        Pagar com Mercado Pago
      </button>
      <p style={{ marginTop: 12, fontSize: 12 }}>Pagamento seguro. Liberação automática após confirmação.</p>
    </div>
  );
}
