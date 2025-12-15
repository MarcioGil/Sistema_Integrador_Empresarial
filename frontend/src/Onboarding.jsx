import React, { useState } from 'react';

export default function Onboarding({ onFinish }) {
  const [step, setStep] = useState(0);
  const steps = [
    {
      title: 'Bem-vindo!',
      text: 'Este é o Sistema Integrador Empresarial. Aqui você gerencia tudo em um só lugar.'
    },
    {
      title: 'Assinatura SaaS',
      text: 'Assine um plano para liberar todas as funcionalidades e garantir suporte premium.'
    },
    {
      title: 'Mobile e PWA',
      text: 'Use no celular, instale como app e acesse de qualquer lugar.'
    }
  ];

  return (
    <div style={{ maxWidth: 320, margin: 'auto', padding: 24, background: '#f0fdfa', borderRadius: 8 }}>
      <h2>{steps[step].title}</h2>
      <p>{steps[step].text}</p>
      <button onClick={() => {
        if (step < steps.length - 1) setStep(step + 1);
        else onFinish && onFinish();
      }} style={{ marginTop: 16 }}>
        {step < steps.length - 1 ? 'Próximo' : 'Começar'}
      </button>
    </div>
  );
}
